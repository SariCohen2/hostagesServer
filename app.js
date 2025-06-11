const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const documentRoutes = require('./routes/documentRoutes');
const deedRoutes = require('./routes/deedRoutes');
const dailyRoutes = require('./routes/dailyTaskRoutes');
const routerDeeds = require('./routes/views');

const cors =require('cors') ;

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());

app.use(bodyParser.json());

// Connect to MongoDB Atlas using the environment variable
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB Atlas:', err));

// Routes
app.use('/api/documents', documentRoutes);
app.use('/api/deeds',deedRoutes)
app.use('/api/daily',dailyRoutes)
app.use('/api/views',routerDeeds)

// Start the server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
