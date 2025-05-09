const Hapi = require('@hapi/hapi');
const routes = require('./routes/routes');

const init = async () => {
  const server = Hapi.server({
    port: 9000, // Port must be 9000 as per the requirement
    host: 'localhost'
  });

  server.route(routes);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();
