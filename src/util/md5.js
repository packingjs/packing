import { createHash } from 'crypto';

export default string => createHash('md5').update(string).digest('hex');
