const express = require('express');
const path = require('path');
const socket = require('socket.io');
const axios = require('axios');
const redis = require('redis');
const coinKey = require('../key.js');
const model = require('./model.js');

const redisPort = 6379;
const client = redis.createClient(redisPort);

const app = express();
app.set('port', 8020);
const router = require('./routes.js');

app.use('/', router);

const server = app.listen(app.get('port'), (err) => {
  if (err) {
    console.log('error connecting to server');
  } else {
    console.log(`>>> Listening on port ${app.get('port')} <<<`);
  }
});

const io = socket(server);

io.on('connection', (sock) => {
  console.log('emitting');
})


const getCurrency = async () => {
  const x = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
    method: 'GET',
    headers: {
      'X-CMC_PRO_API_KEY': coinKey
    },
  })
  .then((res) => {
    model.update(res.data.data);
    // model.initiate(res.data.data);
  })
}
// getCurrency();

setInterval(() => {
  getCurrency();
}, 300000)

setInterval(async () => {
  model.get((err, results) => {
    if (err) {
      console.log(err)
    } else {
      io.emit('update', results);
    }
  });
}, 60000);