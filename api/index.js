// api/index.js
require('dotenv').config();
const serverlessHapi = require('serverless-hapi');
const Hapi = require('@hapi/hapi');
const routes = require('../../routes/expenseRoutes');
const authRoutes = require('../../routes/authRoutes');
const prisma = require('../../utils/prisma');
const errorHandler = require('../../middlewares/errorHandler');

// Fungsi inisialisasi server Hapi
const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000, // Default port jika tidak ada di .env
    host: '0.0.0.0'              // Pastikan host diatur agar bisa diakses dari luar
  });

  // Daftarkan semua routes aplikasi kamu
  server.route([...authRoutes, ...routes]);

  // Tambahkan error handling dengan onPreResponse
  server.ext('onPreResponse', (request, h) => {
    const response = request.response;
    if (response.isBoom) {
      return errorHandler(response, h);
    }
    return h.continue;
  });

  // Inisialisasi koneksi ke database menggunakan Prisma
  await prisma.$connect();

  return server;
};

// Mengekspor handler dengan membungkus inisialisasi Hapi menggunakan serverless-hapi
module.exports.handler = serverlessHapi(init);
