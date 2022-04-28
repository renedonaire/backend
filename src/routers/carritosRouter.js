import { Router } from 'express'
import { carritosDao } from '../daos/daos.js'

const carritosRouter = Router()

carritosRouter.get('/', async (req, res) => {
	const carritos = await carritosDao.listarAll()
	res.json(carritos)
})

carritosRouter.get('/:id', async (req, res) => {
	const carritos = await carritosDao.listar(req.params.id)
	res.json(carritos)
})

carritosRouter.post('/', async (req, res) => {
	const carroAgregado = await carritosDao.guardar(req.body)
	res.json(carroAgregado)
})

carritosRouter.put('/:id', async (req, res) => {
	const carroActualizado = await carritosDao.actualizar(req.body)
	res.json(carroActualizado)
})

carritosRouter.delete('/:id', async (req, res) => {
	const carroEliminado = await carritosDao.borrar(req.params.id)
	res.json(carroEliminado)
})

export { carritosRouter }
