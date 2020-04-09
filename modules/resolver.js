const { merge } = require('lodash');
const { GraphQLUpload } = require('graphql-upload');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');
const userResolver = require('./user/graphql/resolver');
const messageResolver = require('./message/graphql/resolver');

const baseResolver = {
  Upload: GraphQLUpload,
  Mutation: {
    hello: (_, { name }) => `hello ${name}`,
    uploadImage: async (source, { file }, { minio, userProvider, req }) => {
      const bucketName = 'upload';
      const {
        filename, mimetype, encoding, createReadStream,
      } = await file;

      if (
        !mimetype.includes('jpeg')
        && !mimetype.includes('jpg')
        && !mimetype.includes('png')
        && !mimetype.includes('gif')
      ) {
        throw new Error('Only images are allowed');
      }
      const hashedFilename = `${uuidv4()}${filename.trim()}`;
      const etag = await minio.putObject(bucketName, hashedFilename, createReadStream(), { mimetype, encoding });
      const url = new URL(`${config.app.host}`);
      url.port = config.app.port;
      const { user: loggedUser } = req;
      url.pathname = `/api/download/images/${hashedFilename}`;
      const image = {
        filename,
        hashedFilename,
        mimetype,
        encoding,
        link: url.href,
        etag,
      };
      await userProvider.update(loggedUser.id, { image });
      return image;
    },
  },
  Query: {
    hello: () => 'world',
  },
};
const mergedResolver = merge(baseResolver, userResolver, messageResolver);
module.exports = mergedResolver
