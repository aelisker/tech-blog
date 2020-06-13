const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const exphbs = require('express-handlebars');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const path = require('path');
const helpers = require('./utils/helper');
const hbs = exphbs.create({ helpers });

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const sess = {
  secret: process.env.DB_COOKIE,
  cookie: {
    // set cookie to expire in one hour
    maxAge: (1000 * 60 * 60)
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on port ${PORT}`))
});