import axios from "axios";

export class PokeAdapter {

  // Creating this attribute will ensure that if axios changes we only will need to
  // update here the name.
  private readonly axios = axios;

  // <T> Es un generico, lo que le decimos con esto es que va a recibir el tipado
  // Como este metodo sera usado para realizar multiples y diferentes peticiones, 
  // no va a tener un tipado fijo, sinoque el generico se lo enviamos dependiendo de su ejecicion.
  async get<T>( url: string ): Promise<T> {
    const { data } = await this.axios.get<T>(url);
    return data;
  }

}