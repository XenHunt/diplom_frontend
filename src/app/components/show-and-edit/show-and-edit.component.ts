import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { Media, MediaType } from '../../helpers/share';
import { MediaService } from '../../services/media.service';
import { VideoViewerComponent } from './video-viewer/video-viewer.component';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { Subscription, single } from 'rxjs';


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
  path = signal("")
  sub?:Subscription
  status_sub?:Subscription | null = null
  status = signal("Waiting...")
  constructor(private mediaService: MediaService) {}
  ngOnInit() {
    console.log("Init")
    this.sub = this.mediaService.selectedMedia.subscribe({
      next: (media) => {
        this.selectedMedia = media
        if (this.status_sub != null)
          this.status_sub?.unsubscribe()
        if (media != null)
          {
            this.mediaService.checkMediaStatusOneTime(media).subscribe({
              next: (status) => {
                this.status.set(status.status)
                console.log(status)
              }
            })
            this.status_sub = this.mediaService.checkMediaStatus(media).subscribe({
              next: (status) => {
                this.status.set(status.status)
                console.log(status)
              }
            })
            if (media.type === MediaType.Video)
              this.path.set("http://127.0.0.1:5000/video/"+media.id)
            else
              this.path.set("http://127.0.0.1:5000/image/"+media.id)
          }
          else
          {
            this.status_sub = null
          }
            }
          })
        }

  ngOnDestroy() {
    this.sub?.unsubscribe()
    if (this.status_sub != null)
      this.status_sub?.unsubscribe()
  }
}
