import { Component, OnInit, OnDestroy } from '@angular/core';
import { Media, MediaType } from '../../helpers/share';
import { MediaService } from '../../services/media.service';
import { VideoViewerComponent } from './video-viewer/video-viewer.component';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { Subscription } from 'rxjs';
import { environmet } from '../../helpers/environmet';


@Component({
  selector: 'app-show-and-edit',
  standalone: true,
  imports: [VideoViewerComponent, ImageViewerComponent],
  templateUrl: './show-and-edit.component.html',
  styleUrl: './show-and-edit.component.css'
})
export class ShowAndEditComponent implements OnInit, OnDestroy{
  video = MediaType.Video
  image = MediaType.Image
  selectedMedia:Media|null = null;
  path:string|null = null
  sub?:Subscription
  status:string = "Waiting..."
  constructor(private mediaService: MediaService) {}
  ngOnInit() {
    console.log("Init")
    this.sub = this.mediaService.selectedMedia.subscribe({
      next: (media) => {
        this.selectedMedia = media
        console.log(this.selectedMedia)
      }
    })
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
  }
}
