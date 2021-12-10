# PokeBattle
## ¡¡ listo para la pelea !!

PokeBattle es una aplicacion de backEnd que emplea microservicios 
donde enviando dos pokemones podremos ver quien es el más fuerte.

Utilizaremos el metodo POST con la direccion http://localhost:3000/pokeBattle

En el body enviaremos un Json con nuestros dos participantes,
nuestro Json se tiene que ver más o menos asi.

>{
>    "fighter": "venusaur",
>    "opponent": "charizard"
>}
ó
>{
>    "fighter": "bulbasaur",
>    "opponent": "charmeleon"
>}

El servicio te devolvera una respuesta con el justo ganador de la contienda 
y una pequeña lista de afectaciones de cada pokemon segun el tipo de pokemon.


## Instalación

Descarga el proyecto con :
```sh
git clone https://github.com/krisyupher/pokeSenti.git
```

Abre la terminal en la raiz del proyecto, e instala dependencias con:
```sh
npm install
```

corre el programa con:
```sh
npm run start
ó
node index.js
```
#### Facil, verdad ? Que comience la batalla

## Creditos 

Dev:  @krisyupher ó Cristian Camilo  Florez Ramos

Prueba tecnica para el puesto de desarrollador back en Senti