const cors = require("cors");
const express = require("express");
const cookieSession = require("cookie-session");
const app = express();
const PORT = process.env.PORT || 9000;
const morgan = require("morgan");
const { transactionsRouter } = require("./src/routes/transactions-routes");
const { userRouter } = require("./src/routes/user-routes");
const { connectMongoDB } = require("./src/config/MongoDb");

// app.use(cors({ origin: [process.env.FRONTEND_URL], credentials: true }));
//Hi
app.use(cors());

const oneDayInMs = 24 * 60 * 60 * 1000;
// const isLocalHost = process.env.FRONTEND_URL === "http://localhost:3000";
app.set("trust proxy", 1); // trust first proxy
// cookie session parser
const cookieSessionSecret = process.env.COOKIE_SESSION_SECRET;
if (!cookieSessionSecret) {
  throw new Error("COOKIE_SESSION_SECRET env variable is required");
}

app.use(
  cookieSession({
    name: "session",
    // secret: cookieSessionSecret,
    keys: [cookieSessionSecret],
    maxAge: oneDayInMs,
    // expires: new Date(Date.now() + oneDayInMs),
    // sameSite: isLocalHost ? "lax" : "none",
    // secure: isLocalHost ? false : true,
  })
);

app.use(morgan("dev"));
app.use(express.static("uploads/profile"));
app.use(express.static("uploads/receipt"));
app.use(express.json());

app.use(transactionsRouter);
app.use(userRouter);


// Routes
app.get("/", (req, res) => {
  res.send("Homepage");
});

app.get("/ping", (req, res) => {
  console.log("req.session", req.session);
  req.session.views = (req.session.views || 0) + 1;
  res.end(req.session.views + ' views')
}
);

// Connect to MongoDB first, then start the server. If DB connection fails, exit.
connectMongoDB(PORT)
  .then(() => {
    app.listen(PORT, () => console.log(`Server Started at Port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to start server due to DB connection error', err);
    process.exit(1);
  });
