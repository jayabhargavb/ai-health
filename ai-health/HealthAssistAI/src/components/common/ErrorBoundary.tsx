import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, info: any) {
    // Log error to monitoring service
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.text}>Something went wrong. Please restart the app.</Text>
        </View>
      );
    }
    return this.props.children;
  }
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { color: 'red', fontSize: 18, textAlign: 'center' },
});
