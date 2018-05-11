import validateSchema from 'webpack/lib/validateSchema';
import WebpackOptionsValidationError from 'webpack/lib/WebpackOptionsValidationError';
import packingOptionsSchema from '../schemas/packing-options';
import { pRequire } from '..';

/**
 * 校验 `config/packing.js` 参数
 */
export default () => {
  const options = pRequire('config/packing');
  const packingOptionsValidationErrors = validateSchema(packingOptionsSchema, options);

  if (packingOptionsValidationErrors.length) {
    throw new WebpackOptionsValidationError(packingOptionsValidationErrors);
  }
};
