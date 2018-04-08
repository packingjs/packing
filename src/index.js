import { createHash } from 'crypto';

export const md5 = input => createHash('md5').update(input).digest('hex');
export const getContext = () => process.env.CONTEXT || process.cwd();
export requireDefault from './lib/require-default';
export pRequire from './lib/require';
export { default as middleware } from './lib/middleware';
export { default as plugin } from './lib/plugin';
