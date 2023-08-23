require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const config = require('./utils/config');
const path = require('path');
const ClientError = require('./exceptions/ClientError');

// album
const album = require('./api/album');
const AlbumValidator = require('./validator/album');
const AlbumService = require('./services/postgres/AlbumService');

// song
const song = require('./api/song');
const SongValidator = require('./validator/song');
const SongService = require('./services/postgres/SongService');

// users
const users = require('./api/users');
const UsersValidator = require('./validator/users');
const UsersService = require('./services/postgres/UsersService');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsValidator = require('./validator/authentications');
const AuthenticationsService = require(
    './services/postgres/AuthenticationsService',
);
const TokenManager = require('./tokenize/TokenManager');

// playlists
const playlists = require('./api/playlists');
const PlaylistsValidator = require('./validator/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');

// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsValidator = require('./validator/collaborations');
const CollaborationsService = require(
    './services/postgres/CollaborationsService',
);

// exports
const _exports = require('./api/exports');
const ExportsValidator = require('./validator/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');

// uploads
const uploads = require('./api/uploads');
const UploadsValidator = require('./validator/uploads');
const StorageService = require('./services/storage/StorageService');


const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(
      songService, collaborationsService,
  );
  const storageService = new StorageService(path.resolve(
      __dirname, 'api/uploads/file/images',
  ));

  const server = Hapi.server({
    port: config.app.port,
    host: config.app.host,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('open_music_jwt', 'jwt', {
    keys: config.jwtToken.accessTokenKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.jwtToken.accessTokenAge,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: album,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: song,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        usersService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        playlistsService,
        producerService: ProducerService,
        validator: ExportsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        albumService,
        storageService,
        validator: UploadsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const {response} = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
