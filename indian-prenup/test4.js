import { loadEnv } from 'vite';
const env = loadEnv('development', process.cwd(), '');
console.log("KEYS:", Object.keys(env).filter(k => k.includes('GEMINI')));
