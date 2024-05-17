import { Component, Input, input, signal } from '@angular/core';
import { Media } from '../../../helpers/share';

@Component({
  selector: 'app-video-viewer',
  standalone: true,
  imports: [],
  templateUrl: './video-viewer.component.html',
  styleUrl: './video-viewer.component.css'
})
export class VideoViewerComponent {
  @Input() video!:Media
  path = signal("")


}
