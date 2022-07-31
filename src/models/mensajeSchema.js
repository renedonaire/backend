const mongoose = require('mongoose')

const { Schema } = mongoose

const mensajeSchema = new Schema({
	msgDate: String,
	author: String,
	text: String,
})

module.exports = mongoose.model('mensaje', mensajeSchema)
// const MensajeModel = mongoose.model(process.env.MONGO_mensajes, mensajeSchema)
// module.exports = MensajeModel
