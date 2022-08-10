const db = require("../models");
var fs = require("fs");
const User = db.user;
const Investments = db.investments;

exports.getMoney = (req, res) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    };
    if (user.username !== req.body.username) {
      user.username = req.body.username;
      user.save();
    }
    res.status(200).send({ money: user.money });
  });
};

exports.kick = (req, res) => {
  User.findOne({ discordId: req.body.id }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    };
    if (user.username !== req.body.username) {
      user.username = req.body.username;
      user.save();
    }
    if (user.money < 20000) {
      res.status(200).send({ message: "You don't have enough money" });
      return;
    } else {
      user.money = user.money - 20000;
      user.save();
      fs.appendFile("log.txt", "a");

      fs.appendFile("../logs/log.txt", `${new Date()} - ${user.username} kicked somebody\n`, function (err) { if (err) throw err; });
      res.status(200).send({ message: "ok" });
    }
  });
};

// Create Function getusermoney
function getUserMoney(uid) {
  User.findById(uid).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    };
    console.log(user.money);
    // return money
    return user.money;
  });
};

//Get user investments from the array from mongoDB and send it to the client
exports.getWallet = (req, res) => {
  User.findOne({ discordId: req.body.id }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    };
    if (user) {
      if (user.username !== req.body.username) {
        user.username = req.body.username;
        user.save();
      }
      res.status(200).send({ investments: user.investments });
    } else {
      res.status(200).send({ investments: [] });
    }
  });
};

//Get top 10 richest users from mongoDB and send it to the client
exports.getTop = (req, res) => {
  User.find({}).sort({ money: -1 }).limit(10).exec((err, users) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    };
    res.status(200).send({ users: users });
  });
}


exports.discordUser = (req, res) => {
  // get the user's money from the database and send it to the client with body id if user isn't found create user
  User.findOne({ discordId: req.body.id }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    };
    if (user) {
      if (user.username !== req.body.username) {
        user.username = req.body.username;
        user.save();
      }
      res.status(200).send({ money: user.money });

    } else {
      const user = new User({
        //username: req.body.username,
        //email: req.body.email,
        //password: bcrypt.hashSync(req.body.password, 8),
        money: 5000,
        discordId: req.body.id,
        username: req.body.username,
      });
      console.log(req.body.id);
      user.save((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.status(200).send({ message: "User was registered successfully! Try again" });
      });
    }
  });
};





exports.allAccess = (req, res) => {
  // Get investments from mongoDB
  Investments.find({}, (err, investments) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    };
    // Get user money
    let money = getUserMoney(req.userId);
    // Send investments and money
    res.status(200).send({ investments: investments, money: money });
  });
};

exports.userBoard = (req, res) => {
  // return money and uid from user in mongoDB
  var money = getUserMoney(req.userId);
  var uid = req.userId;
  // wait for money to be returned
  // return money and uid
  res.status(200).send({ money: money, uid: uid });
};


exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
