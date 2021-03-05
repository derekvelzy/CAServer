const db = require('./db');
const redis = require('redis');


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
          const res = await db.query('SELECT * FROM coins');
          const data = res.rows;
          client.setex('derek', 250, JSON.stringify(data));
          callback(null, data);
        } else {
          callback(null, JSON.parse(rep));
        }
      })

      // const res = await db.query('SELECT * FROM coins');
      // const data = res.rows;
    } catch (e) {
      callback(e);
    }
  },

  update: async (payload) => {
    console.log('updating...');
    for (let i = 0; i < 30; i++) {
      await db.query(
        `UPDATE coins
        SET
          maxsupply = '${Math.floor(payload[i].max_supply).toString()}',
          circsupply = '${Math.floor(payload[i].circulating_supply).toString()}',
          totsupply = '${Math.floor(payload[i].total_supply).toString()}',
          rank =  ${payload[i].cmc_rank},
          price = ${payload[i].quote.USD.price},
          volume = '${Math.floor(payload[i].quote.USD.volume_24h).toString()}',
          hour = ${payload[i].quote.USD.percent_change_1h},
          day = ${payload[i].quote.USD.percent_change_24h},
          week = ${payload[i].quote.USD.percent_change_7d},
          month = ${payload[i].quote.USD.percent_change_30d},
          cap = '${payload[i].quote.USD.market_cap.toFixed(2).toString()}',
          updated = '${payload[i].quote.USD.last_updated}'
        WHERE name = '${payload[i].name}'`);
    }
  },

  initiate: async (payload) => {
    for (let i = 0; i < 30; i++) {
      await db.query(
        `INSERT INTO coins(
          name,
          symbol,
          maxsupply,
          circsupply,
          totsupply,
          rank,
          price,
          volume,
          hour,
          day,
          week,
          month,
          cap,
          updated
        ) VALUES (
          '${payload[i].name}',
          '${payload[i].symbol}',
          '${Math.floor(payload[i].max_supply).toString()}',
          '${Math.floor(payload[i].circulating_supply).toString()}',
          '${Math.floor(payload[i].total_supply).toString()}',
          ${payload[i].cmc_rank},
          ${payload[i].quote.USD.price},
          '${Math.floor(payload[i].quote.USD.volume_24h).toString()}',
          ${payload[i].quote.USD.percent_change_1h},
          ${payload[i].quote.USD.percent_change_24h},
          ${payload[i].quote.USD.percent_change_7d},
          ${payload[i].quote.USD.percent_change_30d},
          '${payload[i].quote.USD.market_cap.toFixed(2).toString()}',
          '${payload[i].quote.USD.last_updated}'
        )`);
    }
  }
};

