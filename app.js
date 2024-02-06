
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}



const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require('express-mongo-sanitize');

const camp_routes = require("./routes/camps");
const review_routes = require("./routes/review");
const user_routes = require("./routes/users");
// const dbUrl = process.env.DB_URL;
const PORT = process.env.PORT || 1000;

const dbUrl = 'mongodb://localhost:27017/campsite';
const MongoDBStore = require('connect-mongo')(session);


mongoose.connect(dbUrl, {useNewUrlParser: true,useUnifiedTopology: true}).then(()=>{
  console.log("mongodb is connected");
}).catch((error)=>{
  console.log("mongodb not connected");
  console.log(error);
});
const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


const store = new MongoDBStore({
  url: dbUrl,
  secret: 'thisshouldbeabettersecret',
  touchAfter: 24 * 60 * 60
})

store.on('error', function(e){
  console.log('sessions store error', e)
})
const sessionConfig = {
  store,
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// const mongoSanitize = require('express-mongo-sanitize');

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  console.log(req.session);
  if (!['/login', '/'].includes(req.originalUrl)) {
    req.session.returnTo = req.originalUrl;
  }
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", user_routes);
app.use("/camps", camp_routes);
app.use("/camps/:id/reviews", review_routes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(1000, () => {
  console.log("Serving on port 1000");
});
