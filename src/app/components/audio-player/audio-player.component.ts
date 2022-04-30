import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Resources } from 'src/app/constants/resources.const';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit, AfterViewInit {

  private bgm_title_audio : HTMLAudioElement = new Audio(Resources.BGM_TITLE_URL);
  private bgm_route_audio : HTMLAudioElement = new Audio(Resources.BGM_ROUTE_URL);
  private bgm_battle_audio : HTMLAudioElement = new Audio(Resources.BGM_BATTLE_URL);
  private bgm_cherry_audio : HTMLAudioElement = new Audio(Resources.BGM_CHERRY_URL);

  private audioElements: HTMLAudioElement[] = [this.bgm_title_audio, this.bgm_route_audio, this.bgm_battle_audio, this.bgm_cherry_audio];

  constructor() { }

  ngOnInit(): void {
    this.audioElements.forEach(audio => audio.loop = true);
    this.audioElements.forEach(audio => audio.preload = "auto");
  }

  public playTitle() {
    this.pauseAll();
    this.bgm_battle_audio.currentTime = 0;
    this.bgm_title_audio.play();
  }

  public playCherry() {
    this.pauseAll();
    this.bgm_battle_audio.currentTime = 0;
    this.bgm_cherry_audio.play();
  }

  public playRoute() {
    this.pauseAll();
    this.bgm_battle_audio.currentTime = 0;
    this.bgm_route_audio.play();
  }

  public playBattle() {
    this.pauseAll();
    this.bgm_battle_audio.play();
  }

  private pauseAll() {
    this.audioElements.forEach(a => {
      a.pause();
    });
  }

  public ngAfterViewInit() {
    console.log(this.audioElements);
  }

}
