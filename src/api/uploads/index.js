const UploadsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, {albumService, storageService, validator}) => {
    const uploadsHandler = new UploadsHandler(
        albumService, storageService, validator,
    );

    server.route(routes(uploadsHandler));
  },
};
