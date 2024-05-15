import { Component, Input } from '@angular/core';
import { Media } from '../../../helpers/share';

@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [],
  templateUrl: './image-viewer.component.html',
  styleUrl: './image-viewer.component.css'
})
export class ImageViewerComponent {
  @Input() media!:string

}
