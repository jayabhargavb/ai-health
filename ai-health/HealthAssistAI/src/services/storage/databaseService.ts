import * as SQLite from 'expo-sqlite';
import { SymptomCheck } from '../../types';

const DB_NAME = 'healthassist.db';
const SYMPTOM_TABLE = 'symptom_checks';
const USER_TABLE = 'users';
const PROFILE_TABLE = 'user_profiles';

// Safely access the database with type protection
// Use the appropriate method based on the available API
let db: any;

// For Expo SQLite version 11.0.0 and above, createDatabaseAsync is used
if ('createDatabaseAsync' in SQLite) {
  (async () => {
    try {
      // @ts-ignore - Handle newer Expo SQLite API
      db = await SQLite.createDatabaseAsync(DB_NAME);
    } catch (error) {
      console.error('Failed to create database:', error);
    }
  })();
} else {
  // For older versions, use openDatabase
  try {
    // @ts-ignore - Handle older Expo SQLite API
    db = SQLite.openDatabase(DB_NAME);
  } catch (error) {
    console.error('Failed to open database:', error);
    
    // Final fallback attempt
    try {
      // @ts-ignore - Last resort for compatibility
      db = (SQLite as any).default.openDatabase(DB_NAME);
    } catch (e) {
      console.error('All database connection methods failed:', e);
    }
  }
}

// Ensure database operations don't proceed until db is initialized
const ensureDatabase = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
    } else {
      // Wait up to 5 seconds for database to initialize
      let attempts = 0;
      const checkInterval = setInterval(() => {
        attempts++;
        if (db) {
          clearInterval(checkInterval);
          resolve(db);
        } else if (attempts > 10) {
          clearInterval(checkInterval);
          reject(new Error('Database initialization timed out'));
        }
      }, 500);
    }
  });
};

export const initDatabase = async (): Promise<void> => {
  try {
    const database = await ensureDatabase();
    await createSymptomChecksTable(database);
    await createUsersTable(database);
    await createProfilesTable(database);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

const createSymptomChecksTable = (database: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    database.transaction((tx: any) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ${SYMPTOM_TABLE} (
          id TEXT PRIMARY KEY NOT NULL,
          userId TEXT,
          timestamp TEXT,
          symptoms TEXT,
          analysis TEXT,
          severity TEXT,
          confidence REAL
        );`,
        [],
        () => resolve(),
        (_: any, error: any) => { reject(error); return false; }
      );
    });
  });
};

const createUsersTable = (database: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    database.transaction((tx: any) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ${USER_TABLE} (
          id TEXT PRIMARY KEY NOT NULL,
          email TEXT UNIQUE NOT NULL,
          createdAt TEXT
        );`,
        [],
        () => resolve(),
        (_: any, error: any) => { reject(error); return false; }
      );
    });
  });
};

const createProfilesTable = (database: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    database.transaction((tx: any) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ${PROFILE_TABLE} (
          userId TEXT PRIMARY KEY NOT NULL,
          age INTEGER,
          gender TEXT,
          medicalHistory TEXT,
          FOREIGN KEY(userId) REFERENCES ${USER_TABLE}(id)
        );`,
        [],
        () => resolve(),
        (_: any, error: any) => { reject(error); return false; }
      );
    });
  });
};

export const addSymptomCheck = async (check: SymptomCheck): Promise<void> => {
  const database = await ensureDatabase();
  return new Promise((resolve, reject) => {
    database.transaction((tx: any) => {
      tx.executeSql(
        `INSERT INTO ${SYMPTOM_TABLE} (id, userId, timestamp, symptoms, analysis, severity, confidence) VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [
          check.id,
          check.userId,
          check.timestamp.toISOString(),
          JSON.stringify(check.symptoms),
          JSON.stringify(check.analysis),
          check.metadata.severity,
          check.metadata.confidence,
        ],
        () => resolve(),
        (_: any, error: any) => { reject(error); return false; }
      );
    });
  });
};

export const getSymptomHistory = async (userId?: string, limit = 100): Promise<SymptomCheck[]> => {
  const database = await ensureDatabase();
  return new Promise((resolve, reject) => {
    database.transaction((tx: any) => {
      const query = userId 
        ? `SELECT * FROM ${SYMPTOM_TABLE} WHERE userId = ? ORDER BY timestamp DESC LIMIT ?;`
        : `SELECT * FROM ${SYMPTOM_TABLE} ORDER BY timestamp DESC LIMIT ?;`;
      
      const params = userId ? [userId, limit] : [limit];
      
      tx.executeSql(
        query,
        params,
        (_: any, result: any) => {
          const history: SymptomCheck[] = result.rows._array.map((row: any) => ({
            id: row.id,
            userId: row.userId,
            timestamp: new Date(row.timestamp),
            symptoms: JSON.parse(row.symptoms),
            analysis: JSON.parse(row.analysis),
            metadata: {
              severity: row.severity,
              confidence: row.confidence,
            },
          }));
          resolve(history);
        },
        (_: any, error: any) => { reject(error); return false; }
      );
    });
  });
};

export const getSymptomCheckById = async (id: string): Promise<SymptomCheck | null> => {
  const database = await ensureDatabase();
  return new Promise((resolve, reject) => {
    database.transaction((tx: any) => {
      tx.executeSql(
        `SELECT * FROM ${SYMPTOM_TABLE} WHERE id = ?;`,
        [id],
        (_: any, result: any) => {
          if (result.rows._array.length === 0) {
            resolve(null);
            return;
          }
          
          const row = result.rows._array[0];
          const check: SymptomCheck = {
            id: row.id,
            userId: row.userId,
            timestamp: new Date(row.timestamp),
            symptoms: JSON.parse(row.symptoms),
            analysis: JSON.parse(row.analysis),
            metadata: {
              severity: row.severity,
              confidence: row.confidence,
            },
          };
          resolve(check);
        },
        (_: any, error: any) => { reject(error); return false; }
      );
    });
  });
};

export const clearSymptomHistory = async (userId?: string): Promise<void> => {
  const database = await ensureDatabase();
  return new Promise((resolve, reject) => {
    database.transaction((tx: any) => {
      const query = userId
        ? `DELETE FROM ${SYMPTOM_TABLE} WHERE userId = ?;`
        : `DELETE FROM ${SYMPTOM_TABLE};`;
      
      const params = userId ? [userId] : [];
      
      tx.executeSql(
        query,
        params,
        () => resolve(),
        (_: any, error: any) => { reject(error); return false; }
      );
    });
  });
};
