require('dotenv').config({ path: '.env.local' });

const config = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    dialectOptions: {
      charset: 'utf8',
      useUTC: false,
    },
    timezone: '+00:00',
    migrationStorageTableSchema: 'sch_util', // For migrations table
    migrationStorageTableName: 'migrations_credit_notes', // For migrations table
  },
  // test: {
  //     username: process.env.DB_USER,
  //     password: process.env.DB_PASSWORD,
  //     database: process.env.DB_NAME,
  //     host: process.env.DB_HOST,
  //     dialect: "postgres",
  //     dialectOptions: {
  //         charset: "utf8",
  //     },
  //     define: {
  //         timestamps: false,
  //     },
  // },
  // production: {
  //     username: process.env.DB_USER,
  //     password: process.env.DB_PASSWORD,
  //     database: process.env.DB_NAME,
  //     host: process.env.DB_HOST,
  //     dialect: "postgres",
  //     dialectOptions: {
  //         charset: "utf8",
  //         multipleStatements: true,
  //     },
  //     logging: false,
  //     define: {
  //         timestamps: false,
  //     },
  // },
};

module.exports = config;
