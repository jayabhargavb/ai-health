import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Improved environment loading - check both .env and .env.local
console.log('Loading environment variables...');
if (fs.existsSync(path.join(__dirname, '../.env.local'))) {
  console.log('Found .env.local');
  dotenv.config({ path: path.join(__dirname, '../.env.local') });
}
if (fs.existsSync(path.join(__dirname, '../.env'))) {
  console.log('Found .env');
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

import analyzeRouter from './routes/analyze';
import evaluateRouter from './routes/evaluate';

// Add a test route to verify it works
const app = express();
app.use(cors());
app.use(express.json());

// Add a simple test route
app.get('/api/test', (req, res) => {
  res.status(200).json({ 
    message: "API is working!", 
    env: {
      nodeEnv: process.env.NODE_ENV,
      apiKeyConfigured: !!process.env.OPENROUTER_API_KEY,
      apiKeyFormat: process.env.OPENROUTER_API_KEY ? 
        `${process.env.OPENROUTER_API_KEY.substring(0, 6)}...` : 'Not configured'
    }
  });
});

app.use('/api/analyze', analyzeRouter);
app.use('/api/evaluate', evaluateRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`ML pipeline running on port ${PORT}`);
  console.log(`OpenRouter API key configured: ${!!process.env.OPENROUTER_API_KEY}`);
  console.log(`API key prefix: ${process.env.OPENROUTER_API_KEY ? process.env.OPENROUTER_API_KEY.substring(0, 6) : 'MISSING KEY!'}`);
}); 