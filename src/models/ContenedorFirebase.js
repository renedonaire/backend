import admin from 'firebase-admin'
import config from '../config.js'

const serviceAccount = config.firebase.serviceAccount
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
})
console.log('conectado a firebase ', serviceAccount.project_id)

const db = admin.firestore()
const asObj = (doc) => ({ id: doc.id, ...doc.data() })

export default class ContenedorFirebase {
	constructor(nombreColeccion) {
		this.coleccion = db.collection(nombreColeccion)
	}

	async listar(id) {
		try {
			const doc = await this.coleccion.doc(id).get()
			const result = Object.entries(asObj(doc))
			if (result.length > 1) {
				return asObj(doc)
			} else {
				return { Error: 'No se encontró el elemento' }
			}
		} catch (error) {
			return { 'Error ': `${error}` }
		}
	}

	async listarAll() {
		try {
			const result = []
			const snapshot = await this.coleccion.get()
			snapshot.forEach((doc) => {
				result.push(asObj(doc))
			})
			return result
		} catch (error) {
			return { 'Error ': `${error}` }
		}
	}

	async guardar(nuevoElem) {
		try {
			const guardado = await this.coleccion.add(nuevoElem)
			return { Estado: 'Guardado' }
		} catch (error) {
			return { 'Error al guardar ': `${error}` }
		}
	}

	async actualizar(nuevoElem) {
		try {
			const nuevo = await this.coleccion.doc(nuevoElem.id).update(nuevoElem)
			return { Estado: 'Actualizado' }
		} catch (error) {
			return { 'Error al actualizar ': `${error}` }
		}
	}

	async borrar(id) {
		try {
			const deleted = await this.coleccion.doc(id).delete()
			return { Estado: 'Eliminado' }
		} catch (error) {
			return { 'Error al borrar ': `${error}` }
		}
	}

	async borrarAll() {
		try {
			await this.coleccion.get().then((res) => {
				res.forEach((element) => {
					element.ref.delete()
				})
			})
			return { Estado: 'Eliminado' }
		} catch (error) {
			return { 'Error al borrar ': `${error}` }
		}
	}
}
