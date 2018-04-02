import { createHash } from 'crypto';

export const md5 = string => createHash('md5').update(string).digest('hex');
export const getContext = () => process.env.CONTEXT || process.cwd();
export pRequire from './lib/require';
export { default as middleware } from './lib/middleware';
export { default as plugin } from './lib/plugin';
