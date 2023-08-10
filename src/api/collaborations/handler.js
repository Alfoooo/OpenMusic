class CollaborationsHandler {
  constructor(
      collaborationsService, playlistsService, usersService, validator,
  ) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._validator = validator;
  }


  async postCollaborationHandler(request, h) {
    this._validator.validatePostCollaborationPayload(request.payload);

    const {id: credentialId} = request.auth.credentials;
    const {playlistId, userId} = request.payload;

    await this._usersService.getUserById(userId);
    await this._playlistsService.getPlaylistSongsByPlaylistId(playlistId);

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    const collaborationId = await this._collaborationsService
        .addCollaboration(playlistId, userId);

    const response = h.response({
      status: 'success',
      message: 'Collaboration berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }


  async deleteCollaborationHandler(request) {
    this._validator.validateDeleteCollaborationPayload(request.payload);

    const {id: credentialId} = request.auth.credentials;
    const {playlistId, userId} = request.payload;

    await this._usersService.getUserById(userId);
    await this._playlistsService.getPlaylistSongsByPlaylistId(playlistId);

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationsService.deleteCollaboration(playlistId, userId);

    return {
      status: 'success',
      message: 'Collaboration berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
