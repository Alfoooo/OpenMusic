const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserAlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }


  async addUserAlbumLike(userId, albumId) {
    const checkQuery = {
      text: `SELECT * FROM user_album_likes
      WHERE user_id = $1 AND album_id = $2`,
      values: [userId, albumId],
    };

    const checkResult = await this._pool.query(checkQuery);

    if (checkResult.rowCount > 0) {
      throw new InvariantError('Error. Telah menyukai album');
    }

    const id = `user-album-like-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menyukai album');
    }

    await this._cacheService.delete(`albumLikes:${albumId}`);

    return result.rows[0];
  }


  async deleteUserAlbumLike(userId, albumId) {
    const query = {
      text: `DELETE FROM user_album_likes
      WHERE user_id = $1 AND album_id = $2
      RETURNING id`,
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Error batal menyukai album. Id tidak ditemukan');
    }

    await this._cacheService.delete(`albumLikes:${albumId}`);
  }


  async getAlbumLikes(albumId) {
    try {
      const result = await this._cacheService.get(`albumLikes:${albumId}`);

      return {
        fromCacheServer: true,
        likeCount: JSON.parse(result),
      };
    } catch (error) {
      const query = {
        text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);

      await this._cacheService.set(
          `albumLikes:${albumId}`,
          JSON.stringify(result.rowCount),
      );

      return {likeCount: result.rowCount};
    }
  }
}

module.exports = UserAlbumLikesService;
