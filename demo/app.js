const Maius = require('../dev/maius');

const app = new Maius({
  rootDir: __dirname,
});

app.listen(3123).then(() => {
  console.log('http://localhost:3123');
});
