import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { Media, MediaType } from '../../helpers/share';
import { MediaService } from '../../services/media.service';
import { VideoViewerComponent } from './video-viewer/video-viewer.component';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { Subscription, single } from 'rxjs';
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
  path = signal("")
  id = signal(-1)
  sub?:Subscription
  status_sub?:Subscription | null = null
  status = signal("Waiting...")
  constructor(private mediaService: MediaService) {}
  ngOnInit() {
    console.log("Init")
    this.sub = this.mediaService.selectedMedia.subscribe({
      next: (media) => {
        this.selectedMedia = media
        if (this.selectedMedia != null) {
          this.mediaService.checkMediaStatusOneTime(this.selectedMedia).subscribe({
            next: (status) => {
              if (status.status === "Done"){
                console.log("Done")
                if (this.selectedMedia?.type === this.image)
                  this.path.set(`${environmet.originalUrl}/image/${this.selectedMedia!.id}`)
                else
                  this.id.set(this.selectedMedia!.id)
              }
              this.status.set(status.status)
              console.log(status);
                
            }
          })
        if (this.status_sub != null) {
          this.status_sub?.unsubscribe()
        }
          this.status_sub = this.mediaService.checkMediaStatus(this.selectedMedia!).subscribe({
            next: (status) => {
              if (status.status === "Done")
                this.path.set(`${environmet.originalUrl}/image/${this.selectedMedia!.id}`)
              this.status.set(status.status)
              console.log(status);
                
            }
          })
        }
        }
      }
    )
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
    if (this.status_sub != null)
      this.status_sub?.unsubscribe()
  }
}
