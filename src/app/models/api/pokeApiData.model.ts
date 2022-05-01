import { PokemonType } from "../../enums/pokemon-type.enum";

// Interface for the data from PokeApi that we care about
export interface PokeApiData {
    id: number,
    species: { name: string },
    stats: Array<{base_stat:number}>,
    types: Array<{slot:number, type:{name:PokemonType}}>
}