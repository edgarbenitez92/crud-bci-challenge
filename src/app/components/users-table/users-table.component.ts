import { Component, inject, signal, computed } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { map, tap } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

import { ExpandAnimation } from '../../shared/animations/expaded-animations.animation';
import { User } from '../../shared/interfaces/user.interface';
import { UsersService } from '../../services/users.service';
import { UtilsService } from '../../services/utils.service';

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
    MatDividerModule,
    NgClass,
  ],
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
  animations: [ExpandAnimation],
})
export class UsersTableComponent {
  private usersService = inject(UsersService);
  private readonly utilsService = inject(UtilsService);

  // Convert users stream to signal
  private readonly users = toSignal(
    this.usersService.getUsers().pipe(
      map(users => {
        const dataSource = new MatTableDataSource(users);
        dataSource.filterPredicate = (data: User, filter: string) => {
          const searchStr = `${data.name} ${data.lastname} ${data.country}`.toLowerCase();
          return searchStr.indexOf(filter) !== -1;
        };
        return dataSource;
      })
    ),
    { initialValue: new MatTableDataSource<User>([]) }
  );

  expandedElementId = signal<number | null>(null);

  // Convert resize observable to signal
  readonly isMobile = toSignal(
    this.utilsService.isResizing.pipe(
      tap(() => this.expandedElementId.set(null)),
      map(() => this.utilsService.isMobileScreen())
    ),
    { initialValue: this.utilsService.isMobileScreen() }
  );

  // Computed signal for filtered data
  private filterValue = signal('');
  usersDataSource = computed(() => {
    const dataSource = this.users();
    dataSource.filter = this.filterValue().toLowerCase();
    return dataSource;
  });

  isLoading = computed(() => !this.users()?.data?.length);
  noResults = computed(() => {
    const dataSource = this.usersDataSource();
    return !!this.filterValue() && !dataSource.filteredData.length;
  });

  displayedColumns = signal<string[]>([
    'name',
    'email',
    'country',
    'enable',
    'updatedAt',
    'actions',
    'seeDetails'
  ]);

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filterValue.set(value.trim());
  }

  expandDetailRow({ id }: User) {
    if (!this.isMobile()) return;
    this.expandedElementId.set(this.expandedElementId() === id ? null : id);
  }

  editUser(event: Event, user: User): void {
    event.stopPropagation();
    console.log('Edit user:', user);
  }

  deleteUser(event: Event, user: User): void {
    event.stopPropagation();
    console.log('Delete user:', user);
  }

  private sortUsersDataSource(
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
