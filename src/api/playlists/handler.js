class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }


  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload);

    const {name} = request.payload;
    const {id: credentialId} = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({
      name, owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }


  async getPlaylistsHandler(request) {
    const {id: credentialId} = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }


  async deletePlaylistByIdHandler(request) {
    const {id} = request.params;
    const {id: credentialId} = request.auth.credentials;

    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deletePlaylistById(id);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }


  async postPlaylistSongHandler(request, h) {
    this._validator.validatePostPlaylistSongPayload(request.payload);

    const {id} = request.params;
    const {songId} = request.payload;
    const {id: credentialId} = request.auth.credentials;

    await this._service.verifyPlaylistOwner(id, credentialId);
    const playlistSong = await this._service.addPlaylistSong({
      playlistId: id,
      songId,
    });

    const response = h.response({
      status: 'success',
      message: 'Berhasil menambahkan song ke playlist',
      data: {
        playlistSong,
      },
    });
    response.code(201);
    return response;
  }


  async getPlaylistSongsByPlaylistIdHandler(request) {
    const {id: credentialId} = request.auth.credentials;
    const {id} = request.params;

    await this._service.verifyPlaylistOwner(id, credentialId);
    const playlist = await this._service.getPlaylistSongsByPlaylistId(id);

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }


  async deletePlaylistSongByIdHandler(request) {
    this._validator.validateDeletePlaylistSongPayload(request.payload);

    const {id} = request.params;
    const {songId} = request.payload;
    const {id: credentialId} = request.auth.credentials;

    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deletePlaylistSongById(id, songId);

    return {
      status: 'success',
      message: 'Song berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistsHandler;
