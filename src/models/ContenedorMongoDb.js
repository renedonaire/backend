import { MongoClient } from 'mongodb'
import { ObjectId } from 'mongodb'
import config from '../config.js'

const client = new MongoClient(config.mongodb.cnxStr, config.mongodb.options)
await client.connect()
console.log('conectado a ', config.mongodb.cnxStr)

export default class ContenedorMongoDb {
	constructor(baseDatos, coleccion) {
		this.baseDatos = baseDatos
		this.coleccion = coleccion
	}

	async listar(id) {
		try {
			const result = await client
				.db(this.baseDatos)
				.collection(this.coleccion)
				.find({ _id: ObjectId(id) })
				.toArray()
			if (result.length > 0) {
				return result
			} else {
				return { Error: 'Elemento no encontrado' }
			}
		} catch (error) {
			return { Error: `${error}` }
		}
	}

	async listarAll() {
		try {
			const result = await client
				.db(this.baseDatos)
				.collection(this.coleccion)
				.find()
				.toArray()
			return result
		} catch (error) {
			return { Error: `${error}` }
		}
	}

	async guardar(nuevoElem) {
		try {
			const result = await client
				.db(this.baseDatos)
				.collection(this.coleccion)
				.insertOne(nuevoElem)
			return { Estado: 'Guardado' }
		} catch (error) {
			return { 'Error al guardar ': `${error}` }
		}
	}

	async actualizar(nuevoElem) {
		try {
			const data = Object.entries(nuevoElem)
			const index = data.findIndex((elem) => elem.includes('_id'))
			const borrado = data.splice(index, 1)
			const newData = Object.fromEntries(data)
			const result = await client
				.db(this.baseDatos)
				.collection(this.coleccion)
				.updateOne({ _id: ObjectId(nuevoElem._id) }, { $set: newData })
			return { Estado: 'Actualizado' }
		} catch (error) {
			return { 'Error al actualizar ': `${error}` }
		}
	}

	async borrar(id) {
		try {
			const result = await client
				.db(this.baseDatos)
				.collection(this.coleccion)
				.deleteOne({ _id: ObjectId(id) })
			return { Estado: 'Borrado' }
		} catch (error) {
			return { 'Error al borrar ': `${error}` }
		}
	}

	async borrarAll() {
		try {
			await client.db(this.baseDatos).collection(this.coleccion).drop()
			return { Estado: 'Borrado' }
		} catch (error) {
			return { 'Error ': ` ${error}` }
		}
	}
}
