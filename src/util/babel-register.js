require('babel-register')({
  presets: [
    'stage-0'
  ],

  plugins: [
    'add-module-exports'
  ]
});

if (!{}.hasOwnProperty.call(process.env, 'NODE_ENV')) {
  process.env.NODE_ENV = 'local';
}
