import { Component } from '@angular/core';
import { UsersTableComponent } from '../../components/users-table/users-table.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  imports: [UsersTableComponent],
})
export class UsersComponent {

}
