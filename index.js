const fs = require('fs')

class Products {

   constructor(fileName) {
      this.route = fileName
   }


   getAll = async () => {
      try {
         const result = await fs.promises.readFile(this.route, 'utf-8')
         return JSON.parse(result)
      } catch (err) {
         await fs.promises.writeFile(this.route, JSON.stringify([], null, 2))
         const result = await fs.promises.readFile(this.route, 'utf-8')
         return JSON.parse(result)
      }
   }


   saveProduct = async product => {
      const arrayProducts = await this.getAll()

      try {
         let indexArray = []
         arrayProducts.forEach(element => indexArray.push(element.id))
         if (indexArray.length > 0) {
            const arraySorted = indexArray.sort((a, b) => (b - a))
            product.id = arraySorted[0] + 1
            arrayProducts.push(product)
         } else {
            product.id = 1
            arrayProducts.push(product)
         }
         await fs.promises.writeFile(this.route, JSON.stringify(arrayProducts, null, 2))
         return product.id
      } catch (err) {
         console.log('Error al guardar: ', err)
      }
   }


   getById = async (index) => {
      try {
         const arrayProducts = await this.getAll()
         const result = arrayProducts.find(e => e.id === index)
         if (result) {
            return result
         } else {
            return null
         }
      } catch (err) {
         console.log("Error al obtener por id: " + err)
      }
   }


   deleteById = async (index) => {
      try {
         const arrayProducts = await this.getAll()
         const filteredArray = arrayProducts.filter(e => e.id != index)
         if (filteredArray.length < arrayProducts.length) {
            await fs.promises.writeFile(this.route, JSON.stringify(filteredArray, null, 2))
            const response = "Registro " + index + " eliminado exitosamente"
            return response
         } else {
            return null
         }
      } catch (err) {
         console.log("Error al borrar por id: " + err)
      }
   }


   deleteAll = async () => {
      try {
         const arrayProducts = []
         await fs.promises.writeFile(this.route, JSON.stringify(arrayProducts, null, 2))
         const response = "Todos los registros eliminados"
         return response
      } catch (err) {
         console.log("Error al borrar todo: " + err)
      }
   }
}


// Función de pruebas
const test = async () => {
   const dataBase = new Products('productos.txt')
   console.log(await dataBase.saveProduct({
      title: 'Escuadra',
      price: 123.45,
      thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png'
   }))
   console.log(await dataBase.saveProduct({
      title: 'Calculadora',
      price: 234.56,
      thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png'
   }))
   console.log(await dataBase.saveProduct({
      title: 'Globo Terráqueo',
      price: 345.67,
      thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png'
   }))
   console.log('getAll: ', await dataBase.getAll())
   console.log('getById(1): ', await dataBase.getById(1))
   console.log('getById(100): ', await dataBase.getById(100))
   console.log(await dataBase.deleteById(2))
   console.log('getAll: ', await dataBase.getAll())
   console.log(await dataBase.deleteAll())
   console.log('getAll: ', await dataBase.getAll())
}

test()
