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

        // If the last 10 prices doesnt have a value, then add a new value to the array
        if (investment.prices.length < 10) {
          // Create new 10 prices for the investment and add it to the array
          for (let i = 0; i < 10; i++) {
            investment.prices.push(Math.floor(Math.random() * (100 - 1) + 1));
          }
          investment.save();
        } else {
          // If the last 10 prices has a value, then remove the first value in the array and add a new value to the array
          investment.prices.shift();
          // calculate price based on the last 10 prices of each stock in the investment with the array on the investments model
          // Calculating also the average of the last 10 prices of each stock in the investment with the array on the investments model
          investment.price = investment.prices.reduce((a, b) => a + b, 0) / investment.prices.length;
          // The 'a' in the reduce function is the initial value of the calculation, the 'b' is the value of the current iteration of the loop

          //investment.prices.push(investment.price);
          investment.save();
        }

        
        
        // 




        //let random = clamp(Math.random() * 100, 0, 100);

        ///investment.price = clamp(investment.price + (investment.buys / investment.sells) + (Math.random() * 24 - 15) , 10, 1000);

        // investment.price = clamp(Math.floor(Math.random() * 26 - 12) + investment.price + 0.1, 1, 1000);
        //investment.price = investment.price + Math.random() * 30 - 5;
        ///investment.save();
      });
    }
  });
}, 1 * 60000); //Change every 1 minutes


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
