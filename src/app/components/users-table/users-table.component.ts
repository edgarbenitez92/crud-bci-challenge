import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

import { User } from '../../shared/interfaces/user.interface';
import { UsersService } from '../../services/users.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-users-table',
  imports: [
    DatePipe,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    NgClass
  ],
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit {
  private usersService = inject(UsersService);

  @ViewChild('sortUsers') sortUsers!: MatSort;

  isLoading = signal<boolean>(true);
  dataSource = signal<MatTableDataSource<User>>(new MatTableDataSource<User>([]));
  noResults = signal<boolean>(false);

  displayedColumns = signal<string[]>([
    'name',
    'lastName',
    'country',
    'enable',
    'updatedAt',
    'actions'
  ]);

  ngOnInit(): void {
    this.loadUsers();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    const dataSource = this.dataSource();
    dataSource.filter = filterValue.trim().toLowerCase();

    this.noResults.set(!dataSource.filteredData.length);
  }

  editUser(user: User): void {
    console.log('Edit user:', user);
  }

  deleteUser(user: User): void {
    console.log('Delete user:', user);
  }

  private loadUsers(): void {
    this.isLoading.set(true);
    this.usersService.getUsers()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (users) => {
          const dataSource = new MatTableDataSource(users);

          // Set the sort 
          this.sortUsersDataSource(dataSource, this.sortUsers);

          // Set the filter predicate
          dataSource.filterPredicate = (data: User, filter: string) => {
            const searchStr = `${data.name} ${data.lastname} ${data.country}`.toLowerCase();
            return searchStr.indexOf(filter) !== -1;
          };

          // Set the data source
          this.dataSource.set(dataSource);
        },
        error: (error) => {
          console.error('Error loading users:', error);
        }
      });
  }

  sortUsersDataSource(
    dataSource: MatTableDataSource<User>,
    sortTable: MatSort
  ) {
    dataSource.data.sort((a, b) => {
      if (a.lastname && b.lastname) {
        return a.lastname.localeCompare(b.lastname);
      }
      return 0;
    });

    dataSource.sortingDataAccessor = (row: User, columnName: string): string | number => {
      switch (columnName) {
        case 'name':
          return row.name || '';
        case 'lastname':
          return row.lastname || '';
        case 'country':
          return row.country || '';
        case 'enable':
          return row.enable ? 1 : 0;
        case 'updatedAt':
          return row.updatedAt ? row.updatedAt.getTime() : 0;
        default:
          const value = row[columnName as keyof User];
          return value !== undefined && value !== null ? String(value) : '';
      }
    };

    dataSource.sort = sortTable;
  }
}
