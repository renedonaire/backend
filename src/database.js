const mongoose = require('mongoose')
const { config } = require('dotenv')
config({ path: process.ENV })

mongoose
	.connect(process.env.MONGO_cnxStr, {
		useNewUrlParser: true,
	})
	.then((db) => console.log('conectado a mongodb - usuarios'))
	.catch((err) => console.log(err))
