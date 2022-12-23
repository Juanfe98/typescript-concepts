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


## Sustitucion de Liskov

Lo que nos dice el principio de sustitución de Liskov es que una clase que implementa una dependencia
con una arquitectura especifica, deberia poder implementar una dependencia diferente, siempre que 
su architectura sea la misma. 

Es un concepto complicado, pero vamos a verlo con un ejemplo.

Supongamos que tenemos la siguiente clase, en la cual tenemos una dependencia inyectada
la cual sera pokeApi, que va a ser una clase para realizar la peticion HTTP al servidor.

```typescript

export class Pokemon {

  // Dependency injection
  private pokeApi: PokeAdapter

  async getMoves(): Promise<Move[]>{
    const { moves } = await this.pokeApi.get<PokeapiReponse>('https://pokeapi.co/api/v2/pokemon/4')
    return moves;
  }
}

```

Este es nuestro pokeAdapter, una clase normal con un method get para ejecutar las peticiones 
get al servidor.

```typescript
export class PokeAdapter {

  private readonly axios = axios;

  async get<T>( url: string ): Promise<T> {
    const { data } = await this.axios.get<T>(url);
    return data;
  }
}
```

Ahora supongamos algo, si queremos cambiar el Adapter, por x o y razon, y ahora quedemos usar ``fetch`
para realizar las peticiones HTTP que hariamos ? Crear un adaptador nuevo!

Si revisamos la arquitectura, o el hueso de las dos clases adapter, son iguales... Las dos cuentan con
un metodo get que va a realcionar una peticion al servidor y devolver la data! 

```typescript
export class PokeAdapterWithFetch {
  
  async get<T>( url: string ): Promise<T> {
    const response = await fetch(url);
    const data: T = await response.json();
    return data;
  }
}
```

Ahora, Hagamos el cambio en nuestra clase Pokemon.

```typescript

const pokeApi = new PokeAdapter();
const pokeApiWithFetch = new PokeAdapterWithFetch();

export const charmander = new Pokemon( 4, 'Charmander', pokeApi );
export const charmander2 = new Pokemon( 4, 'Charmander', pokeApiWithFetch );

```

Esto deberia funcionar, cierto? Con los dos adaptadores! No funciona! 

Esto nos daria el siguiente error

```typescript
const pokeApiWithFetch: PokeAdapterWithFetch
Argument of type 'PokeAdapterWithFetch' is not assignable to parameter of type 'PokeAdapter'.
  Property 'axios' is missing in type 'PokeAdapterWithFetch' but required in type 'PokeAdapter'.ts(2345)
pokeApi.adapter.ts(18, 20): 'axios' is declared here.
```

En conslusion sobre el concepto, esto nos dice el principio de sustitucion de Liskov

--> La clase Pokemon, deberia ser capaz de utilizar cualquiera de los dos adaptadores,
sin necesidad de realizar ningun cambio en esta!

Pero y  ¿Como lo aplicamos?

- Hay varias maneras de aplicarlo, comunmente se suelen crear clases abstractas para este proposito.
En este caso con typescript podemos realizarlo de la siguiente manera.

Creamos una interface, que va a contener la marca, el hueso, la arquitectura que debe tener nuestro HTTP adapter.

```typescript
export interface HttpAdapter {
  get<T>(url: string): Promise<T>;
}
```
Luego, nuestros dos adaptadorees deberan implementar esta interface, esto quiere decir que deben seguir esa estructura.
Deben satisfacer completamente la interface para poder implementarla, sino se generara un error al momento de realiza la implementación.

Notese en las dos clases el `implements HttpAdapter`, puesto sera lo que va a asegurar que funcione correctamente.

```typescript

export class PokeAdapter implements HttpAdapter {

  private readonly axios = axios;

  async get<T>( url: string ): Promise<T> {
    const { data } = await this.axios.get<T>(url);
    return data;
  }
}

export class PokeAdapterWithFetch implements HttpAdapter {
  
  async get<T>( url: string ): Promise<T> {
    const response = await fetch(url);
    const data: T = await response.json();
    return data;
  }
}

```

Por último en nuestra clase Pokemon, lo único que vamos a cambiar es el tipado de 
la dependencia que le estamos inyectando

Quedaria de la siguiente manera: 

`private pokeApi: HttpAdapter`

## Decorators

Un decorator es una función que realiza una modificación o una extension de una clase o metodo
target que recibe. 

E.g.

```typescript
// Creamos nuestro decorator
function MyDecorator() {
  // Un decorador devuelve otra funcion
  // Target es la definicion del componente al cual se le esta aplicando el decorador
  // En este caso target es la clase Pokemon
  return (target: Function) => {
    console.log("🚀 ~ file: 05-decorators.ts:6 ~ return ~ target", target);
  }
}

// Añadimos un decorador a esta clase
@MyDecorator()
export class Pokemon {

  constructor(
    public readonly id: number,
    public name: string,
  ){}

  scream(){
    console.log(`Pojemon ${this.name} is screaming`);
  }

  talk(){
    console.log(`Pojemon ${this.name} is talking`);
  }

}

```

Ahora recordemos que los decoradores son utilizados para modificar la definicion del componente sobre
el cual son invocados, en este caso la clase, esto lo hacen mediante la invocación de la función decorator.

Veamos el ejemplo a continuación, vamos a usar nuestro decorator `MyDecorator` para cambiar la definicion
de la clase `Pokemon`. 

Vamos a crear otra clase `Pokemons2`

La diferencia es que este pokemon es rebelde, no habla ni grita.

```typescript
class Pokemon2 {
  constructor(
    public readonly id: number,
    public name: string,
  ){}

  scream(){
    console.log(`No voy a gritar`);
  }

  talk(){
    console.log(`No quiero hablar`);
  }
}
```

Ahora, dentro de nuestro decorator vamos a retornar esta clase, nuestro decorator quedaria de la siguiente manera: 

````typescript
function MyDecorator() {
  return (target: Function) => {
    return Pokemon2;
  }
}
```

Ahora, si nosotros creamos una instancia de la clase Pokemon y realizamos la incovación de los metodos, vamos a obtener 
lo siguiente

```typescript

export const charmander = new Pokemon(1, 'charmander');

charmander.scream(); // No voy a gritar
charmander.talk(); // No quiero hablar

```

Esto sucede, porque nuestro decorator esta cambiando la definición de la clase.