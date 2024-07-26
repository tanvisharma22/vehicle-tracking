const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 5000;

app.use(cors());

let currentIndex = 0;
const dataPath = path.join(__dirname, 'vehicleData.json'); 
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

app.get('/api/vehicle/location', (req, res) => {
  res.json(data.slice(0, currentIndex + 1));
  currentIndex = (currentIndex + 1) % data.length;
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
