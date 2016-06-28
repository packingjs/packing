import path from 'path';
import Express from 'express';

const port = 8080;
const app = new Express();

app.use(Express.static(path.join(__dirname, '..', 'prd')));

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.info('==> 🚧  Webpack production server listening on port %s', port);
  }
});
