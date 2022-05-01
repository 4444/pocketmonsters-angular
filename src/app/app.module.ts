import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPage } from './pages/login/login.page';
import { GamePage } from './pages/game/game.page';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { PlayerComponent } from './components/player/player.component';
import { GalleryPage } from './pages/gallery/gallery.page';
import { GalleryPokemonPage } from './pages/gallery/gallery-pokemon/gallery-pokemon.page';
import { LogOutButtonComponent } from './components/log-out-button/log-out-button.component';
import { TrainerNameComponent } from './components/trainer-name/trainer-name.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPage,
    GamePage,
    AudioPlayerComponent,
    PlayerComponent,
    GalleryPage,
    GalleryPokemonPage,
    LogOutButtonComponent,
    TrainerNameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
