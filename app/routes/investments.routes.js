const { verifyInvestmentCreate, authJwt } = require("../middlewares");
const controller = require("../controllers/invest.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept, Authorization"
    );
    next();
  });

  app.post(
    "/api/invest/create",
    controller.createInvestment
  );

  app.post("/api/invest/see", controller.getInvestments);

  app.post("/api/invest/buy", [authJwt.verifyToken], controller.buyInvestment);

  app.post("/api/discord/invest/buy", controller.buyInvestmentDiscord);

  app.post("/api/discord/invest/sell", controller.sellInvestmentDiscord);
  
  app.post("/api/invest/sell", [authJwt.verifyToken], controller.sellInvestment);
};
