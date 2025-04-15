import dotenv from 'dotenv';
dotenv.config();

import serverlessHapi from 'serverless-hapi';
import Hapi from '@hapi/hapi';
import routes from '../routes/expenseRoutes.js';
import authRoutes from '../routes/authRoutes.js';
import prisma from '../utils/prisma.js';
import errorHandler from '../middlewares/errorHandler.js';

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000, 
    host: '0.0.0.0',              
  });

  server.route([...authRoutes, ...routes]);

  server.ext('onPreResponse', (request, h) => {
    const response = request.response;
    if (response.isBoom) {
      return errorHandler(response, h);
    }
    return h.continue;
  });

  try {
    await prisma.$connect();
    console.log('Database connected successfully.');
  } catch (err) {
    console.error('Failed to connect to database:', err);
    throw err;
  }

  return server;
};

module.exports.handler = serverlessHapi(init);
