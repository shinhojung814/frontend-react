const express = require("express");
const router = express.Router();

module.exports = function (pool) {
  // GET test
  router.get("/", (req, res) => {
    pool.getConnection(function (err, connection) {
      connection.query(
        "SELECT * FROM alien",
        function (error, results, fields) {
          if (error) {
            console.log(error);
          }
          res.status(200).json({
            msg: "(API TEST GET) Hello, Alien!",
            body: Math.random(),
            data: results,
            user: req.user,
          });
          connection.release();
        }
      );
    });
  });

  // PUT test with params
  router.put("/:dummy_id", (req, res) => {
    res.status(200).json({
      msg: `(API TEST PUT) You sent params '${JSON.stringify(
        req.params
      )}' and body '${JSON.stringify(req.body)}'`,
      params: req.params,
      body: req.body,
    });
  });

  // POST test
  router.post("/", (req, res) => {
    res.status(200).json({
      msg: `(API TEST POST) You sent post data '${JSON.stringify(req.body)}'`,
      body: req.body,
    });
  });

  return router;
};
