import { promises as fs } from 'fs'

export default class ContenedorArchivo {
	constructor(ruta) {
		this.ruta = ruta
	}

	async listar(id) {
		const objs = await this.listarAll()
		const buscado = objs.find((o) => o.id == id)
		if (buscado) {
			return buscado
		} else {
			return { Error: 'Elemento no encontrado' }
		}
	}

	async listarAll() {
		try {
			const objs = await fs.readFile(this.ruta, 'utf-8')
			return JSON.parse(objs)
		} catch (error) {
			return []
		}
	}

	async guardar(obj) {
		const objs = await this.listarAll()
		let newId
		if (objs.length == 0) {
			newId = 1
		} else {
			newId = objs[objs.length - 1].id + 1
		}
		const newObj = { ...obj, id: newId }
		objs.push(newObj)
		try {
			await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2))
			return { Estado: 'Guardado' }
		} catch (error) {
			return { Error: `Error al guardar: ${error}` }
		}
	}

	async actualizar(elem) {
		const objs = await this.listarAll()
		const index = objs.findIndex((o) => o.id == elem.id)
		if (index == -1) {
			return { Error: `No se encontró el id ${elem.id}` }
		} else {
			objs[index] = elem
			try {
				await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2))
				return { Estado: 'Actualizado' }
			} catch (error) {
				return { Error: `Error al actualizar ${error}` }
			}
		}
	}

	async borrar(id) {
		const objs = await this.listarAll()
		const index = objs.findIndex((o) => o.id == id)
		if (index == -1) {
			return { Error: `No se encontró el id ${id}` }
		}
		const deleted = objs.splice(index, 1)[0]
		try {
			await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2))
			return { Estado: 'Eliminado' }
		} catch (error) {
			return { Error: `Error al borrar ${error}` }
		}
	}

	async borrarAll() {
		try {
			await fs.writeFile(this.ruta, JSON.stringify([], null, 2))
			return { Estado: 'Borrado' }
		} catch (error) {
			return { Error: `Error al borrar todo:  ${error}` }
		}
	}
}
