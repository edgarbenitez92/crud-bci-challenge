import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { User } from '../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-user-delete-dialog',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './user-delete-dialog.component.html',
  styleUrl: './user-delete-dialog.component.scss'
})
export class UserDeleteDialogComponent {
  private dialogRef = inject(MatDialogRef<UserDeleteDialogComponent>);
  readonly user: User = inject(MAT_DIALOG_DATA);

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
