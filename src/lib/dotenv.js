import { resolve } from 'path';
import dotenv from 'dotenv';
import chalk from 'chalk';
import { getContext } from '..';
import getExistsFilePath from './getExistsFilePath';

const context = getContext();

// 加载 process.env.NODE_ENV
dotenv.config({
  path: resolve(context, '.env')
});

// 当加载 .env 失败时，终止程序
const { NODE_ENV } = process.env;
if (!NODE_ENV) {
  const message = `
[dotenv]: 未能在工程根目录下找到 \`.env\` 文件。
解决方法：
方法1：运行 echo NODE_ENV=local > .env 创建文件。
方法2：启动时传递环境变量 NODE_ENV=<local|beta|production>
`;
  console.log(chalk.red(message));
  process.exit(1);
}

const envInProject = resolve(getContext(), `profiles/${NODE_ENV}.env`);
const envInLib = resolve(__dirname, `../../profiles/${NODE_ENV}.env`);
const dotenvConfig = getExistsFilePath(envInProject, envInLib);
try {
  dotenv.config({ path: dotenvConfig });
  console.log(`[dotenv]: 配置文件加载成功，文件位置：${dotenvConfig}`);
} catch (e) {
  const message = `[dotenv]: 配置文件加载失败，文件位置：${dotenvConfig}`;
  console.log(chalk.red(message));
}
