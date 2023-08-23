class UserAlbumLikesHandler {
  constructor(albumService, userAlbumLikesService) {
    this._albumService = albumService;
    this._userAlbumLikesService = userAlbumLikesService;
  }


  async postUserAlbumLikeHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    const {id: albumId} = request.params;

    await this._albumService.getAlbumById(albumId);
    await this._userAlbumLikesService.addUserAlbumLike(credentialId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menyukai album',
    });
    response.code(201);
    return response;
  }


  async deleteUserAlbumLikeHandler(request) {
    const {id: credentialId} = request.auth.credentials;
    const {id: albumId} = request.params;

    await this._userAlbumLikesService.deleteUserAlbumLike(
        credentialId, albumId,
    );

    return {
      status: 'success',
      message: 'Berhasil batal menyukai album',
    };
  }


  async getUserAlbumLikesHandler(request, h) {
    const {id} = request.params;

    const likes = await this._userAlbumLikesService.getAlbumLikes(id);

    if (likes.fromCacheServer) {
      const response = h.response({
        status: 'success',
        data: {
          likes: likes.likeCount,
        },
      });
      response.header('X-Data-Source', 'cache');
      return response;
    }

    return {
      status: 'success',
      data: {
        likes: likes.likeCount,
      },
    };
  }
}

module.exports = UserAlbumLikesHandler;
