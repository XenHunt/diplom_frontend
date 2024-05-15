import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { Media } from '../../helpers/share';
import { MediaService } from '../../services/media.service';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardImage, MatCardTitle } from '@angular/material/card';


@Component({
  selector: 'app-media',
  standalone: true,
  imports: [MatCard, MatCardImage, MatCardTitle],
  templateUrl: './media.component.html',
  styleUrl: './media.component.css'
})
export class MediaComponent {
  @Input() media!:Media
  @Input() rowHeight: number = 1
  @Input() gutterSize: number = 1

  @ViewChild('img') img?: ElementRef

  public rows: number = 5

  constructor(private mediaService: MediaService, private router: Router) {}

  @HostListener('window:resize')
  calculateRows() {
    this.rows = Math.floor(this.img?.nativeElement.offsetHeight / (this.rowHeight + this.gutterSize));
    //console.log(this.rows)
  }

  onClick() {
    this.mediaService.selectedMedia = this.media
    this.router.navigate(['/edit'])
  }

}
