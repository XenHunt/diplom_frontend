import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MediaViewerComponent } from './components/media-viewer/media-viewer.component';
import { BarComponent } from './components/bar/bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,  MediaViewerComponent, BarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'web-yolov9';
}
