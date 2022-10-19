module.exports = {
    environment: process.env.NODE_ENV || 'development',
    db_host: process.env.MYSQL_HOST || 'localhost',
    db_port: process.env.MYSQL_PORT || '3306',
    db_username: process.env.MYSQL_USER,
    db_password: process.env.MYSQL_PASS,
    db_name: process.env.MYSQL_DB,
    port: process.env.PORT || 3000,
    cors_url: process.env.CORS_URL,
    mongodb_host: process.env.EDN_MONGO_HOST || 'localhost',
    mongodb_port: process.env.EDN_MONGO_PORT || '27017',
    mongodb_username: process.env.EDN_MONGO_USER,
    mongodb_password: process.env.EDN_MONGO_PASS,
    mongodb_name: process.env.EDN_MONGO_DB,
    urlpersona:process.env.API_DOCUMENTO_URL,
    urldrive:process.env.API_CLOUDSTORAGE
  };
  