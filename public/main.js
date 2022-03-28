const socket = io.connect()

function addMessage(e) {
	const mensaje = {
		author: document.getElementById('username').value,
		text: document.getElementById('texto').value,
	}
	socket.emit('new-message', mensaje)
	return false
}

function addProduct(e) {
	const product = {
		title: document.getElementById('title').value,
		price: document.getElementById('price').value,
		thumbnail: document.getElementById('thumbnail').value,
	}
	socket.emit('new-product', product)
	return false
}

function render(messages) {
	const html = messages
		.map((elem) => {
			return `<div>
            <strong>${elem.author}</strong>:
            <em>${elem.text}</em> </div>`
		})
		.join(' ')
	document.getElementById('messages').innerHTML = html
}

function render(products) {
	const html = products
		.map((elem) => {
			return `<table>
				<tr>
					<td>${elem.title}</td>
					<td>${elem.price}</td>
					<td></td>
				</tr>
			</table>`
		})
		.join(' ')
	document.getElementById('products').innerHTML = html
}

socket.on('messages', function (messages) {
	render(messages)
})
