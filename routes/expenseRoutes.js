const Joi = require('joi');
const {
  addExpenseHandler,
  getAllExpensesHandler,
  getExpenseByIdHandler,
  updateExpenseByIdHandler,
  deleteExpenseByIdHandler,
} = require('../controllers/expenseController');
const validationHandler = require('../middlewares/validationHandler');
const authMiddleware = require('../middlewares/authMiddleware');

const routes = [
  {
    method: 'POST',
    path: '/expenses',
    handler: addExpenseHandler,
    options: {
      pre: [{ method: authMiddleware }],
      cors: { origin: ['*'] },
      validate: {
        payload: Joi.object({
          category: Joi.string().required(),
          uangMasuk: Joi.number().precision(2).default(0.00),
          uangKeluar: Joi.number().precision(2).default(0.00),
          uangAkhir: Joi.number().precision(2).required(),
          description: Joi.string().allow(null, ''),
          transaction_date: Joi.date().required(),
        }),
        failAction: validationHandler,
      },
    },
  },
  {
    method: 'GET',
    path: '/expenses',
    handler: getAllExpensesHandler,
  },
  {
    method: 'GET',
    path: '/expenses/{expenseid}',
    handler: getExpenseByIdHandler,
    options: {
      pre: [{ method: authMiddleware }],
      validate: {
        params: Joi.object({
          expenseid: Joi.string().required(),
        }),
        failAction: validationHandler,
      },
    },
  },
  {
    method: 'PUT',
    path: '/expenses/{expenseid}',
    handler: updateExpenseByIdHandler,
    options: {
      pre: [{ method: authMiddleware }],
      validate: {
        params: Joi.object({
          expenseid: Joi.string().required(),
        }),
        payload: Joi.object({
          category: Joi.string().required(),
          uangMasuk: Joi.number().precision(2).default(0.00),
          uangKeluar: Joi.number().precision(2).default(0.00),
          uangAkhir: Joi.number().precision(2).required(),
          description: Joi.string().allow(null, ''),
          transaction_date: Joi.date().required(),
        }),
        failAction: validationHandler,
      },
    },
  },
  {
    method: 'DELETE',
    path: '/expenses/{expenseid}',
    handler: deleteExpenseByIdHandler,
    options: {
      pre: [{ method: authMiddleware }],
      validate: {
        params: Joi.object({
          expenseid: Joi.string().required(),
        }),
        failAction: validationHandler,
      },
    },
  },
];

module.exports = routes;