import { Injectable, signal } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { User } from '../shared/interfaces/user.interface';
import { USERS_MOCK } from '../shared/mock/users.mock';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private users = signal<User[]>(USERS_MOCK);

  getUsers(delayTime: number = 0): Observable<User[]> {
    return of(this.users()).pipe(
      delay(delayTime) // Simulate network delay by passing a delay time
    );
  }

  deleteUser(userId: number): Observable<User[]> {
    // Update the internal state
    this.users.update(currentUsers => currentUsers.filter(user => user.id !== userId));

    // Return the updated users
    return this.getUsers(500);
  }
}
