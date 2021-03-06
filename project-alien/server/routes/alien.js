const { ConnectContactLens } = require("aws-sdk");
const express = require("express");
const router = express.Router();
module.exports = function (pool) {
  router.post("/create", function (req, res) {
    // challenge table과 join해서 total_auth_cnt(주 몇회인지) front에서 주 몇회인지 받아오기-> total_auth_cnt insert(매일이면 1, 주 n회이면 n)
    // auth day도 매일하는 challenge이면 어떠한 값이 오는지, 주 n회이면 생명체 생성 시 넘어오는 값 넣기(매일이면 7, n이면 0~6)
    if (req.user) {
      const alien_name = '"' + req.body.alien_name + '"';
      const image_url_obj = {
        1: {
          0: "Alien_base/fish_0.png-Alien_base/fish_0_reverse.png-4-3-1992-981-1024-504-640-316",
          1: "Alien_base/fish_1.png-Alien_base/fish_1_reverse.png-4-3-1992-981-1024-504-640-316",
          2: "Alien_base/fish_2.png-Alien_base/fish_2_reverse.png-4-3-1992-981-1024-504-640-316",
          3: "Alien_base/fish_3.png-Alien_base/fish_3_reverse.png-4-3-1992-981-1024-504-640-316",
          4: "Alien_base/fish_4.png-Alien_base/fish_4_reverse.png-4-3-1992-981-1024-504-640-316",
          5: "Alien_base/fish_5.png-Alien_base/fish_5_reverse.png-4-3-1992-981-1024-504-640-316",
        },
        2: {
          0: "Alien_base/seal_0.png-Alien_base/seal_0_reverse.png-3-3-1280-1137-747-664-320-284",
          1: "Alien_base/seal_1.png-Alien_base/seal_1_reverse.png-3-3-1280-1137-747-664-320-284",
          2: "Alien_base/seal_2.png-Alien_base/seal_2_reverse.png-3-3-1280-1137-747-664-320-284",
          3: "Alien_base/seal_3.png-Alien_base/seal_3_reverse.png-3-3-1280-1137-747-664-320-284",
        },
        3: {
          0: "Alien_base/puffish_0.png-Alien_base/puffish_0_reverse.png-4-4-1024-974-727-691-320-304",
          1: "Alien_base/puffish_1.png-Alien_base/puffish_1_reverse.png-4-4-1024-974-727-691-320-304",
          2: "Alien_base/puffish_2.png-Alien_base/puffish_2_reverse.png-4-4-1024-974-727-691-320-304",
          3: "Alien_base/puffish_3.png-Alien_base/puffish_3_reverse.png-4-4-1024-974-727-691-320-304",
        },
      };
      const image_url_value = String(req.body.image_url);
      const first_value = image_url_value[0];
      const second_value = image_url_value[1];
      const image_url = '"' + image_url_obj[first_value][second_value] + '"';
      //body 변수 추가하기
      const sql1 = `INSERT INTO alien (user_info_id, challenge_id, alien_name, image_url, times_per_week, sun, mon, tue, wed, thu, fri, sat) VALUES (${req.user.id}, ${req.body.challenge_id}, ${alien_name}, ${image_url}, ${req.body.times_per_week}, ${req.body.sun}, ${req.body.mon}, ${req.body.tue}, ${req.body.wed}, ${req.body.thu}, ${req.body.fri}, ${req.body.sat});`;
      // challenge id 받아오기
      const sql2 = `UPDATE challenge set participant_number = participant_number + 1 where id = ${req.body.challenge_id};`;
      // user_info_has_challenge 테이블 row 추가
      const sql3 = `INSERT INTO user_info_has_challenge VALUES (${req.user.id}, ${req.body.challenge_id});`;
      const sql4 = `SELECT if (maximum_number > participant_number, "available","full") as result from challenge where id=${req.body.challenge_id};`;
      pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(sql4, function (error, result, fields) {
          if (error) {
            console.error(error);
            res.status(500).json({
              result: "fail",
              msg: "[DB] Fail to confrim challenge information",
            });
            connection.release();
            return;
          }
          console.log("여기야 여기", result[0].result);
          if (result[0].result == "full") {
            console.log("TEST", result[0].result);
            res.json({
              result: "access_deny_full",
              msg: "방의 정원이 가득 찼습니다.",
            });
            connection.release();
            return;
          }

          connection.query(sql3 + sql1 + sql2, function (error, results) {
            if (error) {
              console.log("at the alien create api", error);
              res.status(200).json({
                result: "fail_already_participant",
                msg: "already participant",
              });
              return;
            }
            res.status(200).json({
              result: "success",
              msg: "do insert",
            });
            connection.release();
          });
        });
      });
    } else {
      res.status(401).json({
        result: "fail",
        msg: "Unauthorized",
      });
    }
  });
  //졸업 api
  router.post("/graduation", function (req, res) {
    // 필요한 데이터: challenge_id, ailen_id
    // 해야할 일 1: alien 테이블 변경
    // 해야할 일 2: user_info_has_challenge row 삭제, participant - 1,
    const sql1 =
      "DELETE FROM user_info_has_challenge WHERE user_info_id=? AND challenge_id=?;";
    const sql2 =
      "UPDATE alien SET alien_status = 1, end_date = NOW() WHERE id = ?;";
    const sql3 =
      "UPDATE challenge SET participant_number = participant_number - 1 WHERE id=?";
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        sql1 + sql2 + sql3,
        [
          req.user.id,
          req.body.challenge_id,
          req.body.alien_id,
          req.body.challenge_id,
        ],
        function (error, results) {
          if (error) {
            console.log("at the alien create api", error);
            res.status(500).json({
              result: "fail",
              msg: "cant query at the graduation",
            });
            return;
          }
          if (results.affectedRows === 0) {
            res.status(200).json({
              result: "fail",
              msg: "already graduation",
            });
            connection.release();
            return;
          }
          res.status(200).json({
            result: "success",
            msg: "do graduation",
          });
          connection.release();
        }
      );
    });
  });

  // 챌린지 total_auth_cnt 보내주기
  router.get("/imageInfo/:challengeId", function (req, res) {
    const challengeId = req.params.challengeId;
    const sql1 = `SELECT times_per_week FROM challenge WHERE id=?;`;
    const sql2 = `SELECT species, image_url, per_count AS count FROM image_menu;`;
    // const sql2 = "SELECT species, image_url FROM aliens.image_menu;"
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql1, [challengeId], function (error1, results1) {
        if (error1) {
          console.error(error1);
          res.status(500).json({
            result: "fail",
            msg: "cant query to select",
          });
          return;
        }
        connection.query(sql2, function (error2, results2) {
          if (error2) {
            console.error(error2);
            res.status(500).json({
              result: "fail",
              msg: "cant query to select",
            });
            return;
          }
          res.status(200).json({
            result: "success",
            msg: "do insert",
            times_per_week: results1[0].times_per_week,
            images: results2,
          });
        });
        connection.release();
      });
    });
  });

  router.use(function (req, res, next) {
    res.status(404).json({
      result: "fail",
      msg: "Sorry cant post that!",
    });
  });
  router.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({
      result: "fail",
      msg: "Something broke!",
    });
  });
  return router;
};
