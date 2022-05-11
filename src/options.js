const { config } = require('dotenv')
config({ path: process.ENV })

const mysql = {
	client: 'mysql',
	connection: {
		host: 'localhost',
		user: 'Coderhouse_123',
		password: 'Coderhouse_123',
		database: 'Coderhouse_BD',
	},
}

const sqlite3 = {
	client: 'sqlite3',
	connection: { filename: 'ecommerce/mensajes.sqlite3' },
	useNullAsDefault: false,
}

const mongodb = {
	cnxStr: process.env.MONGO_cnxStr,
	options: {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		serverSelectionTimeoutMS: 5000,
	},
}

module.exports = { mysql, sqlite3, mongodb }
