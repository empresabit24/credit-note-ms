<p style="text-align: center">
  <a href="https://bit24.pe/" target="blank">
    <img
      src="https://bit24.pe/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.36dbb0f3.png&w=3840&q=75"
      width="200"
      alt="Bit24 Logo"
    />
  </a>
</p>

# API de Notas de Crédito

Esta API contiene todos los endpoints referentes a Notas de Crédito.

## Requisitos:

- Node v16.20.0 
- Sequelize (CLI - v6.6.1, ORM - v6.32.1) 
- Nestjs v10.1.11 
- Git (cualquier versión) 
- Postman (cualquier versión) 

## Levantar proyecto:

1. Descargar el proyecto de gitlab.

```bash
> git clone <URL_PROJECT>
```

2. Posicionarte en la raíz del proyecto y ejecutar. 

```node
> npm install
```
Para poder instalar todas las dependencias.

3. Poner en marcha el servidor del proyecto con el comando. 

```node
> npm run start:dev
```

## Visualizar documentación en SWAGGER.

En el navegador colocar la dirección sobre la que está levantando el proyecto, en este caso localhost:3000 y añadir “/api”, quedando así: **localhost:3000/api**. Con ello se podrá visualizar todos los endpoints realizados con su respectiva documentación. 

## Visualizar en POSTMAN.

En el cliente postman, podrás ejecutar las pruebas respectivas a la API, bajo sus diferentes endpoints que contiene. En este caso procurar usar localhost:3000 y lo que sigue del resto de la ruta, ya no se debería adicionar “/api”. Ejemplo: **localhost:3000/credit-note**. 