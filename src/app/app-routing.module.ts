import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserGuard } from './guards/user.guard';
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
