import { Component, OnDestroy, OnInit } from '@angular/core';
import { Media, MediaType } from '../../helpers/share';
import { Router } from '@angular/router';
import { MediaService } from '../../services/media.service';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { Subscription } from 'rxjs';
import { MediaComponent } from '../media/media.component';
import { NgFor, NgForOf } from '@angular/common';
import {MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-media-viewer',
  standalone: true,
  imports: [MatGridList, MatGridTile, MediaComponent, NgFor, NgForOf, MatCardModule, MatButtonModule],
  templateUrl: './media-viewer.component.html',
  styleUrl: './media-viewer.component.css'
})
export class MediaViewerComponent implements OnInit, OnDestroy{

  // medias?:Media[]|null
  medias?:Media[] = []

  mediaWatcher?:Subscription
  constructor(private mediaService: MediaService, private router:Router) {
    const images = ['assets/1908avatar.jpeg', 'favicon.ico']

    // Сделаем medias длинною 100 элементов
    for (let i = 0; i < 100; i++) {
      this.medias?.push({ id: i, type: MediaType.Image, name: "test", previewUrl: images[i%2] })
    }

  }
  ngOnInit() {

  }

  ngOnDestroy(): void {
    this.mediaWatcher?.unsubscribe();
  }
  selectMedia(_t4: Media) {
  this.mediaService.selectedMedia = _t4
  this.router.navigate(['/edit'])
  }
}
