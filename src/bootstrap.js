require('babel-register')({
  presets: [
    'stage-0'
  ],

  plugins: [
    'add-module-exports'
  ]
});

require('./lib/dotenv');
