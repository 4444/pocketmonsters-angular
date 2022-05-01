import { PokemonType } from "../enums/pokemon-type.enum";

// Model for a (caught) Pokemon
export interface Pokemon {
    id: number,
    uid: number,
    nickname: string,
    types: PokemonType[],
    level: number,
    exp: number,
    ivs: [number, number, number, number, number]
}