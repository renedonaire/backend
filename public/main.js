const socket = io.connect()

const addProduct = () => {
	const product = {
		title: document.getElementById('title').value,
		price: document.getElementById('price').value,
		thumbnail: document.getElementById('thumbnail').value,
	}
	socket.emit('new-product', product)
	document.getElementById('title').value = ''
	document.getElementById('price').value = ''
	document.getElementById('thumbnail').value = ''
	return false
}

const addMessage = () => {
	const usuario = document.getElementById('email').value
	const fecha = new Date().toLocaleString('en-GB')
	const mensaje = {
		autor: document.getElementById('email').value,
		texto: document.getElementById('texto').value,
		fecha: fecha,
	}
	if (usuario) {
		socket.emit('new-message', mensaje)
		document.getElementById('email').value = usuario
		document.getElementById('texto').value = ''
	}
	return false
}

const renderMessages = (messages) => {
	let html = ''
	if (messages.length > 0) {
		messages.forEach((element) => {
			html =
				html +
				`
					<p>
					<span style="color:blue;"><b>${element.autor}</b></span>
					<span style="color:brown;">[${element.fecha}]</span>
					<span style="color:green;"><i>${element.texto}</i></span>
					</p>
				`
		})
	} else {
		html = 'No hay mensajes'
	}
	document.getElementById('mensajes').innerHTML = html
}

const renderProducts = (products) => {
	const html =
		'<tr><th>Title</th><th>Price</th><th>Thumbnail</th><tr/>' +
		products
			.map((element) => {
				return `
				<tr>
					<td> ${element.title} </td>
					<td> ${element.price} </td>
					<td>
						<img src=" ${element.thumbnail} " width="50" height="auto" alt="miniatura no disponible">
					</td>
				</tr>
			`
			})
			.join(' ')
	document.getElementById('productos').innerHTML = html
}

socket.on('messages', async (data) => {
	renderMessages(data)
})

socket.on('products', (data) => {
	renderProducts(data)
})
