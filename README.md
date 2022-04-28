# Segunda Entrega

## Credenciales
**Para MongoDB y Firebase:**
Se encuentran en el directorio *keys*  
Usa bases de datos alojada en la nube.

## Puerto
En el archivo *.env*  se encuentra la configuración del puerto.

## Persistencia
En el archivo  *src/config.js* se selecciona la persistencia, mediante la variable 'PERS'.

## Formatos
**Producto:**
   ```json
 {
	 'id': (único, asignado al guardar el producto)
    	'producto': string,
    	'precio': number
    }
```
**Carrito:**
   ```json
 {
	 'id': (único, asignado al guardar el carrito),
    	'productos':
    		[ (array de productos) ]
    }
```

## End Points
- /api/productos/
- /api/carritos/

## Métodos
#### /get
Lista todos los productos / carritos

#### get/id
Devuelve un producto / carrito específico

#### post
Guarda un producto / carrito.
**Requiere un producto / carrito sin 'id', ya que esta se asigna al momento de guardar.**

#### put/id
Actualiza un producto / carrito.
**Requiere un producto / carrito correctamente formado, incluso con su correspondiente 'id'.**

#### delete/id
Elimina un producto / carrito específico.

## To - Do
- Validar formato de productos / carritos antes de guardar o actualizar
- Habilitar end points faltantes (similar a Entrega 1)
- Habilitar un front end para el ingreso y visualización de datos.
