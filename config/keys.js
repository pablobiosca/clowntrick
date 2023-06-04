// Al traernos esta libreria y configurar con esa funcion .config() habilitamos 
// la lectura de archivos .env

require("dotenv").config()

//exportamos ambas bd ,luego elegiremos cual coger según el tipo de arranque
//medienate los scripts del package.json
module.exports = {
    database_dev:{
        host:process.env.DEV_MYSQL_HOST,
        user:process.env.DEV_MYSQL_USERNAME,
        password:process.env.DEV_MYSQL_PASSWORD,
        database:process.env.DEV_MYSQL_DATABASE,
        port:3306
    },
    database_prod:{
        host:process.env.PROD_MYSQL_HOST,
        user:process.env.PROD_MYSQL_USERNAME,
        password:process.env.PROD_MYSQL_PASSWORD,
        database:process.env.PROD_MYSQL_DATABASE,
        port:3306
    }
}

