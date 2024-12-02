const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitness-blog';

console.log(`Connecting to MongoDB with URI: ${mongoURI}`);

mongoose.connect(mongoURI);

const db = mongoose.connection;

db.on('error', (err) => {
  console.error(`Error connecting to MongoDB: ${err.message}`);
});

db.once('open', () => {
  console.log('Successfully connected to MongoDB');
});

module.exports = db;




// //! boiler plate for none development (not connected to mongoDB)
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// dotenv.config();

// // Check if the environment is local development
// const isLocal = process.env.NODE_ENV === 'development';

// // Set the MongoDB URI
// const mongoURI = isLocal
//   ? 'mongodb://127.0.0.1:27017/fitness-blog'
//   : null; 


// if (!isLocal) {
//   console.warn('MongoDB connection is disabled for non-development environments.');
// } else {
//   console.log(`Connecting to MongoDB locally with URI: ${mongoURI}`);

//   mongoose.connect(mongoURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

//   const db = mongoose.connection;

//   db.on('error', (err) => {
//     console.error(`Error connecting to MongoDB: ${err.message}`);
//   });

//   db.once('open', () => {
//     console.log('Successfully connected to MongoDB');
//   });
// }

// module.exports = isLocal ? mongoose.connection : null;
