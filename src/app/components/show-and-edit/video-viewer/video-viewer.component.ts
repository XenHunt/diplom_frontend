import { Component, Input, input, signal } from '@angular/core';
import { Media } from '../../../helpers/share';
import { Subscription } from 'rxjs';
import { environmet } from '../../../helpers/environmet';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-viewer',
  standalone: true,
  imports: [],
  templateUrl: './video-viewer.component.html',
  styleUrl: './video-viewer.component.css'
})
export class VideoViewerComponent {
  @Input() id = 8
  videoData:SafeResourceUrl
  path:SafeResourceUrl = signal("")
  sub!:Subscription
  constructor(private sanitizer:DomSanitizer) {
    this.videoData = this.sanitizer.bypassSecurityTrustResourceUrl(
      "data:video/mp4;base64,"
    )
    console.log("const")
  }

  ngOnInit() {
    this.path = this.sanitizer.bypassSecurityTrustResourceUrl(`${environmet.originalUrl}/video/${this.id}`)
    console.log("ngOnInit")
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  updateVideoPlayer() {
    // console.log("Updating")
    // const videoPlayer = document.getElementById('videoPlayer') as HTMLVideoElement
    // videoPlayer.src = btoa(this.videoData)
  }
  decodeChunk(data:string):SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl('data:video/mp4;base64,' + data)
   }
}
