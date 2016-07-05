import path from 'path';
import Express from 'express';
import packing from './packing.config';

const port = packing.port.dist;
const { dist } = packing.path;
const app = new Express();

app.use(Express.static(path.join(__dirname, '..', dist)));
// app.use(Express.static(path.join(__dirname, '..', dist, 'templates/pages')));

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.info('==> 🚧  Webserver listening on port %s', port);
  }
});
