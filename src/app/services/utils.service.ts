import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  isResizing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  isMobileScreen(): boolean {
    const minWidth = 992;
    const innerWidth = this.getScreenWidth();
    return innerWidth < minWidth;
  }

  getScreenWidth(): number {
    return window.innerWidth;
  }
}
