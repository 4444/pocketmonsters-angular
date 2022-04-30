import { PokemonType } from "../enums/pokemon-type.enum";

export interface Pokemon {
    id: number,
    uid: number,
    nickname: string,
    types: PokemonType[],
    level: number,
    exp: number,
    hpCurrent: number,
    stats: [number, number, number, number, number],
    ivs: [number, number, number, number, number]
}