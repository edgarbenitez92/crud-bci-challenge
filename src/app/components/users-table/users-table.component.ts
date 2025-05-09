import { Component, OnInit, inject, signal, effect, DestroyRef } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { finalize, map, tap } from 'rxjs/operators';
import { toSignal, toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

import { ExpandAnimation } from '../../shared/animations/expaded-animations.animation';
import { SnackBarService } from '../../services/snack-bar.service';
import { User } from '../../shared/interfaces/user.interface';
import { UserDeleteDialogComponent } from '../dialogs/user-delete-dialog/user-delete-dialog.component';
import { UserFormDialogComponent } from '../dialogs/user-form-dialog/user-form-dialog.component';
import { UsersService } from '../../services/users.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-users-table',
  imports: [
    DatePipe,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
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
  private readonly snackBarService = inject(SnackBarService);
  private readonly destroyRef = inject(DestroyRef);

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
    this.onEffectFilterValue();
  }

  ngOnInit(): void {
    this.isLoading.set(true);

    // Simulate delay in loading users
    setTimeout(() => {
      this.loadUsers();
    }, 1000);

    // Check if new user was created
    this.checkIfNewUserWasCreated();
  }

  onEffectFilterValue(): void {
    effect(() => {
      const dataSource = this.usersDataSource();
      const filter = this.filterValue();
      dataSource.filter = filter.toLowerCase();
    });
  }

  checkIfNewUserWasCreated(): void {
    this.usersService.usersChanged$
      .pipe(
        tap(() => {
          this.isLoading.set(true);
          this.loadUsers();
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  loadUsers(): void {
    this.usersService.getUsers(0)
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

  openEditUserDialog(event: Event, user: User): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      data: user,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadUsers();
    });
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
    this.isLoading.set(true);

    this.usersService.deleteUser(userId)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.loadUsers();

          // Show success notification
          this.snackBarService.showSuccessNotification('User deleted successfully');
        },
        error: () => console.error('Error deleting user'),
      });
  }
}
