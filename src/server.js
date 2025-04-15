require('dotenv').config();
const Hapi = require('@hapi/hapi');
const routes = require('../routes/expenseRoutes');
const authRoutes = require('../routes/authRoutes');
const pool = require('../utils/db');
const errorHandler = require('../middlewares/errorHandler');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 9000,
    host: 'localhost',
  });

  server.app.db = pool;

  server.route([...authRoutes, ...routes]);

  server.ext('onPreResponse', (request, h) => {
    const response = request.response;
    if (response.isBoom) {
      return errorHandler(response, h);
    }
    return h.continue;
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
