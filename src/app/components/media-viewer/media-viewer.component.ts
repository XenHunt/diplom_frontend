import { Component, OnDestroy, OnInit } from '@angular/core';
import { Media, MediaType, FilterSort, FilterType } from '../../helpers/share';
import { Router } from '@angular/router';
import { MediaService } from '../../services/media.service';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { Subscription } from 'rxjs';
import { DatePipe, NgFor, NgForOf, NgIf } from '@angular/common';
import {MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { environmet } from '../../helpers/environmet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-media-viewer',
  standalone: true,
  imports: [MatGridList, MatGridTile, NgFor, NgForOf, NgIf, MatCardModule, MatButtonModule, MatFormFieldModule, MatSelectModule, DatePipe],
  templateUrl: './media-viewer.component.html',
  styleUrl: './media-viewer.component.css'
})
export class MediaViewerComponent implements OnInit, OnDestroy{

  // medias?:Media[]|null
  medias?:Media[]|null
  apiUrl = environmet.originalUrl
  mediaWatcher?:Subscription
  filtersort:FilterSort = FilterSort.NameAscended
  filtertype:FilterType = FilterType.All

  Allsort = [
    {
      name: 'По имени (по возрастанию)',
      value: FilterSort.NameAscended
    }
    ,
    {
      name: 'По имени (по убыванию)',
      value: FilterSort.NameDescended
    }
    ,
    {
      name: 'По дате загрузки (по возрастанию)',
      value: FilterSort.DateUploadAscended
    }
    ,
    {
      name: 'По дате загрузки (по убыванию)',
      value: FilterSort.DateUploadDescended
    }
    ,
    {
      name: 'По дате обновления (по возрастанию)',
      value: FilterSort.DateUpdateAscended
    }
    ,
    {
      name: 'По дате обновления (по убыванию)',
      value: FilterSort.DateUpdateDescended
    }
  ]

  Alltype = [
    {
      name: 'Все',
      value: FilterType.All
    }
    ,
    {
      name: 'Изображения',
      value: FilterType.Image
    }
    ,
    {
      name: 'Видео',
      value: FilterType.Video
    }
  ]

  constructor(private mediaService: MediaService, private router:Router) {  }
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
    

  applyNewFilters() { 
    // console.log(this.filtertype)
    // console.log(this.filtersort)
    this.mediaService.applyFilter(this.filtertype, this.filtersort)
  }




}
