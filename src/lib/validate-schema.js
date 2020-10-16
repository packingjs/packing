import { validateSchema } from 'webpack/lib';
import packingOptionsSchema from '../schemas/packing-options';
import { pRequire } from '..';

/**
 * 校验 `config/packing.js` 参数
 */
export default () => {
  const options = pRequire('config/packing');
  try {
    validateSchema(packingOptionsSchema, options);
  } catch (e) {
    // 改写默认异常信息
    e.headerName = 'Packing';
    e.message = e.message.replace(/Webpack/mg, 'Packing');
    throw (e);
  }
};
