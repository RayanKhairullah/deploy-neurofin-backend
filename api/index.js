const Hapi = require('@hapi/hapi');
const routes = require('../routes/expenseRoutes');
const authRoutes = require('../routes/authRoutes');
const prisma = require('../utils/prisma');
const errorHandler = require('../middlewares/errorHandler');

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

exports.handler = async (req, res) => {
  await prisma.$connect();
  await server.initialize();
  const { req: hapiReq, res: hapiRes } = server.listener;
  hapiReq(req, res);
};
