## Iniciar servicio:  
sudo service mysql start  
  
## Acceder a mysql con password:  
mysql -u root -p  
  
## Requisitos mysql  
Debe existir una base de datos llamada 'Coderhouse_BD'  
- user: 'Coderhouse_123',
- password: 'Coderhouse_123'  
(se puede cambiar esta configuración en el archivo 'src/options.js')  
  
## Requisitos mongodb
Debe haber acceso a una instancia en la nube;
el string de conexión está en el archivo '.env'
  
## Tiempo de caducidad de la sesión  
Está definido en el archivo '.env'

## Iniciar chat sobre sockets - puerto por defecto (8080):
- npm start

## Iniciar chat sobre sockets - puerto a elección:
- node server.js --puerto 'num'
donde 'num' es el número del puerto deseado

## Rutas:
/info => muestra la información del sistema
/api/randoms (opcional: ?cant='número') => genera 'cant' números aleratorios (si no se indica la cantidad, genera 100 millones)