import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Resources } from 'src/app/constants/resources.const';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit, AfterViewInit, OnDestroy {

  private bgm_title_audio : HTMLAudioElement = new Audio(Resources.BGM_TITLE_URL);
  private bgm_route_audio : HTMLAudioElement = new Audio(Resources.BGM_ROUTE_URL);
  private bgm_battle_audio : HTMLAudioElement = new Audio(Resources.BGM_BATTLE_URL);
  private bgm_cherry_audio : HTMLAudioElement = new Audio(Resources.BGM_CHERRY_URL);

  private sfx_caught_mon : HTMLAudioElement = new Audio(Resources.SFX_CAUGHT_MON_URL);

  private bgmElements: HTMLAudioElement[] = [this.bgm_title_audio, this.bgm_route_audio, this.bgm_battle_audio, this.bgm_cherry_audio];
  private sfxElements: HTMLAudioElement[] = [this.sfx_caught_mon];

  constructor() { }

  ngOnInit(): void {
    // Set background music elements to loop
    this.bgmElements.forEach(audio => {
      audio.loop = true
      audio.preload = "auto";
    });

    // Set sound effects to not loop
    this.sfxElements.forEach(audio => { 
      audio.loop = false;
      audio.preload = "auto";
    });
  }

  public playTitle() {
    this.pauseAll();
    this.bgm_title_audio.play();
  }

  public playCherry() {
    this.pauseAll();
    this.bgm_cherry_audio.play();
  }

  public playRoute() {
    this.pauseAll();
    this.bgm_route_audio.play();
  }

  public playBattle() {
    this.pauseAll();
    this.bgm_battle_audio.currentTime = 0;
    this.bgm_battle_audio.play();
  }

  public playSfxCaught() {
    this.sfx_caught_mon.play();
  }

  public pauseAll() {
    this.bgmElements.forEach(a => {
      a.pause();
    });
  }

  public ngAfterViewInit() {
  }

  public ngOnDestroy() {
    this.bgmElements.forEach(a => {
      a.pause();
    });
    this.sfxElements.forEach(a => {
      a.pause();
    });
  }

}
