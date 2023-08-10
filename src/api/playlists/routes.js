const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: (request, h) => handler.postPlaylistHandler(request, h),
    options: {
      auth: 'open_music_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: (request) => handler.getPlaylistsHandler(request),
    options: {
      auth: 'open_music_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: (request) => handler.deletePlaylistByIdHandler(request),
    options: {
      auth: 'open_music_jwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.postPlaylistSongHandler(request, h),
    options: {
      auth: 'open_music_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: (request) => handler.getPlaylistSongsByPlaylistIdHandler(request),
    options: {
      auth: 'open_music_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: (request) => handler.deletePlaylistSongByIdHandler(request),
    options: {
      auth: 'open_music_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: (request) => handler.getPlaylistSongActivitiesHandler(request),
    options: {
      auth: 'open_music_jwt',
    },
  },
];

module.exports = routes;
