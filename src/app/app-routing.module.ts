import { RemultModule, NotSignedInGuard, SignedInGuard } from '@remult/angular';
import { NgModule, ErrorHandler } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';


import { UsersComponent } from './users/users.component';
import { Roles, AdminGuard } from './users/roles';
import { ShowDialogOnErrorErrorHandler } from './common/dialog';
import { ManageComponent } from './manage/manage.component';
import { BottlesComponent } from './bottles/bottles.component';


const routes: Routes = [
  { path: 'Home', component: HomeComponent },
  { path: 'בקבוקים', component: BottlesComponent, canActivate: [AdminGuard] },
  { path: 'הגדרות', component: ManageComponent, canActivate: [AdminGuard] },
  { path: 'משתמשים', component: UsersComponent, canActivate: [AdminGuard] },
  { path: '', redirectTo: '/Home', pathMatch: 'full' },
  { path: '**', redirectTo: '/Home', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes), RemultModule],
  providers: [AdminGuard, { provide: ErrorHandler, useClass: ShowDialogOnErrorErrorHandler }],
  exports: [RouterModule]
})
export class AppRoutingModule { }

