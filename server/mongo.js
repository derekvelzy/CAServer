const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/crypto');

const db = mongoose.connection;

db.on('error', console.error.bind('console', 'connection error to database'));
db.once('open', (err) => {
  if (err) {
    console.log('not connected to mongo');
  } else {
    console.log('~~~ Connected to db crypto ~~~');
  }
});

module.exports = db;