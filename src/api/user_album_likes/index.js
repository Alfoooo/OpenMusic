const UserAlbumLikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'user_album_likes',
  version: '1.0.0',
  register: async (server, {albumService, userAlbumLikesService}) => {
    const userAlbumLikesHandler = new UserAlbumLikesHandler(
        albumService, userAlbumLikesService,
    );
    server.route(routes(userAlbumLikesHandler));
  },
};
