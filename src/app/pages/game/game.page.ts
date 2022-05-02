import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { AudioPlayerComponent } from 'src/app/components/audio-player/audio-player.component';
import { GRID_COLS, GRID_ROWS, TILE_HEIGHT_PX, TILE_WIDTH_PX } from 'src/app/constants/game.const';
import { TILE_OFFSET_MAP } from 'src/app/constants/tile-id-map.const';
import { MAP_ROUTE_1, MAP_ROUTE_2 } from 'src/app/constants/map-data.const';
import { TileType } from 'src/app/enums/tile-type.enum';
import { Direction } from 'src/app/enums/direction.enum';
import { GameState } from 'src/app/enums/game-state.enum';
import { PokemonService } from 'src/app/services/pokemon.service';
import { Pokemon } from 'src/app/models/pokemon.model';
import { PlayerComponent } from 'src/app/components/player/player.component';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';

export const UPDATE_INTERVAL_TIMEOUT = 120;
export const CHANCE_RANDOM_ENCOUNTER = 0.2;

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss']
})
export class GamePage implements OnInit, AfterViewInit {

  constructor(
    private renderer:Renderer2,
    private userService:UserService,
    private pokemonService:PokemonService,
    private router:Router) {
  }

  @ViewChild(AudioPlayerComponent) audioPlayer!: AudioPlayerComponent;
  @ViewChild(PlayerComponent) player!: PlayerComponent;
  @ViewChild("mapGrid") mapGrid!: ElementRef;

  private state:GameState = GameState.PENDING;
  private currentMapData:number[][] = [];
  private updateIntervalId!:ReturnType<typeof setInterval>;
  private battleTransitionFrames = 0;
  private encounterPokemon?:Pokemon = undefined;
  private encounterCaught:boolean = false;
  private processingRequest:boolean = false;

  public get inEncounter(): boolean {
    // Is the game in the encounter state?
    return this.state === GameState.IN_ENCOUNTER;
  }

  public get isInMenu(): boolean { 
    // Is the game menu screen displaying?
    return this.state === GameState.IN_MENU;
  }

  public get hasStarted(): boolean {
    // Has the game started?
    return this.state !== GameState.PENDING;
  }

  public get mapData() : number[][] {
    // Get the tile data of the currently loaded map
    return this.currentMapData;
  }

  public get encounterName() : string | undefined {
    // The species name of the current encounter
    return this.encounterPokemon ? this.encounterPokemon.nickname : undefined;
  }

  public get encounterImageUrl(): string | undefined {
    if (!this.encounterPokemon) return undefined;
    return `url("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/transparent/${this.encounterPokemon?.id}.png")`;
  }

  public get encounterWasCaught(): boolean {
    return this.encounterCaught;
  }

  public get isProcessing(): boolean {
    // Is the game processing a request?
    return this.processingRequest;
  }

  public clickNavigate(url:string) {
    this.audioPlayer.pauseAll();
    this.router.navigateByUrl(url);
  }

  public showHelp():void {
    alert("Instructions:\n\nClick or use the arrow keys to walk through the tall grass to encounter random Pokemon.\n\nVisit the gallery page (top left) to view Pokemon. Have fun!");
  }

  public startGame() {
    if (this.userService.localUser!.sprite !== -1) {
      // TODO: Show options to set custom sprite if sprite is not set
    }

    // If the trainer character is already initialized, go to to the overworld
    this.state = GameState.IN_OVERWORLD;
    this.loadMapRoute1();
    return;
  }

  public isTileSolid(t:TileType) {
    // Whether or not a tile is determined to be solid
    return (t === TileType.TREE) ||
           (t >= TileType.ROOF_L && t <= TileType.BUILDING_R); //Building tiles
  }

  ngOnInit(): void {
    // Start the update loop
    this.updateIntervalId = setInterval(() => {
      this.update();
    }, UPDATE_INTERVAL_TIMEOUT);

    addEventListener("keydown", (e) => {
      // Checking input for moving around using the arrow keys
      if (this.inEncounter) return;

      const {x, y} = this.player.getPosition();

      switch(e.key) {
        case "ArrowUp":
          if (y - 1 >= 0)
            this.clickTile(x, y - 1);
          break;
        case "ArrowDown":
          if (y + 1 < GRID_ROWS)
            this.clickTile(x, y + 1);
          break;
        case "ArrowLeft":
          if (x - 1 >= 0)
            this.clickTile(x - 1, y);
          break;
        case "ArrowRight":
          if (x + 1 < GRID_COLS)
            this.clickTile(x + 1, y);
          break;
        default:
          break;
      }
    });
  }

  public update():void {

    if (this.inEncounter) {
      // Darken the tiles (fade out effect)
      if (this.battleTransitionFrames < 100) {
        this.battleTransitionFrames += 5;
        for(let x=0; x<GRID_COLS; ++x)
          for(let y=0; y<GRID_ROWS; ++y) {
            const tile:HTMLDivElement = this.mapGrid.nativeElement.children[`tile_${x}_${y}`];
            tile.style.filter = `brightness(${200-this.battleTransitionFrames*(x%2==0 && y%2==0 ?2:2.1)}%)`;
          }
      }
    }
    else {
      if (this.battleTransitionFrames > 0) {
        // Brighten up the tiles (fade in)
        this.battleTransitionFrames -= 5;
        for(let x=0; x<GRID_COLS; ++x) 
          for(let y=0; y<GRID_ROWS; ++y) {
            const tile:HTMLDivElement = this.mapGrid.nativeElement.children[`tile_${x}_${y}`];
            tile.style.filter = `brightness(${100-this.battleTransitionFrames}%)`;
          }
      }

      // Update player component
      this.player.update();
    }
    
  }

  // Load tile data into the map grid DOM element 
  public loadMap(map:number[][]) {
    for(let x=0; x<GRID_COLS; ++x) {
      for(let y=0; y<GRID_ROWS; ++y) {
        const tile:HTMLDivElement = this.mapGrid.nativeElement.children[`tile_${x}_${y}`];
        tile.setAttribute("tiletype", map[y][x].toString());
        tile.style.backgroundPosition = TILE_OFFSET_MAP[map[y][x]].backgroundPosition;
      }
    }
    this.currentMapData = map;
  }

  public loadMapRoute1() {
    this.player.setPosition(16,3, Direction.SOUTH);
    this.loadMap(MAP_ROUTE_1);
    this.audioPlayer.playRoute();
  }

  public loadMapRoute2() {
    this.player.setPosition(2,14, Direction.NORTH);
    this.loadMap(MAP_ROUTE_2);
    this.audioPlayer.playRoute();
  }

  public startBattle() {
    this.state = GameState.IN_ENCOUNTER;
    this.battleTransitionFrames = 0;
    this.audioPlayer.playBattle();

    this.pokemonService.generateRandomPokemon(1).subscribe({
      next: (pokemon:Pokemon) => {
        this.encounterPokemon = pokemon;
      },
      error: () => {
        alert("Error: Could not reach server. Please try again later.");
      }
    });
  }

  // Catch the currently encountered pokemon
  public catchPokemonEncounter() {
    this.processingRequest = true;
    this.audioPlayer.pauseAll();

    const localUser:User = this.userService.localUser!;

    const changedUser:User = {
      ...localUser,
      pokemon: [
        ...localUser.pokemon,
        this.encounterPokemon! // Add the mon to our collection
      ]
    }

    this.userService.update(changedUser).subscribe({
      next: (updatedUser:User) => {
        this.userService.localUser = updatedUser;
        this.encounterCaught = true;
        this.audioPlayer.playSfxCaught();
        setTimeout(() => {
          this.finishBattle();
        }, 3000);
      },
      error: () => {
        alert("Something went wrong. Please try again.");
        this.processingRequest = false;
      },
      complete: () => {
        this.processingRequest = false;
      }
    });
  }

  public finishBattle() {
    this.encounterPokemon = undefined;
    this.encounterCaught = false;
    this.state = GameState.IN_OVERWORLD;
    this.audioPlayer.playRoute();
  }

  private clickTile(x:number, y:number) {
    const tileType = this.currentMapData[y][x];
    if (this.isTileSolid(tileType)) return;
    this.player.setTargetPosition(x,y);
  }

  ngAfterViewInit(): void {
    // Initially, render the tilemap as HTML elements
    for(let x=0; x<GRID_COLS; ++x) {
      for(let y=0; y<GRID_ROWS; ++y) {
        const tile:HTMLDivElement = this.renderer.createElement("div");
        tile.id = `tile_${x}_${y}`;
        tile.className = "map-tile";
        tile.style.left = `${x * TILE_WIDTH_PX}px`;
        tile.style.top = `${y * TILE_HEIGHT_PX}px`;
        tile.onclick = () => { this.clickTile(x,y) };
        this.mapGrid.nativeElement.appendChild(tile);
      }
    }

    this.player.setPosition(16,3);
  }

  ngOnDestroy() {
    // Clear update loop interval when this object is destroyed
    clearInterval(this.updateIntervalId);
  }

}
