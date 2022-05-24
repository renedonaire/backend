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
	const fecha = new Date().toLocaleString('en-GB')
	const autor = 'autor'
	const mensaje = {
		msgDate: fecha,
		author: autor,
		text: document.getElementById('mensaje').value,
	}
	socket.emit('new-message', mensaje)
	document.getElementById('mensaje').value = ''
	return false
}

const renderMessages = (messages) => {
	console.log('renderMessages', messages)
	let html = ''
	if (messages.length > 0) {
		messages.forEach((element) => {
			html =
				html +
				`
					<p>
					<span style="color:blue;"><b>${element.author}</b></span>
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
