export const successResponse = (h, data, message = 'Success') => {
  return h.response({ status: 'success', message, data }).code(200);
};

export const errorResponse = (h, message, statusCode = 400) => {
  return h.response({ status: 'fail', message }).code(statusCode);
};
