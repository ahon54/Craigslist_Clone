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

function createPost(
  location_id,
  ad_id,
  item_category_id,
  title,
  price,
  description,
  condition,
  picture,
  method_of_payment,
  method_of_communication,
  negotiable,
  user_id,
  callback
) {
  const sql =
    "INSERT into post (location_id, ad_id, item_category_id, title, price, `condition`, description, user_id, method_of_payment, method_of_communication, negotiable) VALUES " +
    ` ("${location_id}","${ad_id}","${item_category_id}","${title}","${price}","${condition}","${description}",${user_id},"${method_of_payment}","${method_of_communication}","${negotiable}")`;
  mysqlConnection.query(sql, callback);
}

function getUserPost(userId, callback) {
  const sql = `SELECT * FROM post WHERE user_id = "${userId.userId}"`;
  mysqlConnection.query(sql, callback);
}

module.exports = {
  mysqlConnection,
  getUsersSignUp,
  getUserName,
  getUserLogin,
  createPost,
  getUserPost,
};

// mysqlConnection.query(`select * from users`, (err, row) => {
//   err ? console.log(err) : console.log(row);
// });
