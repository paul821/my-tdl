import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Debug: Log the current working directory
  console.log('Current working directory:', process.cwd());
  
  // Debug: List all .env files in the directory
  const envFiles = fs.readdirSync(process.cwd())
    .filter(file => file.startsWith('.env'));
  console.log('Found .env files:', envFiles);
  
  // Load environment variables from .env.local
  const env = loadEnv(mode, process.cwd(), 'VITE_', '.env.local');
  
  console.log('Environment variables:', {
    VITE_FIREBASE_API_KEY: env.VITE_FIREBASE_API_KEY ? '***' : 'missing',
    VITE_FIREBASE_PROJECT_ID: env.VITE_FIREBASE_PROJECT_ID || 'missing',
    VITE_FIREBASE_AUTH_DOMAIN: env.VITE_FIREBASE_AUTH_DOMAIN || 'missing',
    VITE_FIREBASE_STORAGE_BUCKET: env.VITE_FIREBASE_STORAGE_BUCKET || 'missing',
    VITE_FIREBASE_MESSAGING_SENDER_ID: env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'missing',
    VITE_FIREBASE_APP_ID: env.VITE_FIREBASE_APP_ID || 'missing',
  });
  
  return {
    plugins: [react()],
    define: {
      'import.meta.env': env
    }
  };
});
