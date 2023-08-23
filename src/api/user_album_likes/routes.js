const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: (request, h) => handler.postUserAlbumLikeHandler(request, h),
    options: {
      auth: 'open_music_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/albums/{id}/likes',
    handler: (request) => handler.deleteUserAlbumLikeHandler(request),
    options: {
      auth: 'open_music_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: (request, h) => handler.getUserAlbumLikesHandler(request, h),
  },
];

module.exports = routes;
