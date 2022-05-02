import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pokemon } from 'src/app/models/pokemon.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-gallery-pokemon',
  templateUrl: './gallery-pokemon.page.html',
  styleUrls: ['./gallery-pokemon.page.scss']
})
export class GalleryPokemonPage implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private userService:UserService,
    private router:Router) { }

  public id:number = 1;
  public caughtPokemon:Pokemon[] = [];
  public processingUid:number|undefined = undefined;

  public getPokemonImageUrl():string {
    return `https://pkmn.net/sprites/crystal/${this.id}.gif`;
  }

  // Release a single pokemon with unique identifier uid
  public releasePokemon(uid:number) {
    const pokemon = this.caughtPokemon.find(p => p.uid === uid);

    // Confirm the release action first
    if (confirm(`Are you sure you want to release your precious level ${pokemon?.level} ${pokemon?.nickname}?`)) {
      
      this.processingUid = uid;
      
      const localUser:User = this.userService.localUser!;

      const changedUser:User = {
        ...localUser,
        pokemon: localUser.pokemon.filter(p => p.uid !== uid)
      }
  
      this.userService.update(changedUser).subscribe({
        next: (updatedUser:User) => {
          this.userService.localUser = updatedUser;
          this.loadCaughtPokemon();
        },
        error: () => {
          alert("Something went wrong. Please try again.");
          this.processingUid = undefined;
        },
        complete: () => {
          this.processingUid = undefined;
        }
      });
    }

  }

  public clickNavigate(url:string) {
    this.router.navigateByUrl(url);
  }

  public ngOnInit(): void {
    // Obtain the pokemon's ID from the URL (route parameter)
    this.route.params.subscribe(params => {
      this.id = parseInt(params["id"]);
      this.loadCaughtPokemon();
    });
  }

  private loadCaughtPokemon():void {
    // Obtain locally caught pokemon
    this.caughtPokemon = this.userService.localUser!.pokemon.filter(p => p.id === this.id);
  }

}
