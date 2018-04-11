import Express from 'express';

const app = new Express();
app.use(Express.static(__dirname));

app.listen(8080, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.info('==> 🚧  Listening on port %s', 8080);
  }
});
