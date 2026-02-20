require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 TaskFlow API running on port ${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV}`);
  });
});