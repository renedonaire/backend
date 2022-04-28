import express from 'express'
import { productosRouter } from './routers/productosRouter.js'
import { carritosRouter } from './routers/carritosRouter.js'

const app = express()

app
	.use(express.json())
	.use(express.urlencoded({ extended: true }))
	.use('/api/productos', productosRouter)
	.use('/api/carritos', carritosRouter)

export default app
