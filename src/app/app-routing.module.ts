import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserGuard } from './guards/user.guard';
import { GalleryPokemonPage } from './pages/gallery/gallery-pokemon/gallery-pokemon.page';
import { GalleryPage } from './pages/gallery/gallery.page';
import { GamePage } from './pages/game/game.page';
import { LoginPage } from './pages/login/login.page';

const routes: Routes = [
  {
    path: "",
    component: LoginPage
  },
  {
    path: "game",
    component: GamePage,
    canActivate: [UserGuard]
  },
  {
    path: "gallery",
    component: GalleryPage,
    canActivate: [UserGuard],
  },
  {
    path: "gallery/:id",
    component: GalleryPokemonPage,
    canActivate: [UserGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
