import fs from 'fs'

// El valor de esta variable determina el tipo de persistencia
// Puede ser 'memoria', 'file', 'mongodb' o 'firebase'
const PERS = 'memoria'

export default {
	PERS,
	fileSystem: {
		path: './data',
	},
	mongodb: {
		cnxStr: JSON.parse(fs.readFileSync('keys/mongodb.key', 'utf8'))
			.MONGO_cnxStr,
		options: {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			serverSelectionTimeoutMS: 5000,
		},
	},
	firebase: {
		serviceAccount: JSON.parse(fs.readFileSync('keys/firebase.key', 'utf8')),
	},
}
