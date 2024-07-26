const express = require('express');
const router = express.Router();
const vehicleData = require('../data/vehicleData.json');

router.get('/location', (req, res) => {
  res.json(vehicleData);
});

module.exports = router;
