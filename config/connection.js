const mysql = require("mysql2/promise")

//bases de datos de dev y produccion
const { database_dev,database_prod } = require("./keys")

let db_utilizable

console.log("base de datos a utilizar = ",process.env.NODE_ENV)

if (process.env.NODE_ENV=="develop"){
    db_utilizable = database_dev
}else{
    db_utilizable = database_prod
}

const pool = mysql.createPool(db_utilizable)

const hola = async () => {

    const [result] = await pool.query("show tables;")

    console.log(result)
}

hola()

module.exports = pool