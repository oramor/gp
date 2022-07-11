import * as dotenv from 'dotenv';

const obj = dotenv.config();
console.log(obj);
console.log(process.env.ROOT_DIR);
