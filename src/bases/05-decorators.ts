
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

// Creamos nuestro decorator
function MyDecorator() {
  // Un decorador devuelve otra funcion
  // Target es la instancia del componente al cual se le esta aplicando el decorador
  // En este caso target es la clase Pokemon
  return (target: Function) => {
    console.log("🚀 ~ file: 05-decorators.ts:6 ~ return ~ target", target);
    return Pokemon2;
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

export const charmander = new Pokemon(1, 'charmander');

charmander.scream();
charmander.talk();