import path from 'path';
import Express from 'express';
import packing from './packing';

const port = packing.port.dist;
const app = new Express();

app.use(Express.static(path.join(__dirname, '..', 'prd')));

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.info('==> 🚧  Webserver listening on port %s', port);
  }
});
