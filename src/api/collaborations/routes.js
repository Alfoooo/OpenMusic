const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: (request, h) => handler.postCollaborationHandler(request, h),
    options: {
      auth: 'open_music_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: (request) => handler.deleteCollaborationHandler(request),
    options: {
      auth: 'open_music_jwt',
    },
  },
];

module.exports = routes;
