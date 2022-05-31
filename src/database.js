const mongoose = require('mongoose')
const { mongodb } = require('./keys')

mongoose
	.connect(mongodb.URI, {
		useNewUrlParser: true,
	})
	.then((db) => console.log('conectado a mongodb - usuarios'))
	.catch((err) => console.log(err))
