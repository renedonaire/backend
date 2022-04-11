export const mysql = {
	client: 'mysql',
	connection: {
		host: 'localhost',
		user: 'Coderhouse_123',
		password: 'Coderhouse_123',
		database: 'Coderhouse_BD',
	},
}

export const sqlite3 = {
	client: 'sqlite3',
	connection: { filename: 'storage/mensajes.sqlite3' },
	useNullAsDefault: true,
}
