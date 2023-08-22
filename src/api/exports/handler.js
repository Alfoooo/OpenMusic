class ExportsHandler {
  constructor(playlistsService, producerService, validator) {
    this._playlistsService = playlistsService;
    this._producerService = producerService;
    this._validator = validator;
  }

  async postExportPlaylistSongsHandler(request, h) {
    this._validator.validateExportPlaylistSongsPayload(request.payload);

    const {id: credentialId} = request.auth.credentials;
    const {playlistId} = request.params;

    const message = {
      playlistId,
      targetEmail: request.payload.targetEmail,
    };

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._producerService.sendMessage(
        'export:playlist', JSON.stringify(message),
    );

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
