const config = require("../config/auth.config");
const db = require("../models");
const Investments = db.investments;
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.createInvestment = (req, res) => {
  const investment = new Investments({
    name: req.body.name,
    code: req.body.code,
    price: 200,
    buys: 0,
    sells: 0
  });
  investment.save((err, investment) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({ message: "Investment was created successfully!" });
  });
};

exports.getInvestments = (req, res) => {
  Investments.find({}, (err, investments) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send(investments);
  });
};

exports.buyInvestment = (req, res) => {
  console.log(req.userId);
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    };
    // wait for the user to be found
    if (user) {
      console.log(user.money);

      // check if the user has enough money to buy the investment and if the investment exists
      Investments.findOne({ code: req.body.code }, (err, investment) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        };
        if (investment) {
          if (user.money >= investment.price * req.body.amount) {
            // subtract the price of the investment from the user's money
            user.money -= investment.price * req.body.amount;
            // add the investment to the user's investments multiple times
            for (let i = 0; i < req.body.amount; i++) {
              user.investments.push(req.body.code);
            }

            // add 1 to the investment's buys
            investment.buys += 1 * req.body.amount;
            // save the user and the investment
            user.save((err, user) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              };
              investment.save((err, investment) => {
                if (err) {
                  res.status(500).send({ message: err });
                  return;
                };
                res.status(200).send({ message: "Investment bought successfully!" });
              });
            });
          } else {
            res.status(400).send({ message: "Not enough money!" });
          }
        } else {
          res.status(400).send({ message: "Investment not found!" });
        }
      });
    } else {
      res.status(400).send({ message: "User not found!" });
    }
  });
};

exports.buyInvestmentDiscord = (req, res) => {
  if (req.body.amount <= 0) {
    res.status(400).send({ message: "Amount must be greater than 0!" });
    return;
  }
  console.log(req.userId);
  User.findOne({ discordId: req.body.id }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    };
    // wait for the user to be found
    if (user) {
      console.log(user.money);

      // check if the user has enough money to buy the investment and if the investment exists
      Investments.findOne({ code: req.body.code }, (err, investment) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        };
        if (investment) {
          if (user.money >= investment.price * req.body.amount) {
            // subtract the price of the investment from the user's money
            user.money -= investment.price * req.body.amount;
            // add the investment to the user's investments multiple times
            let found = false;
            for (let i = 0; i < user.investments.length; i++) {
              if (user.investments[i].code == req.body.code) {
                user.investments[i].amount += req.body.amount;
                found = true;
              }
            }
            if (!found) {
              user.investments.push({ code: req.body.code, amount: req.body.amount });
            }

            // add 1 to the investment's buys
            investment.buys += 1 * req.body.amount;
            // save the user and the investment
            user.save((err, user) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              };
              investment.save((err, investment) => {
                if (err) {
                  res.status(500).send({ message: err });
                  return;
                };
                res.status(200).send({ message: "Investment bought successfully!" });
              });
            });
          } else {
            res.status(400).send({ message: "Not enough money!" });
          }
        } else {
          res.status(400).send({ message: "Investment not found!" });
        }
      });
    } else {
      res.status(400).send({ message: "User not found!" });
    }
  });
};


exports.sellInvestment = (req, res) => {
  console.log(req.userId);
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    };
    // wait for the user to be found
    if (user) {
      console.log(user.money);

      // check if the user has enough money to buy the investment and if the investment exists
      Investments.findOne({ code: req.body.code }, (err, investment) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        };
        console.log(user.investments.code);
        if (investment) {
          // check if the user has the investment and if the user has enough investments to sell in a efficient way
          if (user.investments.includes(req.body.code) && user.investments.filter(investment => investment === req.body.code).length >= req.body.amount) {
            // add the price of the investment to the user's money
            user.money += investment.price * req.body.amount;
            // remove the investment from the user's investments multiple times
            for (let i = 0; i < req.body.amount; i++) {
              user.investments.splice(user.investments.indexOf(req.body.code), 1);
            }

            // add 1 to the investment's sells
            investment.sells += 1 * req.body.amount;
            // save the user and the investment
            user.save((err, user) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              };
              investment.save((err, investment) => {
                if (err) {
                  res.status(500).send({ message: err });
                  return;
                };
                res.status(200).send({ message: "Investment sold successfully!" });
              });
            });
          } else {
            res.status(400).send({ message: "Not enough investments!" });
          }
        } else {
          res.status(400).send({ message: "Investment not found!" });
        }
      });
    } else {
      res.status(400).send({ message: "User not found!" });
    }
  });
};

exports.sellInvestmentDiscord = (req, res) => {
  console.log(req.userId);
  if (req.body.amount <= 0) {
    res.status(400).send({ message: "Amount must be greater than 0!" });
    return;
  }
  User.findOne({ discordId: req.body.id }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    };
    // wait for the user to be found
    if (user) {
      console.log(user.money);

      // check if the user has enough money to buy the investment and if the investment exists
      Investments.findOne({ code: req.body.code }, (err, investment) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        };
        console.log(user.investments.code);
        if (investment) {
          let found = false;
            for (let i = 0; i < user.investments.length; i++) {
              console.log(user.investments[i].code);
              console.log(user.investments[i].amount);
              if (user.investments[i].code == req.body.code) {
                if (user.investments[i].amount >= req.body.amount) {
            
                  user.investments[i].amount -= req.body.amount;
                  user.money += investment.price * req.body.amount;
                  // add 1 to the investment's sells
                  investment.sells += 1 * req.body.amount;
                  // save the user and the investment
                  user.save((err, user) => {
                    if (err) {
                      res.status(500).send({ message: err });
                      return;
                    };
                    investment.save((err, investment) => {
                      if (err) {
                        res.status(500).send({ message: err });
                        return;
                      };
                      res.status(200).send({ message: "Investment sold successfully!" });
                    });
                  });
                } else {
                  res.status(400).send({ message: "Not enough investments!" });
                  
                found = true;
              };
            };
          };
        };
      });
    } else {
      res.status(400).send({ message: "User not found!" });
    }
  });
};