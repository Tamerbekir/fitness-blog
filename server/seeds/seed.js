const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Profile = require('../models/Profile');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Topic = require('../models/Topic');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/your-database-name');

const seedProfiles = [
  {
    username: 'user1',
    email: 'user1@user.com',
    password: 'password123',
  },
  {
    username: 'user2',
    email: 'user2@user.com',
    password: 'password123',
  },
];

const seedTopics = [
  {
    topicName: 'Fitness',
  },
  {
    topicName: 'Diet',
  },
];

const seedPosts = [
  {
    title: 'I feel fat?',
    content: 'I feel so fat, what am I doing wrong. Can someone please tell me?',
    profile: null, // will be assigned after creating profiles
    topic: null, // will be assigned after creating topics
  },
  {
    title: 'Running faster!',
    content: 'I am trying to run fast because I am so slow and all my friends make fun of me',
    profile: null, // will be assigned after creating profiles
    topic: null, // will be assigned after creating topics
  },
];

const seedComments = [
  {
    content: 'A random comment!',
    profile: null, // will be assigned after creating profiles
    post: null, // will be assigned after creating posts
  },
];

const seedDB = async () => {
  try {
    await mongoose.connection.dropDatabase();

    const createdProfiles = await Profile.insertMany(seedProfiles);
    const createdTopics = await Topic.insertMany(seedTopics);

    seedPosts[0].profile = createdProfiles[0]._id;
    seedPosts[0].topic = createdTopics[0]._id;
    seedPosts[1].profile = createdProfiles[1]._id;
    seedPosts[1].topic = createdTopics[1]._id;

    const createdPosts = await Post.insertMany(seedPosts);

    seedComments[0].profile = createdProfiles[0]._id;
    seedComments[0].post = createdPosts[0]._id;

    await Comment.insertMany(seedComments);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding the database:', err);
    process.exit(1);
  }
};

seedDB();
