import { Component, HostListener, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { USERS_MOCK } from './shared/mock/users.mock';
import { UtilsService } from './services/utils.service';
import { LocalStorageService } from './services/local-storage.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private readonly utilsService = inject(UtilsService);
  private readonly localStorageService = inject(LocalStorageService);

  // Resize event listener
  @HostListener('window:resize') onWindowResize() {
    this.utilsService.isResizing.next(true);
  }

  ngOnInit(): void {
    // Initialize mocked data in LocalStorage
    this.localStorageService.setItem(this.localStorageService.getUsersKey(), USERS_MOCK);
  }
}
