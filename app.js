require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

const { postgresConnect, getDb } = require("./utils/database");

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");


const app = express();
const PORT = process.env.PORT || 3000;

function setupViewEngine(app) {
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));
}

function setupMiddleware(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, "public")));
}

function setupSession(app) {
  const sessionStore = new pgSession({
    pool: getDb(),
    tableName: "sessions",
    createTableIfMissing: true,
  });

  app.use(
    session({
      store: sessionStore,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60,
      },
    })
  );
}

function setupRoutes(app) {
  app.get("/", (req, res) => {
    res.render("index", {
      title: "My Express App",
      user: req.session?.user || null,
    });
  });

  app.use("/users", userRoutes);
  app.use("/auth", authRoutes);
  app.use("/dashboard", dashboardRoutes);
}

async function startServer() {
  try {
    await postgresConnect();

    setupViewEngine(app);
    setupMiddleware(app);
    setupSession(app);
    setupRoutes(app);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();