import { createHash } from 'crypto';

export const md5 = string => createHash('md5').update(string).digest('hex');

export const getContext = () => process.env.CONTEXT || process.cwd();
