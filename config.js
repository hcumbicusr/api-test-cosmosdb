module.exports = {
    environment: process.env.NODE_ENV || 'development',
    db_host: process.env.MYSQL_HOST || 'localhost',
    db_port: process.env.MYSQL_PORT || '3306',
    db_username: process.env.MYSQL_USER,
    db_password: process.env.MYSQL_PASS,
    db_name: process.env.MYSQL_DB,
    port: process.env.PORT || 3000,
    cors_url: process.env.CORS_URL,
    //pgdb_host: process.env.PG_HOST || 'localhost',
    //pgdb_port: process.env.PG_PORT || '5432',
    //pgdb_username: process.env.PG_USER,
    //pgdb_password: process.env.PG_PASS,
    //pgdb_name: process.env.PG_DB,
    //mongodb_host: process.env.MONGO_HOST || 'localhost',
    //mongodb_port: process.env.MONGO_PORT || '5432',
    //mongodb_username: process.env.MONGO_USER,
    //mongodb_password: process.env.MONGO_PASS,
    //mongodb_name: process.env.MONGO_DB,
    urlpersona:process.env.API_DOCUMENTO_URL,
    urldrive:process.env.API_CLOUDSTORAGE
  };
  