import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { GRID_COLS, GRID_ROWS, TILE_HEIGHT_PX, TILE_WIDTH_PX } from 'src/app/constants/game.const';
import { Direction } from 'src/app/enums/direction.enum';
import { TileType } from 'src/app/enums/tile-type.enum';

import { CHANCE_RANDOM_ENCOUNTER, GamePage } from 'src/app/pages/game/game.page';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  private x:number = 1;
  private y:number = 1;

  private targetX:number = 1;
  private targetY:number = 1;

  private stepIndex:number = 0;

  private direction:Direction = Direction.SOUTH;

  constructor(public element: ElementRef, 
              @Inject(GamePage) private game: GamePage) { }

  ngOnInit(): void {
  }

  public getPosition(): {x:number, y:number} {
    return { x: this.x, y: this.y };
  }

  public setPosition(x:number, y:number, direction:Direction = Direction.SOUTH):void {
    this.x = this.targetX = x;
    this.y = this.targetY = y;
    this.direction = direction;
  }

  public setTargetPosition(x:number, y:number):void {
    this.targetX = x;
    this.targetY = y;
  }

  public setDirection(direction:Direction) {
    this.direction = direction;
  }

  public update():void {
    const prevX = this.x, prevY = this.y;

    const frames_n:number[] = [3,4,5,4];
    const frames_e:number[] = [9,8,9,8];
    const frames_s:number[] = [0,1,2,1];
    const frames_w:number[] = [7,6,7,6];
    
    let animationFrames:number[] = frames_n;

    // Move towards target
    if (this.x < this.targetX && 
        this.x + 1 < GRID_COLS && 
        !this.game.isTileSolid(this.game.mapData[this.y][this.x+1])) {
      // Check if we can move in the direction
      this.x += 1;
      this.direction = Direction.EAST;
      animationFrames = frames_e;
    }
    else if (this.x > this.targetX && 
             this.x - 1 >= 0 && 
             !this.game.isTileSolid(this.game.mapData[this.y][this.x-1])) {
        this.x -= 1;
        this.direction = Direction.WEST;
        animationFrames = frames_w;
    }
    else if (this.y < this.targetY && 
        this.y + 1 < GRID_ROWS && 
        !this.game.isTileSolid(this.game.mapData[this.y+1][this.x])) {
      // Check if we can move in the direction
      this.y += 1;
      this.direction = Direction.SOUTH;
      animationFrames = frames_s;
    }
    else if (this.y > this.targetY && 
             this.y - 1 >= 0 && 
             !this.game.isTileSolid(this.game.mapData[this.y-1][this.x])) {
        this.y -= 1;
        this.direction = Direction.NORTH;
        animationFrames = frames_n;
    }

    // Update position on the map
    this.element.nativeElement.style.left = `${this.x * TILE_WIDTH_PX}px`;
    this.element.nativeElement.style.top = `${this.y * TILE_HEIGHT_PX}px`;
    
    if (this.x !== prevX || this.y !== prevY) {
      // We have moved, display a walking animation.
      this.stepIndex++;
      if (this.stepIndex > 3) this.stepIndex = 0;
      this.element.nativeElement.style.backgroundPosition = `${animationFrames[this.stepIndex] * -32}px 0px`;

      // Check if the player has stepped in tall grass
      if (this.game.mapData[this.y][this.x] === TileType.TALLGRASS) {
        // Chance to encounter a Pokemon!
        const encounterChance = Math.random();
        if (encounterChance < CHANCE_RANDOM_ENCOUNTER) {
          this.setTargetPosition(this.x, this.y); // Stop movement
          this.game.startBattle();
        }
      }
    }
    else {
      this.stepIndex = 3;
      switch(this.direction) {
        case Direction.NORTH:
          this.element.nativeElement.style.backgroundPosition = `${4 * -32}px 0px`;
          break;
          case Direction.EAST:
          this.element.nativeElement.style.backgroundPosition = `${8 * -32}px 0px`;
          break;
          case Direction.SOUTH:
          this.element.nativeElement.style.backgroundPosition = `${1 * -32}px 0px`;
          break;
          case Direction.WEST:
          this.element.nativeElement.style.backgroundPosition = `${6 * -32}px 0px`;
          break;
        default:
          break;
      }
    }
  }
}
