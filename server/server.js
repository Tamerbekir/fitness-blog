const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas')
const db = require('./config/connection');

const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    ...authMiddleware(req),
  }),
});

const startApolloServer = async () => {
  try {
    await server.start();
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use('/graphql', expressMiddleware(server, {
      context: authMiddleware
    }));

    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/dist')));
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
      });
    }

    db.once('open', () => {
      app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
      });
    });

    db.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

  } catch (error) {
    console.error('Error starting Apollo Server:', error);
  }
};

startApolloServer();



// //! When not connecting to mongoDB
// const express = require('express');
// const { ApolloServer } = require('@apollo/server');
// const { expressMiddleware } = require('@apollo/server/express4');
// const path = require('path');
// const { authMiddleware } = require('./utils/auth');
// const { typeDefs, resolvers } = require('./schemas');
// const db = require('./config/connection');

// const dotenv = require('dotenv');
// dotenv.config();

// const PORT = process.env.PORT || 3001;
// const app = express();
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: ({ req }) => ({
//     ...authMiddleware(req),
//   }),
// });

// const startApolloServer = async () => {
//   try {
//     await server.start();
//     app.use(express.urlencoded({ extended: false }));
//     app.use(express.json());
//     app.use(
//       '/graphql',
//       expressMiddleware(server, {
//         context: authMiddleware,
//       })
//     );

//     // Serve static files in production mode
//     if (process.env.NODE_ENV === 'production') {
//       app.use(express.static(path.join(__dirname, '../client/dist')));
//       app.get('*', (req, res) => {
//         res.sendFile(path.join(__dirname, '../client/dist/index.html'));
//       });
//     }

//     // Connect to MongoDB only in development mode
//     if (process.env.NODE_ENV === 'development') {
//       db.once('open', () => {
//         app.listen(PORT, () => {
//           console.log(`API server running on port ${PORT}!`);
//           console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
//         });
//       });

//       db.on('error', (err) => {
//         console.error('MongoDB connection error:', err);
//       });
//     } else {
//       console.warn('MongoDB connection disabled in production mode.');
//       app.listen(PORT, () => {
//         console.log(`API server running on port ${PORT}!`);
//         console.log('GraphQL endpoint disabled in production mode.');
//       });
//     }
//   } catch (error) {
//     console.error('Error starting Apollo Server:', error);
//   }
// };

startApolloServer();
