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
	// const email = document.getElementById('email').value
	const fecha = new Date().toLocaleString('en-GB')
	const usuario = {
		nombre: req.session.nombre,
		// id: document.getElementById('email').value,
		// nombre: document.getElementById('nombre').value,
		// apellido: document.getElementById('apellido').value,
		// edad: document.getElementById('edad').value,
		// alias: document.getElementById('alias').value,
		// avatar: document.getElementById('avatar').value,
	}
	const mensaje = {
		msgDate: fecha,
		author: usuario,
		text: document.getElementById('mensaje').value,
	}
	console.log(mensaje)
	if (nombre) {
		document.getElementById('nombre').value = usuario.nombre
		// document.getElementById('apellido').value = usuario.apellido
		// document.getElementById('edad').value = usuario.edad
		// document.getElementById('email').value = usuario.id
		// document.getElementById('alias').value = usuario.alias
		// document.getElementById('avatar').value = usuario.avatar
		socket.emit('new-message', mensaje)
		document.getElementById('mensaje').value = ''
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
					<span style="color:blue;"><b>${element.author.alias}</b></span>
					<span style="color:brown;">[${element.msgDate}]</span>
					<span style="color:green;"><i>${element.text}</i></span>
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

socket
	.on('messages', async (data) => {
		renderMessages(data)
	})
	.on('products', (data) => {
		renderProducts(data)
	})
