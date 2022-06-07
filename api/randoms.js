function getAleatorio() {
	return parseInt(Math.random() * 1000) + 1
}

const getRandom = (cant) => {
	const numeros = {}
	for (let i = 0; i < cant; i++) {
		const numero = getAleatorio()
		if (!numeros[numero]) {
			numeros[numero] = 0
		}
		numeros[numero]++
	}
	return numeros
}

module.exports = { getRandom }
