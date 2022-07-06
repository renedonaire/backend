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
	const mensaje = {
		msgDate: fecha,
		author: document.getElementById('autor').value,
		text: document.getElementById('mensaje').value,
	}
	socket.emit('new-message', mensaje)
	document.getElementById('mensaje').value = ''
	return false
}

const addToCart = (e) => {
	const item = {
		code: e.code.value,
		title: e.title.value,
		price: e.price.value,
		qty: e.qty.value,
	}
	socket.emit('new-cart', item)
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

const renderProducts = async (products) => {
	let html = ''
	if (products.length > 0) {
		products.forEach((element) => {
			html =
				html +
				`
				<form onsubmit="return addToCart(this)">
					<input type="text" id="code" value="${element.code}">
					<input type="text" id="title" value="${element.title}">
					<input type="text" id="price" value="${element.price}">
					<img src="${element.thumbnail}" width="50" height="auto" alt="miniatura no disponible">
					<input type="number" id="qty"  min=0 value=0 /> 
					<input type="submit" value="Agregar" />
					<br/>
				</form>
				`
		})
	} else {
		html = 'No hay productos'
	}
	document.getElementById('contenedor').innerHTML = html
}

socket
	.on('messages', async (data) => {
		renderMessages(data)
	})
	.on('products', async (data) => {
		renderProducts(data)
	})
