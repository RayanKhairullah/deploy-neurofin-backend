import dotenv from 'dotenv';
dotenv.config();

import Hapi from '@hapi/hapi';
import routes from '../routes/expenseRoutes.js';
import authRoutes from '../routes/authRoutes.js';
import errorHandler from '../middlewares/errorHandler.js';
const pool = require('../utils/db.js');

let server;

async function initServer() {
  if (!server) {
    server = Hapi.server({ port: 3000, host: 'localhost' });
    server.app.db = pool;
    server.route([...authRoutes, ...routes]);

    server.ext('onPreResponse', (request, h) => {
      const response = request.response;
      if (response.isBoom) {
        return errorHandler(response, h);
      }
      return h.continue;
    });

    await server.initialize();
  }
  return server;
}

module.exports = async (req, res) => {
  try {
    const server = await initServer();
    const response = await server.inject({
      method: req.method,
      url: req.url,
      headers: req.headers,
      payload: req.body,
    });
    res.status(response.statusCode).json(response.result);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
