require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const { postgresConnect, ensureUsersTable, getDb } = require('./utils/database');
const UserRoute = require('./routes/users');
const AuthRoute = require('./routes/auth');


const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure Express to use EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve files from public/
app.use(express.static(path.join(__dirname, 'public')));


// start the server after connecting to the database
const start = async () => {
  try {
    await postgresConnect();
    await ensureUsersTable();

    const sessionStore = new pgSession({
      pool: getDb(),
      tableName: "sessions",
      createTableIfMissing: true,
    });

    app.use(session({
      store: sessionStore,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60
      }
    }));

    // Handle a simple route and render your template
    app.get('/', (req, res) => {
        // Renders the views/index.ejs file and passes an object of dynamic data
        res.render('index', { title: 'My Express App', user: 'Developer' });
    });

    //router
    app.use('/users', UserRoute);
    app.use('/auth', AuthRoute);


    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();

