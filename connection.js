const mysql = require("mysql");
const util = require("util");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
// require('dotenv').config()

const mysqlConnection = mysql.createConnection({
  host: process.env.DSN,
  user: process.env.ADMIN,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  cloud_sql_instances: process.env.INSTANCE,
  ssl: {
    ca: process.env.server_ca.replace(/\\n/g, "\n"),
    cert: process.env.client_cert.replace(/\\n/g, "\n"),
    key: process.env.client_key.replace(/\\n/g, "\n"),
  },
});

mysqlConnection.connect((err) => {
  if (!err) {
    console.log("Connected");
  } else {
    console.log("Connection Failed");
    console.log(err);
  }
});

function getUsersSignUp(username, lastname, password, email, callback) {
  const sql = `INSERT into users (name, lastname, password, email) VALUES ("${username}", "${lastname}", "${password}", "${email}");`;
  mysqlConnection.query(sql, callback);
}

function getUserLogin(email, callback) {
  const sql = `SELECT * FROM users WHERE email = "${email}"`;
  mysqlConnection.query(sql, callback);
}

function getUserName(name, callback) {
  const sql = `SELECT * FROM users WHERE name = "${name}"`;
  mysqlConnection.query(sql, callback);
}

function createPost(info, callback) {
  mysqlConnection.query(`insert into post set?`, info, callback);
}

function getUserPost(userId, callback) {
  const sql = `SELECT * FROM post WHERE user_id = "${userId.userId}"`;
  mysqlConnection.query(sql, callback);
}

function getPostbyId(post_id, callback) {
  mysqlConnection.query(`select * from post where id = ?`, [post_id], callback);
}

function getPostDetail(post_id, cb) {
  mysqlConnection.query(
    `select * from all_user_post where id = ?`,
    [post_id],
    cb
  );
}

module.exports = {
  mysqlConnection,
  getUsersSignUp,
  getUserName,
  getUserLogin,
  createPost,
  getUserPost,
  getPostbyId,
  getPostDetail,
};
