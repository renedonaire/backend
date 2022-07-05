const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

const { Schema } = mongoose

const userSchema = new Schema({
	nombre: String,
	direcion: String,
	edad: Number,
	telefono: String,
	email: String,
	password: String,
	avatar: String,
	carrito: String,
})

userSchema.methods.encryptPassword = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

userSchema.methods.comparePassword = function (password) {
	return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('user', userSchema)
