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
	connection: { filename: 'storage/mensajes.sqlite3' },
	useNullAsDefault: true,
}

module.exports = { mysql, sqlite3 }
