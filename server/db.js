const { Pool } = require('pg')

let psql = new Pool({
  host: 'localhost',
  port: 5432,
  username: 'derekvelzy',
  password: 'open',
  database: 'crypto'
})

module.exports = psql;