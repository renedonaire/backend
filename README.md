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
/api/randoms (opcional: ?cant='número') => genera 'cant' números aleratorios   
(si no se indica la cantidad, genera 100 millones)

## Modos del Server:
### Para arrancar por defecto (con nodemon, puerto 8080)
- npm start   
Em el archivo .env, se usa la variable 'MODE' para indicar el modo por defecto   
('FORK' o 'CLUSTER')

### Programáticamente, se puede elegir el puerto y el modo usando:
- node server.js --puerto 8080 --modo FORK   
- node server.js --puerto 8080 --modo CLUSTER   
Se puede reemplazar node por nodemon. Tambien se puede pasar sólo uno de los parámetros.

### Por línea de comandos usando PM2:
- pm2 start server.js --name="Server1" --watch -- "--puerto" 8082 "--modo" FORK   
- pm2 start server.js --name="Server2" --watch -i max -- "--puerto" 8082 "--modo" CLUSTER   
Tambien se puede pasar sólo uno de los parámetros. Para detener,   
- pm2 del all

### Por línea de comandos usando Forever:
- forever start server.js --watch --puerto 8080 --modo CLUSTER   
Tambien se puede pasar sólo uno de los parámetros. Para detener,   
- forever stopall   

## NGINX y Ubuntu  
Se incluye la configuración en el archivo 'nginx.conf'   
Para usarlo, se quita la configuración por defecto:   
- sudo rm -r /etc/nginx/sites-enabled/default   
Y se crea el archivo de configuración en el directorio   
- /etc/nginx/conf.d/   
Para que los cambios tengan efecto, se debe reiniciar el servicio:   
- sudo /etc/init.d/nginx restart   
O también   
- systemctl reload nginx.service   
   
## Compresión GZip   
Para activar / desactivar, comentar línea 47.   
   
## Logger   
Se usa 'log4js' para registrar los logs.   
El archivo de configuración y los registros se encuentran en el directorio   
- logs   
   
## Mensajería   
El email del -admin, así como las claves del servicio de correo y de mensajería se encuentran en el archivo   
- .env   
