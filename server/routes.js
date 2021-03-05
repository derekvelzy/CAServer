const router = require('express').Router();
const model = require('./model.js');

// routes
router.get('/initial', (req, res) => {
  model.get((err, results) => {
    if (err) {
      res.send(400);
    } else {
      res.send(results);
    }
  })
});

module.exports = router;
