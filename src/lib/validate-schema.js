// import validateSchema from 'webpack/lib/validateSchema';
// import WebpackOptionsValidationError from 'webpack/lib/WebpackOptionsValidationError';
// import packingOptionsSchema from '../schemas/packing-options';
// import { pRequire } from '..';

// class PackingOptionsValidationError extends Error {
//   constructor(message) {
//     super();
//     this.name = 'PackingOptionsValidationError';
//     this.message = message;
//   }
// }

/**
 * 校验 `config/packing.js` 参数
 */
export default () => {
  // const options = pRequire('config/packing');
  // const packingOptionsValidationErrors = validateSchema(packingOptionsSchema, options);

  // if (packingOptionsValidationErrors.length !== 0) {
  //   // 重写 error.message
  //   // 保证输出消息的可读性
  //   // const error = new WebpackOptionsValidationError(packingOptionsValidationErrors);
  //   // const message = error.message.replace(/Webpack/mg, 'Packing');
  //   throw new PackingOptionsValidationError(packingOptionsValidationErrors);
  // }
};
