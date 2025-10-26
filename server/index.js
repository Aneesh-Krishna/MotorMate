require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// helper to unwrap ES module default exports when required from CommonJS
const unwrap = (m) => (m && m.__esModule && m.default) ? m.default : m;

const auth = unwrap(require('./middleware/auth'));

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// load routes with unwrap to handle possible `export default`
const authRoutes = unwrap(require('./routes/auth'));
const vehiclesRoutes = unwrap(require('./routes/vehicles'));
const expensesRoutes = unwrap(require('./routes/expenses'));

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', auth, vehiclesRoutes);
app.use('/api/expenses', auth, expensesRoutes);

// ...existing code...
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser:true, useUnifiedTopology:true })
  .then(()=> app.listen(PORT, ()=> console.log('Server started on', PORT)))
  .catch(err => console.error(err));

module.exports = app;