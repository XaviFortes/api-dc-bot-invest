const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;
const Investments = db.investments;

checkDuplicatedInvestment = (req, res, next) => {
  // Investment
  Investments.findOne({
    name: req.body.name
  }).exec((err, investment) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (investment) {
      res.status(400).send({ message: "Failed! Investment is already in use!" });
      return;
    }

    next();
  });
};

const verifyInvestmentCreate = {
  checkDuplicatedInvestment
};

module.exports = verifyInvestmentCreate;
