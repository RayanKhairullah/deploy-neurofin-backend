import Jwt from 'jsonwebtoken';
import Boom from '@hapi/boom';

const authMiddleware = (request, h) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw Boom.unauthorized('Token tidak ditemukan');
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = Jwt.verify(token, process.env.JWT_SECRET);
    request.auth = { user: decoded };
    return h.continue;
  } catch (error) {
    console.error('Error verifying token:', error.message);
    throw Boom.unauthorized('Token tidak valid');
  }
};

export default authMiddleware;
