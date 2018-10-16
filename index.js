const express = require('express');
const prembed = require('./lib/prembed.js');
const embed = require('./lib/embed.js');

const port = 3001;
const app = express();

app.listen(port, () => {
  console.log(`Server is running on ${port} port`);
});

app.get('/prembed', prembed.screenshot);
app.get('/embed', embed.render);
