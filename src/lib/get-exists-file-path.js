import { existsSync } from 'fs';

export default (...files) => files.find(file => existsSync(file));
