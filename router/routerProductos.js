const express = require('express')
const { Router } = require('express')
const routerProductos = Router()
const { getProducts } = require('../models/productos')
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const arrayProductos = JSON.stringify(getProducts())

routerProductos.get('/', (req, res) => {
	res.render('../views/layouts/main.hbs', { list: arrayProductos })
})

module.exports = routerProductos
