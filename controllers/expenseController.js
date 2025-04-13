const prisma = require('../utils/prisma');
const { nanoid } = require('nanoid');
const logger = require('../utils/logger');
const Boom = require('@hapi/boom');

const addExpenseHandler = async (request, h) => {
  const { category, uangMasuk, uangKeluar, uangAkhir, description, transaction_date } = request.payload;
  const expenseid = nanoid(11);

  try {
    const expense = await prisma.expense.create({
      data: {
        expenseid,
        category,
        // Memetakan field input ke nama field di schema Prisma
        uangmasuk: uangMasuk,
        uangkeluar: uangKeluar,
        uangakhir: uangAkhir,
        description,
        transaction_date: new Date(transaction_date),
      },
    });

    return h.response({
      status: 'success',
      message: 'Expense berhasil ditambahkan',
      data: { expenseid: expense.expenseid },
    }).code(201);
  } catch (error) {
    logger.error('Error adding expense:', error);
    throw Boom.internal('Gagal menambahkan expense');
  }
};

const getAllExpensesHandler = async (request, h) => {
  try {
    const expenses = await prisma.expense.findMany();
    return {
      status: 'success',
      data: { expenses },
    };
  } catch (error) {
    logger.error('Error retrieving expenses:', error);
    throw Boom.internal('Gagal mengambil data expenses');
  }
};

const getExpenseByIdHandler = async (request, h) => {
  const { expenseid } = request.params;
  try {
    const expense = await prisma.expense.findUnique({
      where: { expenseid },
    });
    if (!expense) {
      throw Boom.notFound('Expense tidak ditemukan');
    }
    return {
      status: 'success',
      data: { expense },
    };
  } catch (error) {
    logger.error('Error retrieving expense by ID:', error);
    if (Boom.isBoom(error)) {
      return h
        .response({
          status: 'fail',
          message: error.output.payload.message,
        })
        .code(error.output.statusCode);
    }
    throw Boom.internal('Gagal mengambil data expense');
  }
};

const updateExpenseByIdHandler = async (request, h) => {
  const { expenseid } = request.params;
  const { category, uangMasuk, uangKeluar, uangAkhir, description, transaction_date } = request.payload;

  try {
    const expense = await prisma.expense.update({
      where: { expenseid },
      data: {
        category,
        uangmasuk: uangMasuk,
        uangkeluar: uangKeluar,
        uangakhir: uangAkhir,
        description,
        transaction_date: new Date(transaction_date),
      },
    });

    return h.response({
      status: 'success',
      message: 'Expense berhasil diperbarui',
    });
  } catch (error) {
    // Prisma mengembalikan error dengan kode 'P2025' ketika record tidak ditemukan
    if (error.code === 'P2025') {
      throw Boom.notFound('Expense gagal diperbarui. Id tidak ditemukan');
    }
    logger.error('Error updating expense:', error);
    throw Boom.internal('Gagal memperbarui expense');
  }
};

const deleteExpenseByIdHandler = async (request, h) => {
  const { expenseid } = request.params;
  try {
    await prisma.expense.delete({
      where: { expenseid },
    });

    return h.response({
      status: 'success',
      message: 'Expense berhasil dihapus',
    });
  } catch (error) {
    if (error.code === 'P2025') {
      throw Boom.notFound('Expense gagal dihapus. Id tidak ditemukan');
    }
    logger.error('Error deleting expense:', error);
    throw Boom.internal('Gagal menghapus expense');
  }
};

module.exports = {
  addExpenseHandler,
  getAllExpensesHandler,
  getExpenseByIdHandler,
  updateExpenseByIdHandler,
  deleteExpenseByIdHandler,
};
