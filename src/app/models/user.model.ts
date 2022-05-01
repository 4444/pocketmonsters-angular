import { Pokemon } from "./pokemon.model";

export interface User {
    id: number,
    sprite:number,
    username: string,
    pokemon: Pokemon[]
}