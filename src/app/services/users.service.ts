import { Injectable, signal } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { User } from '../shared/interfaces/user.interface';
import { USERS_MOCK } from '../shared/mock/users.mock';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private users = signal<User[]>(USERS_MOCK);

  getUsers(): Observable<User[]> {
    return of(this.users()).pipe(
      delay(1500) // Simulate network delay of 1 second to show loading
    );
  }
}
