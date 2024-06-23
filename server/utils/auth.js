const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const secret = process.env.JWT_SECRET || 'defaultSecret';
const expiration = process.env.JWT_EXPIRATION || '10d';

module.exports = {
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),
  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });

      // Log the received token and verified data
      console.log('Received token:', token);
      console.log('Token verified successfully:', data);

      req.user = data;
    } catch (error) {
      console.log('Invalid token', error.message);
    }

    return req;
  },
  signToken: function ({ email, username, _id }) {
    const payload = { email, username, _id };
    const token = jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    console.log('Generated token:', token); // Log the generated token
    return token;
  },
};
