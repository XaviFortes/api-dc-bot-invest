#!/root/.nvm/versions/node/v16.13.1/bin/node
const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const cookieParser = require("cookie-parser");


const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// For Cookies
app.use(cookieParser());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// render website on root
app.get("/", (req, res) => {
  res.json({ message: "Welcome to cookie." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/investments.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8280;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const Investments = require("./app/models/investments.model");
setInterval(() => {
  Investments.find({}, (err, investments) => {
    if (err) {
      console.log(err);
    } else {
      investments.forEach(investment => {
        
        // Create a number based on the investment's current price and the investment's current amount
        const newValue = investment.currentAmount * investment.currentPrice + (investment.currentAmount * investment.currentPrice * 0.01);
        let newAmount = newValue / investment.currentPrice;
        newAmount = clamp(newAmount, 0, currentAmount);
        newAmount = Math.round(newAmount * 100) / 100;
        let newPrice = newValue / newAmount;
        newPrice = Math.round(newPrice * 100) / 100;
        investment.currentAmount = newAmount;
        investment.currentPrice = newPrice;
        investment.save();

        //let random = clamp(Math.random() * 100, 0, 100);

        ///investment.price = clamp(investment.price + (investment.buys / investment.sells) + (Math.random() * 24 - 15) , 10, 1000);

        // investment.price = clamp(Math.floor(Math.random() * 26 - 12) + investment.price + 0.1, 1, 1000);
        //investment.price = investment.price + Math.random() * 30 - 5;
        ///investment.save();
      });
    }
  });
}, 30 * 60000); //Change every 30 minutes


function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
