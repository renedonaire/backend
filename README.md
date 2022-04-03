# INSTRUCCIONES

## Ruta '/api/productos/' 
### Ajuste nivel de user: folder 'data' - archivo 'userLevel.js'

- GET: '/'  
Lista todos los productos disponibles (disponible para usuarios y administradores)  
  
- GET: '/:id'  
Obtiene un producto por su id (disponible para usuarios y administradores)  
  
- POST: '/'  
Para incorporar productos al listado (disponible sólo para administradores)  
El producto debe ser en formato  
    *{ "nombre": string, "descripcion": string, "codigo": string, "url": string, "precio": number, "stock": number }*  
pues 'id' y 'timestamp' son agregados automáticamente.  
  
- PUT: '/:id'  
Actualiza un producto por su id (disponible sólo para administradores)  
El producto debe ser en formato  
    *{ "nombre": string, "descripcion": string, "codigo": string, "url": string, "precio": number, "stock": number }*  
pues 'id' y 'timestamp' son agregados automáticamente.  
  
- DELETE: '/:id'  
Borra un producto por su id (disponible para administradores)  
  
  
  ## Ruta '/api/carrito/'
- POST: '/'  
Crea un carrito y devuelve su id.  
  
- DELETE: '/:id'  
Elimina el carrito por 'id'  
  
- GET: '/:id/productos'  
Lista todos los productos guardados en el carrito 'id'  
  
- POST: '/:id/productos/:id_prod'  
Agrega el producto 'id_prod' al carrito 'id'  
  
- DELETE: '/:id/productos/:id_prod'  
Elimina el producto 'id_prod' del carrito 'id'.  
