<p align="center">
  <img src="https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808-6/444151214_763960055890211_5935843876597047616_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=AZSAX96BeqgQ7kNvgFebq0V&_nc_zt=23&_nc_ht=scontent.feoh1-1.fna&_nc_gid=AjQJdLM4wVXkrKt_CNIHFjK&oh=00_AYD71un4CAAJuuqKXgMyjTJ4vSbYXbnA-fB4DCrEtnPJvw&oe=671C7EA7" width="200" alt="BMG logo" />
</p>

# 🚙 Xisti Server 

Este es el repositorio para el proyecto **Xisti**, una aplicación backend desarrollada con Express.js y MongoDb.

## Stack utilizado

- Express.js
- MongoDb

## 1. Desplegar en Google kubernetes Engine

Sigue estos pasos para subir versiones de produccion:

### 1.1. Generar secrets de las avriables de entorno

Abre tu terminal y ejecuta el siguiente comando para guardar las variables de entorno en un xisti-secret:


```bash
kubectl create secret generic xisti-secret --from-env-file=.env
```
### 1.2. Generar certificado SSL

Abre tu terminal y ejecuta el siguiente comando para generar certificados ssl (tls value, tls key):


```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout tls.key -out tls.crt \
  -subj "/CN=xi.xistiapp.com/O=my-organization"

```

### 1.3. Generar secrets de tls

Abre tu terminal y ejecuta el siguiente comando para guardar la clave y valor tls xisti-tls-secret:


```bash
kubectl create secret tls xisti-tls-secret \
  --cert=tls.crt \
  --key=tls.key 
```


# Pasos de instalación (git clone, npm install, npm run dev).

## Clonar Repositorio backend en local

### 1.  Instala Git (si aún no lo tienes)
```bash
• En Windows:" https://git-scm.com/download/win"
• En macOS: brew install git (si tienes Homebrew)
• En Linux: sudo apt install git (Debian/Ubuntu) o sudo yum install git (CentOS/Fedora)
```
Para verificar que está instalado, abre la terminal o cmd y escribe:

```bash
 git –version
```

### 2.  Obtén la URL del repositorio
Ve a la página del repositorio que quieres clonar en este caso la del backend
1.  Justo arriba de la lista de archivos del repositorio, verás un botón verde que dice Code.
2.  Haz clic en él.
3.  Copia la URL
Se abrirá un menú con tres opciones principales: HTTPS, SSH, GitHub CLI
Para la mayoría de los usuarios, HTTPS es lo más fácil. Haz clic en el botón de copiar al lado de la URL
### 3.  Clona el repositorio
Abre la terminal y navega a la carpeta donde quieras guardar el repositorio:
```bash
cd ruta/a/tu/carpeta
```

Luego ejecuta:
```bash

git clone https://github.com/devSixti/xisti_server.git
```
Esto creará una carpeta con el nombre del repositorio y descargará todo su contenido
## Instalar npm install
Para ejecutar npm install lo haces según el sistema operativo.
### 1.  Tener instalado Node.js (incluye npm).
Puedes verificarlo ejecutando en tu terminal:
```bash

node -v
npm -v
```
Si no lo tienes, descárgalo desde https://nodejs.org.

### 2.  Ubicarse en el proyecto
Abre una terminal cdm Navega hasta la carpeta del proyecto:
```bash

cd ruta/del/proyecto
```
### 3.  Instalar dependencias
Dentro de la carpeta del proyecto debe existir un archivo package.json.
Ejecuta:
```bash
npm install
```
Esto descargará e instalará todas las dependencias listadas en package.json dentro de una carpeta.
El backend ya instaló todas las dependencias.

## Instalar npm run dev
### 1.  Abre la terminal y asegúrate de estar en la carpeta del backend:
En mi caso:
```bash
cd C:\Users\USUARIO\Documents\Proyectos\xisti_server
```
### 2.  Crear tu archivo de configuración .env.dev
```bash
copy .env.example .env.dev
```
Esto crea un archivo nuevo llamado .env.dev con las variables necesarias.
### 3.  Edita .env.dev para agregar las claves de Wompi

• Abre .env.dev con un editor de texto y asegúrate de tener las líneas:
DB_URL=

WOMPI_API_EVENTS_KEY=
WOMPI_API_PUBLIC_KEY=
WOMPI_API_PRIVATE_KEY=
WOMPI_API_INTEGRITY_KEY=
WOMPI_API_URL=

MAILER_SERVICE=
MAILER_EMAIL=
MAILER_SECRET_KEY=

GOOGLE_API_SEND_MESSAGES=
GOOGLE_API_KEY=

PORT=
JWT_KEY=

NODE_ENV=
• No cambies nada más por ahora eso es llenado por la empresa son datos confidenciales
• Guarda el archivo.
### 4.  Levantar el servidor
En la terminal, estando en la carpeta xisti_server ejecuta:
```bash
npm run dev
```
• Si todo está bien, deberías ver algo como:
Server running at port: 1010
 http://localhost:1010
¡Eso significa que tu backend está funcionando!


# Requisitos previos

## Node.js

1. Para trabajar en el proyecto, se recomienda instalar la versión de Node.js más estable y compatible.

2. En mi opinión, es útil instalar fnm (Fast Node Manager), ya que permite cambiar fácilmente entre distintas versiones de Node.js cuando se trabaja en otros proyectos, sin necesidad de instalar múltiples versiones por separado cada vez.

- Nota: la instalación de fnm puede requerir herramientas adicionales y configuración de la terminal, pero una vez listo facilita mucho el manejo de versiones.

## MongoDB Atlas

1. Crear una cuenta y un cluster.

2. Configurar base de datos y usuario con permisos adecuados.

3. Obtener la cadena de conexión y agregar la IP a la lista de acceso (IP Whitelist).



<!-- 
// Legacy README.md

# XISTI SERVER: Documentación

**En este documento se encuentra toda la documentación referente al servidor de xisti.**

NOTA: *El desarrollo backend no es mi fuerte, si hay problemas en la arquitectura o alguna vulnerabilidad o error en el manejo de los errores cualquier modificación es bien recibida.*

Este servidor fue desarrollado utilizando Node.js + express, typescript, mongoDB con Mongoose y Sockets.io. 

Hay una breve introducción a la decisión de la distribución de las carpetas en el archivo architecture.explain.md pero es muy global. Lo importante a tener en cuenta es que el servidor de sockets se encuentra como un servicio y es donde está configurada toda la lógica de esta funcionalidad.



## Replicar proyecto

Para replicar el proyecto crear un archivo .env y agregar las variables de entorno requeridas en el .env.example

Ver el package.json para ver los comandos de inicialización

    npm run dev # Para ejecutar el código en desarrollo

    npm run tsc  # Transpilar el código a js
    npm run start  # Ejecutar el código desde js

## Importante a tener en cuenta

Todos los secretos y claves las van a encontrar en el drive.

Como recomendación, este servidor debería poder ser migrado en un futuro a microservicios, donde por lo menos el servidor de sockets y la API Rest estén separadas.

Sería positivo poder realizar un proceso de modificación en las variables mediante DTOs, en este momento el que hace ese proceso de modificación de la data es un middleware pero me parece que hay mejores prácticas para todo esto. 

La base de datos es muy sencilla, no es relacional y por el momento no hay consultas entre tablas, si sería buena práctica reducir la carga de transporte de información en el servidor de sockets y manejarlo mediante consultas anidades enviando la información netamente necesaria en el proceso.

Hay una serie de tareas pendientes para integración, la mayoría de estas están enumeradas en las tareas pendientes del frontend, al final de la documentación enlisto las tareas pendientes y que se deben manejar de la mano con el front.


## Funcionamiento de la API:

El endpoint base es http{s}://HOST:PORT/api

Para el correcto funcionamiento del servidor se plantearon los siguientes EndPoints

### Usuario

*Todas las rutas, menos las relacionadas con la de crear o acualizar usuario se encuentran protegidas, esto significa que es necesario enviar el 'x-token' como un header. (JWT) de la sesión.*

1. **Traer todos los usuarios**

Para traer todos los usuarios sólo hay que llamar al endpoint 
```
GET /user/
```

Importante poder crear una paginación con límites en este endpoint, meramente administrativo. No se está consumiendo en el front actualmente.

2. **Traer usuario por Id**

Retorna un usuario por id, no es necesario enviar ningún id porque el uid del jwt en la validación lo almacena en el req.

```
GET /user/id
```

3. **Crear nuevo usuario**

Este endpoint se encarga de crear un usuario cuando este es nuevo, es importante asegurarse antes de consumir el endpoint que efectivamente es un usuario nuevo.

```
POST /user/createNewUser
```

* body: se usa un objeto que va a ser parseado usando este mapper 'parseJsonToUserFrontend'

4. **Actualizar usuario**

Este endpoint se encarga de actualizar un usuario.

```
POST /user/updateUser
```

* body: se usa un objeto que va a ser parseado usando este mapper 'parseJsonToUserFrontend'
5. **Calificación del usuario (La que le hace el conductor al pasajero)**

Este endpoint se encarga de subir la calificación del usuario y actualizar las ya existentes.

```
POST /user/califation
```
* Parámetros: userId
* body: json de tipo calification // Califications
 
```
{
    'travelId'
    'calification'
    'comments'
}
```


### Conductor
```
GET /driver/
```


### Viaje
/travel


### Validaciones

1. **Google Auth**

Este endpoint se encarga de hacer unas validaciones referentes a la validación del ingreso mediante google sing In, valida el token de validación y en base a esto retorna un objeto de tipo GoogleData y además valida si el usuario es nuevo o no.

```
GET /validate/google-auth
```

* Headers: 'X-validation-token'

2.  **Validación del JWT** (*Ruta protegida*)

Se encarga de validar el JWT del usuario, este debe ser enviado mediante un header

```
GET /validate/jwt
```

* Headers: 'x-token'

Si el token no es enviado o está mal se rompe en la protección de la ruta. Si es válido retorna un json con status 200 de este tipo:

```json
{
    "status": "verificado", 
    "user": user, //type : User
    "token": token //type : string 
}
```

3. **Es nuevo**

Este endpoint se encarga de validar si un usuario es nuevo o no. Si es nuevo retorna un null y si no retorna la información del usuario : User.


```
POST /validate/is-newly
```

* Body del endPoint: {email, phone} 

## Funcionamiento de los webSockets:

Los websockets funcionan mediante canales, por lo que en esta documentación va a encontrar el funcionamiento y configuraciones importantes en dichos canales.





### Integraciones para el front:

***Trabajando de la mano pueden llegar a un acuerdo de cual es la mejor manera de hacer esto***

* Sistema para poder volver al viaje después de finalizar el aplicativo. Cuando el usuario o conductor cierran el aplicativo debe haber un sistema que permita validar si este se encuentra actualmente ejecutando un servicio. De ser así debe aparecer un mensaje o debe existir algún sistema que lo redireccione inmediatamente al viaje. ***Esto es de caracter URGENTE y debería ser la primera tarea***. Si el conductor se sale del aplicativo y no cierra el viaje al volver debería seguir en ese servicio. 

* Los métodos de pago como Daviplata, PSE y Pagos en efectivo se encuentran inhabilitados, toda la documentación para su integración se encuentra en la [documentación oficial de Wompi](https://docs.wompi.co/docs/colombia/metodos-de-pago/). *(El ambiente de desarrollo tiene unas claves y el de deploy otras, leer la documentación para evitar estar probando transacciones reales y testear con topes inferiores que esté correcto todo)*.

* Se planteó una forma de manejar las notificaciones push, pero no es muy ascertada, es necesario que cada vez que se emita algo desde el servidor de sockets desde el servidor las notificaciones push se generen y se envíen. Recomiendo hacer esto desde el servidor.

* Se debe generar un mecanismo para controlar los casos en que dos conductores aceptan al tiempo una solicitud, de alguna manera debe existir un proceso de validación previo antes de generar el proceso de redireccionamiento, este proceso de validación tiene que autenticarse frente al backend.

* Hay fugas de información en algunos puntos, valores nulos y que posiblemente se encuentren mal parseados, recomiendo que de la mano con el backend validen el envío y recepción correcto de la data. (Todo lo referente al servidor del backend)

* El proceso de autenticación cuenta con un JWT. Sin embargo por seguridad y para implementar el proceso de refresh token debería existir una forma de poder refrescarlo (De la mano con el backend) Para que es token de refresco pueda crear un nuevo JWT en caso de que este ya haya caducado. El token de refresco no tiene que tener información sensible del usuario, sólo la necesaria para poder actualizar su JWT en caso de que las credenciales sean correctas. Para evitar tener que loggearse tan seguido. (*Proceso de refresh tokens.* Debe ser trabajado de la mano con el backend al 100%)

* Proceso de diferenciación de los ajustes en el conductor, la imagen y nombre que se pueden modificar actualmente es la del usuario, por lo que si el conductor quiere modificar su información o su foto de perfil tiene que mandar un PQR, sería importante poder tener un sistema diferente de ajustes para conductor y para usuario.
* Poder manejar los errores relacionados con el registro de los conductores. (De la mano con el backend) debe haber un manejo de los errores que vengan del mismo, por ejemplo duplicidad del documento de identidad.

* Funcionalidad de eliminar cuenta, en algún lado del UI debe existir esta opción.
* Si el usuario se sale del aplicativo romper la solicitud de inmediato, deja de buscar conductores o si la solicitud lleva más de por ejemplo 4 minutos sin encontrar a nadie que le diga con un mensaje: 'No encontramos ningún conductor que se ajuste a tu tarifa, te gustaría seguir buscando?'

* Hacer un proceso de solicitudes diferentes cuando se trata de mascotas. Como un servicio aparte.  -->
