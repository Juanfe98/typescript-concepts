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