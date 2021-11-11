const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    // host: "database-1.cx5rraglozur.ap-northeast-2.rds.amazonaws.com",
    // user: "admin",
    // password: "wpdk1111",
    // database: "testlogin"
    host: "localhost",
    user: "root",
    password: "12341234",
    database: "login-system"
});

app.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query("INSERT INTO users (username, password VALUES (?, ?)",
        [username, password],
        (err, result) => {
            console.log(err);
        }
    );
})

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [username, password],
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }

            if (result) {
                res.send(result);
            } else {
                res.send({ message: "WRONG USERNAME/PASSWORD" });
            }
        }
    );
});

app.listen(3000, () => {
    console.log("SERVER RUNNING")
})