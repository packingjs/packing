/**
 * 获取 postcss/eslint/stylelint 的配置文件
 */

import { existsSync } from 'fs';
import { join } from 'path';

export default (filename, ...dirs) => {
  let configPath;
  const names = [`.${filename}rc.js`, `.${filename}rc`, `${filename}.config.js`];
  for (let i = 0; i < names.length; i++) {
    for (let j = 0; j < dirs.length; j++) {
      configPath = join(dirs[j], names[i]);
      if (existsSync(configPath)) {
        return configPath;
      }
    }
  }
  return configPath;
};
