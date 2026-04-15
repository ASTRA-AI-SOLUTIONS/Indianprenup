import { defineConfig, loadEnv } from 'vite';
console.log("PROCESS ENV KEY:", process.env.GEMINI_API_KEY ? "SET" : "UNSET");
const env = loadEnv('development', '.', '');
console.log("LOADENV KEY:", env.GEMINI_API_KEY ? "SET" : "UNSET");
