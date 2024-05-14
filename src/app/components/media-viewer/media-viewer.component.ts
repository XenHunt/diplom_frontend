import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Media, MediaType } from '../../helpers/share';
import { Route, Router } from '@angular/router';
import { MediaService } from '../../services/media.service';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { Subscription } from 'rxjs';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MediaComponent } from '../media/media.component';
import { NgFor, NgForOf } from '@angular/common';


@Component({
  selector: 'app-media-viewer',
  standalone: true,
  imports: [MatGridList, MatGridTile, MediaComponent, NgFor, NgForOf],
  templateUrl: './media-viewer.component.html',
  styleUrl: './media-viewer.component.css'
})
export class MediaViewerComponent implements OnInit, OnDestroy{
  // medias?:Media[]|null
  medias?:Media[] = [{
    id: 1,
    name: 'test',
    previewUrl: 'assets/1908avatar.jpeg',
    type: MediaType.Image
  },
  {
    id: 2,
    name: 'test',
    previewUrl: 'favicon.ico',
    type: MediaType.Image
  },
  {
  id: 1,
  name: 'test',
  previewUrl: 'assets/1908avatar.jpeg',
  type: MediaType.Image
},
{
  id: 2,
  name: 'test',
  previewUrl: 'favicon.ico',
  type: MediaType.Image
},
{
id: 1,
name: 'test',
previewUrl: 'assets/1908avatar.jpeg',
type: MediaType.Image
},
{
id: 2,
name: 'test',
previewUrl: 'favicon.ico',
type: MediaType.Image
}
  
  ]
  @Input() cols: number = 4
  @Input('cols.xs') cols_xs: number = 2;
  @Input('cols.sm') cols_sm: number = 4;
  @Input('cols.md') cols_md: number = 6;
  @Input('cols.lg') cols_lg: number = 8;
  @Input('cols.xl') cols_xl: number = 10;
  @Input() rowHeight: number =20
  @Input() gutterSize: number = 3

  mediaWatcher?:Subscription
  constructor(private media: MediaObserver, private mediaService: MediaService) {}
  ngOnInit() {
    this.mediaWatcher = this.media.asObservable().subscribe((changes: MediaChange[]) => {
      let alias = changes[0].mqAlias.replace("lt-", "").replace("gt-", "");
        this.cols = (this as any)[`cols_${alias}`] || this.cols;
      
    });
  }

  ngOnDestroy(): void {
    this.mediaWatcher?.unsubscribe();
  }
}
