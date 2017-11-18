var express = require('express');
var router = express.Router();

const fuzzySolving = require('../fuzzySolving')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Fuzzy Control' });
});

router.post('/fuzzy', (req, res, next) => {
  const data = { valve: fuzzySolving(req.body.w, req.body.t) }
  res.json(data)
})

module.exports = router;
