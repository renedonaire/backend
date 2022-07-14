const log4js = require('log4js')

log4js.configure({
	appenders: {
		miLoggerConsole: { type: 'console' },
		miLoggerWarning: { type: 'file', filename: './src/logs/warning.log' },
		miLoggerError: { type: 'file', filename: './src/logs/error.log' },
	},
	categories: {
		default: { appenders: ['miLoggerConsole'], level: 'trace' },
		consola: { appenders: ['miLoggerConsole'], level: 'all' },
		archivoWarning: {
			appenders: ['miLoggerConsole', 'miLoggerWarning'],
			level: 'warn',
		},
		archivoError: {
			appenders: ['miLoggerConsole', 'miLoggerError'],
			level: 'error',
		},
	},
})

const loggerConsola = log4js.getLogger('consola')
const loggerWarning = log4js.getLogger('archivoWarning')
const loggerError = log4js.getLogger('archivoError')

module.exports = { loggerConsola, loggerWarning, loggerError }
