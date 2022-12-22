# TypeScript

## Tipando respuestas HTTP (Generics)

[Information about Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html#handbook-content)

Here we are using the generinc PokeapiResponse to tell our const what the axios request it's 
going to return.

Of course in this case we should have the previously defined the `PokeapiResponse` interface.
which we can get from the API.

Con este codigo nosotros estamos creando un problema de clean code STUPID. Que es el alto acoplamiento.
Si en algun momento axios llegase a cambiar su metodo `.get` nos tocaria cambiar en todos los metodos
de nuestrra clase esto.

```typescript
async getMoves(): Promise<Move[]> {
  const { data } = await axios.get<PokeapiReponse>('https://pokeapi.co/api/v2/pokemon/4');
    
  return data.moves;
    }
```

Esta es una función que recibe el tipado de donde se llama, por esta razón usamos el generic <T>

Aqui lo que le estamos diciendo es: 

1. Va a recibir el generic T.

2. Va a retornar una Promesa de tipo <T>

3. Y al this.axios.get le decimos que lo que nos va a devolver va a ser de tipo T

```typescript
  async get<T>( url: string ): Promise<T> {
    const { data } = await this.axios.get<T>(url);
    return data;
  }
```

La utilización de este metodo ser veria de la siguiente manera.

Le estamos enviando el tipo PokeapiResponse, es decir en este caso el generic <T>
del metodo de arriba sabrá que es es tipado de esa ejecución.

```typescript
  const { moves } = await this.pokeApi.get<PokeapiReponse>('https://pokeapi.co/api/v2/pokemon/4')
```

## Dependency Injection

La inyección de dependencias nos ayuda a desacoplar componentes o clases entre ellos, de tal manera que
siendo mas independientes, un cambio en nuestra aplicación no deberia porque representar grandes cambios
en todas nuestras clases. Ver el ejempolo entre los archivos para un mejor entendimiento.

En este caso creamos `pokeApiAdaper` que contendra toda la configuración aislada y desacoplada de axios
para realizar las peticiones http. De esta manera si algo llega cambiar en axios O si en algun futuro se 
quiere cambiar la libreria por otra e.g `fetch` lo podemos hacer sin generar tanto traumatismo en las demás
clases de nuestro aplicativo.

Ver diferencias enter `03-clases.ts` y `04-dependency-injection`, sobre todo en el metodo `getMoves`.


