// require("ts-node/register");
// const {
//   DB_DIALECT,
//   DB_HOST,
//   DB_NAME,
//   DB_PASSWORD,
//   DB_PORT,
//   DB_USERNAME,
// } = require("../environments/.env");

// module.exports = {
//   username: DB_USERNAME,
//   password: DB_PASSWORD,
//   database: DB_NAME,
//   host: DB_HOST,
//   dialect: DB_DIALECT,
//   port: DB_PORT,
// };

require("dotenv").config({
  path: require("path").resolve(__dirname, "../environments/.env"),
});

// DEBUG: Ver qué variables están cargando
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_USERNAME:", process.env.DB_USERNAME);
console.log(
  "Path .env:",
  require("path").resolve(__dirname, "../environments/.env")
);

module.exports = {
  development: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "noname_store",
    host: process.env.DB_HOST || "127.0.0.1",
    port: parseInt(process.env.DB_PORT) || 3306,
    dialect: process.env.DB_DIALECT || "mysql",
  },
  test: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME + "_test" || "noname_store_test",
    host: process.env.DB_HOST || "127.0.0.1",
    port: parseInt(process.env.DB_PORT) || 3306,
    dialect: process.env.DB_DIALECT || "mysql",
  },
  production: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "noname_store",
    host: process.env.DB_HOST || "127.0.0.1",
    port: parseInt(process.env.DB_PORT) || 3306,
    dialect: process.env.DB_DIALECT || "mysql",
  },
};
