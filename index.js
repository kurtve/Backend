const server = require('./server.js');

const PORT = process.env.PORT || 4321;

server.listen(PORT, () => {
  console.log(`\nServer listening on port ${PORT}\n`);
});
