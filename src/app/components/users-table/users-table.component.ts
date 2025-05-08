import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

import { User } from '../../shared/interfaces/user.interface';
import { UsersService } from '../../services/users.service';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
  imports: [
    CommonModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatButtonModule
  ],
})
export class UsersTableComponent implements OnInit {
  private usersService = inject(UsersService);

  isLoading = signal<boolean>(true);
  dataSource = signal<MatTableDataSource<User>>(new MatTableDataSource<User>([]));

  displayedColumns = signal<string[]>([
    'name',
    'lastName',
    'region',
    'country',
    'enable',
    'updatedAt',
    'actions'
  ]);

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.usersService.getUsers()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (users) => {
          this.dataSource.set(new MatTableDataSource(users));
        },
        error: (error) => {
          console.error('Error loading users:', error);
        }
      });
  }

  editUser(user: User): void {
    console.log('Edit user:', user);
  }

  deleteUser(user: User): void {
    console.log('Delete user:', user);
  }
}
