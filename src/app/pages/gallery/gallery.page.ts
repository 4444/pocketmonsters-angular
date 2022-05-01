import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PokemonSpecies } from 'src/app/models/pokemon-species.model';
import { PokemonService } from 'src/app/services/pokemon.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss']
})
export class GalleryPage implements OnInit {

  public loading:boolean = true;
  
  public pokemonSpecies:PokemonSpecies[] | undefined;

  public errorMessage:string | undefined;

  public showCaught:boolean = false;

  public getSpeciesImageUrl(id:number):string {
    if (this.getCaughtAmount(id) > 0)
      return `https://pkmn.net/sprites/crystal/${id}.gif`; // Return an animated gif if the user has caught this pokemon.
      
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/transparent/${id}.png`;
  }

  public getCaughtAmount(id:number):number {
    return this.userService.localUser!.pokemon.filter(p => p.id === id).length;
  }

  public toggleShowCaught():void {
    this.showCaught = !this.showCaught;
  }

  constructor(
    private pokemonService:PokemonService,
    private userService:UserService,
    private router:Router) { }

  public clickNavigate(url:string):void {
    this.router.navigateByUrl(url);
  }

  public clickViewCaught(id:number):void {
    this.router.navigate(["/gallery", id])
  }

  ngOnInit(): void {
    this.loading = true;

    this.pokemonService.getPokemonSpecies().subscribe({
      next: (result:PokemonSpecies[]) => {
        this.pokemonSpecies = result;
      },
      error: () => {
        this.errorMessage = "Could not load gallery.";
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    })
    
  }

}
