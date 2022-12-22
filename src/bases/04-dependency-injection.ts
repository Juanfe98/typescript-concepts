import { PokeAdapter } from '../adapters/pokeApi.adapter';
import { Move, PokeapiReponse } from '../interfaces/pokeapi-response.interface';

export class Pokemon {

    get imageUrl(): string {
        return `https://pokemon.com/${ this.id }.jpg`;
    }
  
    constructor(
        public readonly id: number, 
        public name: string,
        // Todo: inyectar dependencias
        private pokeApi: PokeAdapter

    ) {}

    scream() {
        console.log(`${ this.name.toUpperCase() }!!!`);
    }

    speak() {
        console.log(`${ this.name }, ${ this.name }`);
    }

    async getMoves(): Promise<Move[]>{
      const { moves } = await this.pokeApi.get<PokeapiReponse>('https://pokeapi.co/api/v2/pokemon/4')
      return moves;
    }

}

const pokeApi = new PokeAdapter();

export const charmander = new Pokemon( 4, 'Charmander', pokeApi );
console.log(charmander.getMoves());
