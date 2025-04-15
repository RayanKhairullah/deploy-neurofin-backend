import Joi from 'joi';
import authController from '../controllers/authController.js';

const {
  registerHandler, 
  verifyEmailHandler, 
  loginHandler
} = authController;

const authRoutes = [
  {
    method: 'POST',
    path: '/register',
    handler: registerHandler,
    options: {
      validate: {
        payload: Joi.object({
          username: Joi.string().min(3).required(),
          email: Joi.string().email().required(),
          password: Joi.string().min(6).required(),
        }),
      },
    },
  },
  {
    method: 'POST',
    path: '/verify-email',
    handler: verifyEmailHandler,
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          code: Joi.string().min(6).required(),
        }),
      },
    },
  },
  {
    method: 'POST',
    path: '/login',
    handler: loginHandler,
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required(),
        }),
      },
    },
  },
];

export default authRoutes;