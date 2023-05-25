const bcrypt = require("bcryptjs")

const encrypt = {}

encrypt.encriptasion = async (password) => {

    const salt = await bcrypt.genSalt(5)
    const hash = await bcrypt.hash(password,salt)
    return hash

}

encrypt.desencriptasion = async (password,saved_password) => {

    try{
        return await bcrypt.compare(password,saved_password)
    }catch (error){
        console.log(error)
    }

}

module.exports = encrypt