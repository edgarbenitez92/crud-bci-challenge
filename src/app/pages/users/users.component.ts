import { Component } from '@angular/core';
import { UsersTableComponent } from '../../components/users-table/users-table.component';

@Component({
  selector: 'app-users',
  imports: [UsersTableComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent { }
