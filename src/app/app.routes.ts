import { Routes } from '@angular/router';

import { UsersComponent } from './pages/users/users.component';

export const base_routes: Routes = [
  { path: '', component: UsersComponent },
  { path: '**', redirectTo: '' }
];
