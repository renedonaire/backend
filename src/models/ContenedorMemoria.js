export default class ContenedorMemoria {
	constructor() {
		this.elementos = []
	}

	listar(id) {
		const elem = this.elementos.find((elem) => elem.id == id)
		if (!elem) {
			return { Error: 'Elemento no encontrado' }
		} else {
			return elem
		}
	}

	listarAll() {
		return [...this.elementos]
	}

	guardar(elem) {
		let newId
		if (this.elementos.length == 0) {
			newId = 1
		} else {
			newId = this.elementos[this.elementos.length - 1].id + 1
		}
		const newElem = { ...elem, id: newId }
		this.elementos.push(newElem)
		return { Estado: 'Guardado', newId }
	}

	actualizar(elem) {
		const index = this.elementos.findIndex((p) => p.id === parseInt(elem.id))
		if (index === -1) {
			return { Error: 'Elemento no encontrado' }
		} else {
			this.elementos[index] = elem
			return { Estado: 'Actualizado' }
		}
	}

	async borrar(id) {
		const index = await this.elementos.findIndex(
			(elem) => elem.id === parseInt(id)
		)
		if (index === -1) {
			return { Error: 'Elemento no encontrado' }
		} else {
			const borrado = this.elementos.splice(index, 1)[0]
			return { Estado: 'Eliminado' }
		}
	}

	borrarAll() {
		this.elementos = []
	}
}
