import Boom from '@hapi/boom';

const validationHandler = (request, h, error) => {
  throw Boom.badRequest(error.details[0].message);
};

export default validationHandler;
