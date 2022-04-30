import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pokemon } from '../models/pokemon.model';

import { environment } from 'src/environments/environment';
import { PokemonType } from '../enums/pokemon-type.enum';
import { map, Observable } from 'rxjs';

const { pokeApiURL } = environment;

// Interface of the data from PokeApi that we care about
interface PokeApiData {
  id: number,
  species: { name: string },
  stats: Array<{base_stat:number}>,
  types: Array<{slot:number, type:{name:PokemonType}}>
}

const randomInt = (min:number, max:number):number => 
  Math.floor(Math.random() * (max - min + 1)) + min;

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(private http:HttpClient) { }

  public generatePokemon = (id:number, level:number):Observable<Pokemon> => {
    const generateUID = () => Math.floor(Math.random() * Math.pow(2, 32));
    const generateIV = () => randomInt(0,15);
    
    // Retrieve from API here
    return this.http.get<PokeApiData>(pokeApiURL + "/pokemon/" + id).pipe<Pokemon>(
      map(data => {
        console.log(data);
        return {
            id: data.id,
            uid: generateUID(),
            nickname: data.species.name,
            level: level,
            ivs: [
              generateIV(),
              generateIV(),
              generateIV(),
              generateIV(),
              generateIV()
            ],
            exp: 0,
            types: data.types.map<PokemonType>(t => t.type.name)
        };
      })
    );
  }

  public generateRandomPokemon = (level:number):Observable<Pokemon> => {
    return this.generatePokemon(randomInt(1,251), level);
  }
}
