// Lambda build week droom-4 backend
require('dotenv').config();

const server = require('./server.js');

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`\nServer listening on port ${PORT}\n`);
});
