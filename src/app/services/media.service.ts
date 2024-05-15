import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, combineLatest } from 'rxjs';
import { Filter, Media, MediaType } from '../helpers/share';
import { HttpClient } from '@angular/common/http';
import { environmet } from '../helpers/environmet';

@Injectable({
  providedIn: 'root'
})
export class MediaService {


  private mediaList$: BehaviorSubject<Media[]|null>
  private filter:BehaviorSubject<Filter>
  private filteredList$:Observable<Media[]|null>
  private selectedMedia$: BehaviorSubject<Media|null>
  constructor(private http: HttpClient)
  {
    this.mediaList$ = new BehaviorSubject<Media[]|null>(null)
    //this.getMedias()
    this.selectedMedia$ = new BehaviorSubject<Media|null>(null)
    this.filter = new BehaviorSubject<Filter>(Filter.All)
    this.filteredList$ = combineLatest([this.mediaList$, this.filter]).pipe(
      map(([mediaList, filter]) => {
        if (!mediaList) {
          return null;
        }

        if (filter === Filter.All) {
          return mediaList;
        } else if (filter === Filter.Video) {
          return mediaList.filter((m) => m.type === MediaType.Video);
        } else {
          return mediaList.filter((m) => m.type === MediaType.Image);
        }
      })
    )

    this.mediaList$.subscribe(() => {
     this.filter.next(this.filter.getValue())
    }
    )
  }

  public get selectedMedia():Observable<Media|null> {
    return this.selectedMedia$.asObservable()
  }
  public set selectedMedia(media:Media) {
    this.selectedMedia$.next(media)
  }
  public get filteredMedia$():Observable<Media[]|null> {
    return this.filteredList$
    }

  public applyFilter(filter:Filter) {
    this.filter.next(filter)
  }
  private getMedias() {
    this.http.get<Media[]>(`${environmet.apiUrl}/all_media`).pipe(
      map((medias) => Array.from(medias))
    ).subscribe({

      next: (medias) => {
        this.mediaList$.next(medias)
      },

      error: (err) => {
        console.log(err)
      }
    }

    )
  }


}
