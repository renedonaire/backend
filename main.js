import app from './src/server.js'
import { config } from 'dotenv'
config({ path: process.ENV })

const server = app.listen(process.env.PORT, () => {
	console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on('error', (error) => console.log(`Error en servidor ${error}`))
