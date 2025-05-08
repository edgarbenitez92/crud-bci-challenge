import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { finalize, map, tap } from 'rxjs/operators';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';

import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

import { ExpandAnimation } from '../../shared/animations/expaded-animations.animation';
import { User } from '../../shared/interfaces/user.interface';
import { UserDeleteDialogComponent } from '../dialogs/user-delete-dialog/user-delete-dialog.component';
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
    MatTableModule,
    MatDividerModule,
    NgClass,
  ],
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
  animations: [ExpandAnimation],
})
export class UsersTableComponent implements OnInit {
  private usersService = inject(UsersService);
  private readonly utilsService = inject(UtilsService);
  private readonly dialog = inject(MatDialog);

  usersDataSource = signal<MatTableDataSource<User>>(new MatTableDataSource<User>([]));
  expandedElementId = signal<number | null>(null);
  filterValue = signal('');

  isLoading = signal<boolean>(false);

  noResults = toSignal(
    toObservable(this.filterValue).pipe(
      map(filter => {
        const dataSource = this.usersDataSource();
        return !!filter && !dataSource.filteredData.length;
      })
    ),
    { initialValue: false }
  );

  isMobile = toSignal(
    this.utilsService.isResizing.pipe(
      tap(() => this.expandedElementId.set(null)),
      map(() => this.utilsService.isMobileScreen())
    ),
    { initialValue: this.utilsService.isMobileScreen() }
  );

  displayedColumns = signal<string[]>([
    'name',
    'email',
    'country',
    'enable',
    'updatedAt',
    'actions',
    'seeDetails'
  ]);

  constructor() {
    effect(() => {
      const dataSource = this.usersDataSource();
      const filter = this.filterValue();
      dataSource.filter = filter.toLowerCase();
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);

    this.usersService.getUsers(500)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe(users => {
        const dataSource = new MatTableDataSource(users);
        this.usersDataSource.set(this.applyFilterPredicate(dataSource));
      });
  }

  private applyFilterPredicate(dataSource: MatTableDataSource<User>): MatTableDataSource<User> {
    dataSource.filterPredicate = (data: User, filter: string) => {
      const searchStr = `${data.name} ${data.lastname} ${data.country}`.toLowerCase();
      return searchStr.indexOf(filter) !== -1;
    };

    return dataSource;
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue.set(value);
  }

  expandDetailRow({ id }: User) {
    if (!this.isMobile()) return;
    this.expandedElementId.set(this.expandedElementId() === id ? null : id);
  }

  editUser(event: Event, user: User): void {
    event.stopPropagation();
    console.log('Edit user:', user);
  }

  openDeleteUserDialog(event: Event, user: User): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(UserDeleteDialogComponent, {
      data: user
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.isLoading.set(true);
        this.deleteUser(user.id);
      }
    });
  }

  deleteUser(userId: number): void {
    this.usersService.deleteUser(userId)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => this.loadUsers(),
        error: () => console.error('Error deleting user'),
      });
  }
}
