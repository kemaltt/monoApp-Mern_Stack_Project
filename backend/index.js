const cors = require("cors");
const express = require("express");
const cookieSession = require("cookie-session");
const cron = require("node-cron");
const app = express();
const PORT = process.env.PORT || 9000;
const morgan = require("morgan");
const { transactionsRouter } = require("./src/routes/transactions-routes");
const { userRouter } = require("./src/routes/user-routes");
const { adminRouter } = require("./src/routes/admin-routes");
const { connectMongoDB } = require("./src/config/MongoDb");
const { checkAndSendTrialReminders } = require("./src/controllers/trial-reminder-controller");

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
app.use(adminRouter);


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
    
    // Schedule trial reminder check to run daily at 8:00 AM
    cron.schedule('0 8 * * *', async () => {
      console.log('Running scheduled trial reminder check...');
      try {
        const remindersSent = await checkAndSendTrialReminders();
        console.log(`Trial reminder check complete. ${remindersSent} reminders sent.`);
      } catch (error) {
        console.error('Error running trial reminder check:', error);
      }
    });
    
    console.log('Trial reminder scheduler initialized (runs daily at 8:00 AM)');
  })
  .catch((err) => {
    console.error('Failed to start server due to DB connection error', err);
    process.exit(1);
  });
