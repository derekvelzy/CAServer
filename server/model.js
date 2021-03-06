// const db = require('./db');
const redis = require('redis');

const db = require('./mongo.js');
const CoinModel = require('./schema.js');


const redisPort = 6379;
const client = redis.createClient(redisPort);

// const turnaround = async (payload) => {
//   await update(payload);
//   const res = await get();
//   return res;
// }


module.exports = {
  get: async (callback) => {
    try {
      client.get('derek', async (err, rep) => {
        if (err) {
          callback(err);
        } else if (!rep) {
          const data = await CoinModel.find({});
          client.setex('derek', 250, JSON.stringify(data));
          callback(null, data);
        } else {
          callback(null, JSON.parse(rep));
        }
      })
    } catch (e) {
      callback(e);
    }
  },

  update: async (payload) => {
    console.log('updating...');
    for (let i = 0; i < 30; i++) {
      const x = await CoinModel.findOneAndUpdate(
        {symbol: payload[i].symbol},
        {
          maxsupply: Math.floor(payload[i].max_supply).toString(),
          circsupply: Math.floor(payload[i].circulating_supply).toString(),
          totsupply: Math.floor(payload[i].total_supply).toString(),
          rank: payload[i].cmc_rank,
          price: payload[i].quote.USD.price.toString(),
          volume: Math.floor(payload[i].quote.USD.volume_24h).toString(),
          hour: payload[i].quote.USD.percent_change_1h,
          day: payload[i].quote.USD.percent_change_24h,
          week: payload[i].quote.USD.percent_change_7d,
          month: payload[i].quote.USD.percent_change_30d,
          cap: payload[i].quote.USD.market_cap.toFixed(2).toString(),
          updated: payload[i].quote.USD.last_updated,
        }
      )
      console.log(x);
    }
  },

  initiate: async (payload) => {
    for (let i = 0; i < 30; i++) {
      const post = new CoinModel({
        name: payload[i].name,
        symbol: payload[i].symbol,
        maxsupply: Math.floor(payload[i].max_supply).toString(),
        circsupply: Math.floor(payload[i].circulating_supply).toString(),
        totsupply: Math.floor(payload[i].total_supply).toString(),
        rank: payload[i].cmc_rank,
        price: payload[i].quote.USD.price.toString(),
        volume: Math.floor(payload[i].quote.USD.volume_24h).toString(),
        hour: payload[i].quote.USD.percent_change_1h,
        day: payload[i].quote.USD.percent_change_24h,
        week: payload[i].quote.USD.percent_change_7d,
        month: payload[i].quote.USD.percent_change_30d,
        cap: payload[i].quote.USD.market_cap.toFixed(2).toString(),
        updated: payload[i].quote.USD.last_updated,
      });
      post.save((err) => {
        if (err) {
          console.log('failed to add to db');
        } else {
          console.log('added to db');
        }
      })
    }
  }
};

