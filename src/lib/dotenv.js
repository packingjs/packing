import { existsSync } from 'fs';
import { resolve } from 'path';
import dotenv from 'dotenv';
import { getContext } from '..';

const context = getContext();

// 加载 process.env.NODE_ENV
dotenv.config({
  path: resolve(context, '.env')
});

// 当加载 .env 失败时，终止程序
const { NODE_ENV } = process.env;
if (!NODE_ENV) {
  console.log([
    '[error]: The .env file is not found. ',
    'Please run the following command to create the file in the root of the project:',
    'echo NODE_ENV=local > .env'
  ].join('\n'));
  process.exit(1);
}

const envInProject = resolve(getContext(), `profiles/${NODE_ENV}.env`);
const envInLib = resolve(__dirname, `../../profiles/${NODE_ENV}.env`);
const dotenvConfig = existsSync(envInProject) ? envInProject : envInLib;
dotenv.config({ path: dotenvConfig });
console.log(`[dotenv]\`${dotenvConfig}\` loaded.`);
