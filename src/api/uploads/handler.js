const config = require('../../utils/config');

class UploadsHandler {
  constructor(albumService, storageService, validator) {
    this._albumService = albumService;
    this._storageService = storageService;
    this._validator = validator;
  }


  async postUploadCoverHandler(request, h) {
    const {cover} = request.payload;
    const {id} = request.params;
    this._validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const coverUrl = `http://${config.app.host}:${config.app.port}/albums/images/${filename}`;
    await this._albumService.addCoverAlbumById(id, coverUrl);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
