import { Routes } from '@angular/router';

import { UsersComponent } from './pages/users/users.component';

export const base_routes: Routes = [
  {
    path: '',
    title: 'Administrador de Usuarios',
    component: UsersComponent
  },
  { path: '**', redirectTo: '' }
];
