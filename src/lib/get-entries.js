import { isFunction } from 'util';

export default entries => (isFunction(entries) ? entries() : entries);
