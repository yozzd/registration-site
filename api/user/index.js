import {
  getAll, create, update, remove,
} from './controller.js';

import { isAdmin } from '../auth/service.js';

export default ((fastify, opts, done) => {
  fastify.get('/', { preHandler: [isAdmin()] }, getAll);
  fastify.post('/', create);
  fastify.put('/:id', { preHandler: [isAdmin()] }, update);
  fastify.post('/remove', { preHandler: [isAdmin()] }, remove);

  done();
});
