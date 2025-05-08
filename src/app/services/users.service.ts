import { delay } from 'rxjs/operators';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import { User } from '../shared/interfaces/user.interface';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly localStorageService = inject(LocalStorageService);

  getUsers(delayMs: number = 1000): Observable<User[]> {
    const users = this.localStorageService.getItem<User[]>(this.localStorageService.getUsersKey()) || [];
    return of(users).pipe(delay(delayMs));
  }

  deleteUser(userId: number): Observable<void> {
    const users = this.localStorageService.getItem<User[]>(this.localStorageService.getUsersKey()) || [];
    const updatedUsers = users.filter(user => user.id !== userId);
    this.localStorageService.setItem(this.localStorageService.getUsersKey(), updatedUsers);

    return of(void 0).pipe(delay(1000));
  }
}
