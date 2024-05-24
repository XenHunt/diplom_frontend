import { Component, OnDestroy, OnInit } from '@angular/core';
import { Media, MediaType } from '../../helpers/share';
import { Router } from '@angular/router';
import { MediaService } from '../../services/media.service';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { Subscription } from 'rxjs';
import { NgFor, NgForOf, NgIf } from '@angular/common';
import {MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { environmet } from '../../helpers/environmet';


@Component({
  selector: 'app-media-viewer',
  standalone: true,
  imports: [MatGridList, MatGridTile, NgFor, NgForOf, NgIf, MatCardModule, MatButtonModule],
  templateUrl: './media-viewer.component.html',
  styleUrl: './media-viewer.component.css'
})
export class MediaViewerComponent implements OnInit, OnDestroy{

  // medias?:Media[]|null
  medias?:Media[]|null
  apiUrl = environmet.originalUrl
  mediaWatcher?:Subscription
  constructor(private mediaService: MediaService, private router:Router) {

  }
  ngOnInit() {
    this.mediaWatcher = this.mediaService.filteredMedia$.subscribe((medias) => {
      this.medias = medias
      if (medias != null)
      // Нужно вывести apiUrl + media.previewUrl 
        for (let media of medias)
          console.log(this.apiUrl + media.previewUrl)          
      console.log(medias)
    })
  }

  ngOnDestroy(): void {
    this.mediaWatcher?.unsubscribe();
  }
  selectMedia(_t4: Media) {
  this.mediaService.selectedMedia = _t4
  this.router.navigate(['/edit'])
  }

  getPreview(media: Media) {}
    
}
