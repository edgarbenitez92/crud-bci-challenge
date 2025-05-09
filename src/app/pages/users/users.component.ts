import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { UsersTableComponent } from '../../components/users-table/users-table.component';
import { UserFormDialogComponent } from '../../components/dialogs/user-form-dialog/user-form-dialog.component';

@Component({
  selector: 'app-users',
  imports: [
    MatButtonModule,
    MatIconModule,
    UsersTableComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  private readonly dialog = inject(MatDialog);

  openNewUserDialog(): void {
    this.dialog.open(UserFormDialogComponent, {
      disableClose: true
    });
  }
}
