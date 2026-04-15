const { loadEnv } = require('vite');
process.env.MY_VAR = "test";
const env = loadEnv('production', process.cwd(), '');
console.log("MY_VAR:", env.MY_VAR);
