const mysql = require("mysql");
const colors = require("colors");

const connectDB = () => {
  const connection = mysql.createConnection({
    host: process.env.NODE_INTERNCONNECT_MYSQL_HOST,
    user: process.env.NODE_INTERNCONNECT_MYSQL_USER,
    password: process.env.NODE_INTERNCONNECT_MYSQL_PASSWORD,
    database: process.env.NODE_INTERNCONNECT_MYSQL_DATABASE,
  });

  connection.connect((err) => {
    if (err) {
      console.error(`Error: ${err.message}`.bgRed.white);
      process.exit(1);
    } else {
      console.log(`MySQL Connected: ${connection.threadId}`.bgGreen.white);
    }
  });

  return connection;
};

module.exports = connectDB;
