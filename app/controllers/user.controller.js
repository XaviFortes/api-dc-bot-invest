const db = require("../models");
const User = db.user;
const Investments = db.investments;

exports.getMoney = (req, res) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    };
    res.status(200).send({ money: user.money });
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


exports.discordUser = (req, res) => {
  // get the user's money from the database and send it to the client with body id if user isn't found create user
  User.findOne({ discordId: req.body.id }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    };
    if (user) {
      res.status(200).send({ money: user.money });
    } else {
      const user = new User({
        //username: req.body.username,
        //email: req.body.email,
        //password: bcrypt.hashSync(req.body.password, 8),
        money: 5000,
        discordId: req.body.id,
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
