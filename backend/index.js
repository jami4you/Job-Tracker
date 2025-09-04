const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use('/', require('./routes'));


// Optional route for root
app.get('/', (req, res) => {
  res.send('Job Tracker API is running ✅');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
