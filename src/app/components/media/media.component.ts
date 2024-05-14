import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { Media } from '../../helpers/share';


@Component({
  selector: 'app-media',
  standalone: true,
  imports: [],
  templateUrl: './media.component.html',
  styleUrl: './media.component.css'
})
export class MediaComponent {
  @Input() media?:Media
  @Input() rowHeight: number = 1
  @Input() gutterSize: number = 1

  @ViewChild('img') img?: ElementRef

  public rows: number = 5

  @HostListener('window:resize')
  calculateRows() {
    this.rows = Math.floor(this.img?.nativeElement.offsetHeight / (this.rowHeight + this.gutterSize)) + 2;
    // console.log(this.rows)
  }

}
