const mysql = require('mysql');
const util = require('util');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') })
// require('dotenv').config()

const mysqlConnection = mysql.createConnection({
    host : process.env.DSN,
    user : process.env.ADMIN,
    password : process.env.PASSWORD,
    database : process.env.DATABASE,
    cloud_sql_instances : process.env.INSTANCE
  });
  
  mysqlConnection.connect((err) => {
    if (!err) {
      console.log("Connected");
    }
    else {
      console.log("Connection Failed");
      console.log(err)
    }
  })

function getUsersSignUp(username, lastname, password, email, callback) {
  const sql = `INSERT into USERS (username, lastname, password, email) VALUES ("${username}", "${lastname}", "${password}", "${email}");`
  mysqlConnection.query(sql , callback)
}

function getUserLogin(email , callback) {
  const sql = `SELECT * FROM users WHERE email = "${email}"`
  mysqlConnection.query(sql , callback)
}

function createUser(username, lastname, email, password, callback) {
  const sql = ``
  mysqlConnection.query(sql, callback)
}

module.exports = { mysqlConnection, getUsersSignUp, getUserLogin};





