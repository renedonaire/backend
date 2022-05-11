const { normalize, denormalize, schema } = require('normalizr')
const util = require('util')
const fs = require('fs')

const holding = JSON.parse(
	fs.readFileSync('./normalizacion/holding.json', 'utf8')
)

//Esquema de empleados
const empleado = new schema.Entity('empleado')

// Esquema para el organigrama
const organigrama = new schema.Entity('organigrama', {
	gerente: empleado,
	encargado: empleado,
	empleados: [empleado],
})

// Esquema para grupos
const grupo = new schema.Entity('grupo', {
	empresas: [organigrama],
})

const print = (objeto) => {
	console.log(util.inspect(objeto, false, 12, true))
}

console.log('*** Normalizado ***')
const holdingNormalizado = normalize(holding, grupo)
print(holdingNormalizado)

console.log('*** Denormalizado ***')
const holdingDenormalizado = denormalize(
	holdingNormalizado.result,
	grupo,
	holdingNormalizado.entities
)
print(holdingDenormalizado)

const largoOriginal = JSON.stringify(holding).length
console.log('Largo original: ', largoOriginal)

const largoNormalizado = JSON.stringify(holdingNormalizado).length
console.log('Largo post normalizado: ', largoNormalizado)

const largoDenormalizado = JSON.stringify(holdingDenormalizado).length
console.log('Largo post desnormalizado: ', largoDenormalizado)

const compresion = (largoNormalizado * 100) / largoOriginal
console.log('Compresión: ', compresion.toFixed(2), ' %')
