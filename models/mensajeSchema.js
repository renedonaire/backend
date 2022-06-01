const mongoose = require('mongoose')

const { Schema } = mongoose

const mensajeSchema = new Schema({
	msgDate: String,
	author: String,
	text: String,
})

module.exports = mongoose.model('mensajes', mensajeSchema)
