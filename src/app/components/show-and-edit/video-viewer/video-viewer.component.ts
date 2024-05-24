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
  // videoData:SafeResourceUrl
  @Input() src!:string
  sub!:Subscription
  constructor() {
    console.log(this.src)
  }

  ngOnInit() {

  }

  ngOnDestroy() {
  }

  updateVideoPlayer() {
    // console.log("Updating")
    // const videoPlayer = document.getElementById('videoPlayer') as HTMLVideoElement
    // videoPlayer.src = btoa(this.videoData)
  }
}
