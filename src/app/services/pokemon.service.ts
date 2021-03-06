import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pokemon } from '../models/pokemon.model';

import { environment } from 'src/environments/environment';
import { PokemonType } from '../enums/pokemon-type.enum';
import { map, Observable } from 'rxjs';
import { PokeApiData } from '../models/api/pokeApiData.model';
import { PokeApiSpeciesData } from '../models/api/pokeApiSpeciesData.model';
import { PokemonSpecies } from '../models/pokemon-species.model';

const { pokeApiURL } = environment;

// Helper function for generating a random integer within a range
const randomInt = (min:number, max:number):number => 
  Math.floor(Math.random() * (max - min + 1)) + min;

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(private http:HttpClient) { }

  // Used to retrieve data for a single Pokemon
  public getPokemonData = (id:number):Observable<PokeApiData> => {
    return this.http.get<PokeApiData>(`${pokeApiURL}/pokemon/${id}`);
  }

  // Used to retrieve all pokemon species (up to generation 2)
  public getPokemonSpecies = ():Observable<PokemonSpecies[]> => {
    return this.http.get<PokeApiSpeciesData>(`${pokeApiURL}/pokemon-species?offset=0&limit=251`).pipe<PokemonSpecies[]>(
      map(data => {
        return data.results.map((species, index):PokemonSpecies => {
          return {
            id: index + 1, // Results are ordered but zero-based, so dex no. is index + 1
            name: species.name
          }
        });
      })
    );
  }

  // Used to generate a new pokemon, based on its dex number (id)
  public generatePokemon = (id:number, level:number):Observable<Pokemon> => {
    const generateUID = () => Math.floor(Math.random() * Math.pow(2, 32));
    const generateIV = () => randomInt(0,15);
    
    // Retrieve pokeApi data and map it to a new Pokemon
    return this.http.get<PokeApiData>(pokeApiURL + "/pokemon/" + id).pipe<Pokemon>(
      map(data => {
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

  // Used to generate a pokemon with a random id
  public generateRandomPokemon = (level:number):Observable<Pokemon> => {
    return this.generatePokemon(randomInt(1,251), level);
  }
}
