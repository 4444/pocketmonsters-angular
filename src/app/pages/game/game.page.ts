import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { AudioPlayerComponent } from 'src/app/components/audio-player/audio-player.component';
import { GRID_COLS, GRID_ROWS, TILE_HEIGHT_PX, TILE_WIDTH_PX } from 'src/app/constants/game.const';
import { TILE_OFFSET_MAP } from 'src/app/constants/tile-id-map.const';
import { MAP_TEST, MAP_TEST2 } from 'src/app/constants/map-data.const';
import { TileType } from 'src/app/enums/tile-type.enum';
import { Direction } from 'src/app/enums/direction.enum';
import { GameState } from 'src/app/enums/game-state.enum';

const UPDATE_INTERVAL_TIMEOUT = 120;

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss']
})
export class GamePage implements OnInit, AfterViewInit {

  @ViewChild(AudioPlayerComponent) audioPlayer!: AudioPlayerComponent;

  @ViewChild("mapGrid") mapGrid!: ElementRef;
  @ViewChild("mapPlayer") player!: ElementRef;

  public get isBattling(): boolean {
    return this.state === GameState.IN_BATTLE;
  }

  public get isInMenu(): boolean {
    return this.state === GameState.IN_MENU;
  }

  public get hasStarted(): boolean {
    return this.state !== GameState.PENDING;
  }

  private state:GameState = GameState.PENDING;

  private currentMapData:number[][] = [];

  private updateIntervalId!:ReturnType<typeof setInterval>;

  private player_x:number = 16;
  private player_y:number = 2;

  private player_stepIndex:number = 0;

  private player_target_x:number = 16;
  private player_target_y:number = 2;

  private player_direction:Direction = Direction.SOUTH;

  private battleTransitionFrames = 0;

  constructor(private renderer:Renderer2) {
  }

  public startGame() {
    this.audioPlayer.playTitle();
    this.state = GameState.IN_MENU;
  }

  ngOnInit(): void {
    this.updateIntervalId = setInterval(() => {
      this.update();
    }, UPDATE_INTERVAL_TIMEOUT);

    addEventListener("keydown", (e) => {

      if (this.isBattling) return;

      switch(e.key) {
        case "ArrowUp":
          if (this.player_y -1 >= 0)
            this.clickTile(this.player_x, this.player_y - 1);
          break;
        case "ArrowDown":
          if (this.player_y + 1 < GRID_ROWS)
            this.clickTile(this.player_x, this.player_y + 1);
          break;
        case "ArrowLeft":
          if (this.player_x -1 >= 0)
            this.clickTile(this.player_x - 1, this.player_y);
          break;
        case "ArrowRight":
          if (this.player_x + 1 < GRID_COLS)
            this.clickTile(this.player_x + 1, this.player_y);
          break;
        default:
          break;
      }
    });

  }

  public update():void {

    if (this.isBattling) {
      
      if (this.battleTransitionFrames < 100) {
        this.battleTransitionFrames+=5;

        for(let x=0; x<GRID_COLS; ++x) {
          for(let y=0; y<GRID_ROWS; ++y) {
            const tile:HTMLDivElement = this.mapGrid.nativeElement.children[`tile_${x}_${y}`];
            tile.style.filter = `brightness(${200-this.battleTransitionFrames*(x%2==0 && y%2==0 ?2:2.1)}%)`;
          }
        }
      }
  }

    const prevX = this.player_x, prevY = this.player_y;

    const frames_n:number[] = [3,4,5,4];
    const frames_e:number[] = [9,8,9,8];
    const frames_s:number[] = [0,1,2,1];
    const frames_w:number[] = [7,6,7,6];
    
    let animationFrames:number[] = frames_n;

    // Move towards target
    if (this.player_x < this.player_target_x && 
        this.player_x + 1 < GRID_COLS && 
        !this.isTileSolid(this.currentMapData[this.player_y][this.player_x+1])) {
      // Check if we can move in the direction
      this.player_x += 1;
      this.player_direction = Direction.EAST;
      animationFrames = frames_e;
    }
    else if (this.player_x > this.player_target_x && 
             this.player_x - 1 >= 0 && 
             !this.isTileSolid(this.currentMapData[this.player_y][this.player_x-1])) {
        this.player_x -= 1;
        this.player_direction = Direction.WEST;
        animationFrames = frames_w;
    }
    else if (this.player_y < this.player_target_y && 
        this.player_y + 1 < GRID_ROWS && 
        !this.isTileSolid(this.currentMapData[this.player_y+1][this.player_x])) {
      // Check if we can move in the direction
      this.player_y += 1;
      this.player_direction = Direction.SOUTH;
      animationFrames = frames_s;
    }
    else if (this.player_y > this.player_target_y && 
             this.player_y - 1 >= 0 && 
             !this.isTileSolid(this.currentMapData[this.player_y-1][this.player_x])) {
        this.player_y -= 1;
        this.player_direction = Direction.NORTH;
        animationFrames = frames_n;
    }

    this.player.nativeElement.style.left = `${this.player_x * TILE_WIDTH_PX}px`;
    this.player.nativeElement.style.top = `${this.player_y * TILE_HEIGHT_PX}px`;
    
    // Walk animation
    if (this.player_x !== prevX || this.player_y !== prevY) {
      this.player_stepIndex++;
      if (this.player_stepIndex > 3) this.player_stepIndex = 0;

      this.player.nativeElement.style.backgroundPosition = `${animationFrames[this.player_stepIndex] * -32}px 0px`;
    }
    else {
      this.player_stepIndex = 3;
      switch(this.player_direction) {
        case Direction.NORTH:
          this.player.nativeElement.style.backgroundPosition = `${4 * -32}px 0px`;
          break;
          case Direction.EAST:
          this.player.nativeElement.style.backgroundPosition = `${8 * -32}px 0px`;
          break;
          case Direction.SOUTH:
          this.player.nativeElement.style.backgroundPosition = `${1 * -32}px 0px`;
          break;
          case Direction.WEST:
          this.player.nativeElement.style.backgroundPosition = `${6 * -32}px 0px`;
          break;
        default:
          break;
      }
    }
    
  }

  public loadMap(map:number[][]) {
    for(let x=0; x<GRID_COLS; ++x) {
      for(let y=0; y<GRID_ROWS; ++y) {
        const tile:HTMLDivElement = this.mapGrid.nativeElement.children[`tile_${x}_${y}`];
        console.log(TILE_OFFSET_MAP[map[y][x]].backgroundPosition);
        tile.setAttribute("tiletype", map[y][x].toString());
        tile.style.backgroundPosition = TILE_OFFSET_MAP[map[y][x]].backgroundPosition;
        console.log(tile);
      }
    }
    this.currentMapData = map;
  }

  public loadMap1() {
    this.player_x = this.player_target_x = 2;
    this.player_y = this.player_target_y = 14;
    this.player_direction = Direction.NORTH;
    this.loadMap(MAP_TEST2);
    this.audioPlayer.playCherry();
  }

  public loadMap2() {
    this.player_x = this.player_target_x = 5;
    this.player_y = this.player_target_y = 10;
    this.player_direction = Direction.SOUTH;
    this.loadMap(MAP_TEST);
    this.audioPlayer.playRoute();
  }

  public startBattle() {
    this.state = GameState.IN_BATTLE;
    this.battleTransitionFrames = 0;
    this.audioPlayer.playBattle();
  }

  public finishBattle() {

    // Clear tile filter effects
    for(let x=0; x<GRID_COLS; ++x) {
      for(let y=0; y<GRID_ROWS; ++y) {
        const tile:HTMLDivElement = this.mapGrid.nativeElement.children[`tile_${x}_${y}`];
        tile.style.filter = "";
      }
    }

    this.state = GameState.IN_OVERWORLD;
  }

  private isTileSolid(t:TileType) {
    return (t === TileType.TREE) ||
           (t >= TileType.ROOF_L && t <= TileType.BUILDING_R); //Building tiles
  }

  private clickTile(x:number, y:number) {
    const tileType = this.currentMapData[y][x];
    if (this.isTileSolid(tileType)) return;
    
    this.player_target_x = x;
    this.player_target_y = y;
  }

  ngAfterViewInit(): void {
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

    this.loadMap(MAP_TEST);
  }

  ngOnDestroy() {
    clearInterval(this.updateIntervalId);
  }

}
