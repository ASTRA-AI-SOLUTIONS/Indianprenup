import { loadEnv } from 'vite';
process.env.MY_TEST_VAR = "hello_world";
console.log(loadEnv('development', process.cwd(), '').MY_TEST_VAR);
