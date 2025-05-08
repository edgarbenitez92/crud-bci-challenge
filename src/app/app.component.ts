import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UtilsService } from './services/utils.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private readonly utilsService = inject(UtilsService);

  @HostListener('window:resize') onWindowResize() {
    this.utilsService.isResizing.next(true);
  }
}
