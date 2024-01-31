# Sabores verdes - e-commerce

Este proyecto es un e-commerce de comida basada en plantas, desarrollado como parte del curso de Programación Backend en Coderhouse. El objetivo es poner en práctica los conocimientos adquiridos durante el curso y construir una aplicación completa, basándose en Node.js y MongoDB.

Se logra una experiencia de compra completa, además de tener incorporado un sistema de usuarios por roles con sus respectivas acciones y permisos.

## Instrucciones para ejecutar el proyecto

*¡Cuidado! Por seguridad, las variables de entorno no están incluidas, es preferible que visualices el código en **GitHub** y explores la app en el siguiente link:*

[***Click acá para utilizar la app***](https://sabores-verdes-proyecto-backend.onrender.com/)

[***Click acá para descargar el archivo para importar en Postman***](https://github.com/lurivriv/Backend-Proyecto-Coderhouse/blob/main/backend-proyecto-coderhouse.postman_collection.json)

### A tener en cuenta:
Debido al sistema de roles en los usuarios, un *admin* tiene acceso a funcionalidades adicionales en comparación con un *premium* o un *usuario*. A continuación están los datos de inicio de sesión para probar, con precaución, las funciones del administrador:

```
Email: adminCoder@coder.com
Contraseña: adminCod3r123
```

### En caso de clonar el repositorio y tener los archivos con las variables de entorno:

1. Clonar el repositorio:

```
git clone https://github.com/lurivriv/Backend-Proyecto-Coderhouse.git
```

2. Navegar al directorio del proyecto:

```
cd Backend-Proyecto-Coderhouse
```

3. Instalar las dependencias requeridas:

```
npm install
```

4.1 Iniciar la aplicación en modo desarrollo:

```
npm run start-dev
```

4.2 Iniciar la aplicación en modo producción:

```
npm run start-prod
```

5.1 La aplicación debería iniciarse en tu navegador. Podrás interactuar con ella en modo desarrollo en el puerto local 8080:

```
http://localhost:8080
```

5.2 La aplicación debería iniciarse en tu navegador. Podrás interactuar con ella en modo producción en el puerto local 3000:

```
http://localhost:3000
```

## Dependencias trabajadas

A continuación se muestran las dependencias que se instalarán en el proyecto, todas ellas fueron trabajadas durante el curso:

- @faker-js/faker
- bcrypt
- commander
- connect-mongo
- cors
- dotenv
- express
- express-handlebars
- express-session
- jsonwebtoken
- mongoose
- mongoose-paginate-v2
- multer
- nodemailer
- passport
- passport-github2
- passport-local
- socket.io
- swagger-jsdoc
- swagger-ui-express
- uuid
- winston

## Herramientas adicionales

Además de las tecnologías trabajadas en clase, se utilizaron las siguientes herramientas extra por cdn:

- [**Bootstrap:**](https://getbootstrap.com/) para facilitar el diseño responsivo del sitio web, proporcionando un conjunto de estilos y componentes predefinidos.
- [**Toastify Js:**](https://apvarun.github.io/toastify-js/) para agregar notificaciones emergentes y proporcionarle feedback de sus acciones al usuario.
- [**Railway.app:**](https://railway.app/) para realizar el despliegue de la aplicación y llevarla a un ambiente de producción.

### [**¡Explora el e-commerce de Sabores Verdes!**](https://sabores-verdes-proyecto-backend.onrender.com/)