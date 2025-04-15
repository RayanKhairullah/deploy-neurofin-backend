import dotenv from 'dotenv';
dotenv.config();

import Hapi from '@hapi/hapi';
import routes from '../routes/expenseRoutes.js';
import authRoutes from '../routes/authRoutes.js';
import prisma from '../utils/prisma.js';
import errorHandler from '../middlewares/errorHandler.js';

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: 'localhost',
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
    await server.start();
    console.log(`Server running on ${server.info.uri}`);
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

init();
