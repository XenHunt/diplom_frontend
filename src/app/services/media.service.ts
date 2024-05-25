import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, combineLatest, interval, switchMap } from 'rxjs';
import { FilterSort, FilterType, Media, MediaType } from '../helpers/share';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environmet } from '../helpers/environmet';

@Injectable({
  providedIn: 'root'
})
export class MediaService {


  private mediaList$: BehaviorSubject<Media[]|null>
  private filter:BehaviorSubject<[FilterType, FilterSort]>
  private filteredList$:Observable<Media[]|null>
  private selectedMedia$: BehaviorSubject<Media|null>
  constructor(private http: HttpClient)
  {
    this.mediaList$ = new BehaviorSubject<Media[]|null>(null)
    this.getMedias()
    this.selectedMedia$ = new BehaviorSubject<Media|null>(null)
    this.filter = new BehaviorSubject<[FilterType, FilterSort]>([FilterType.All, FilterSort.NameAscended])
    this.filteredList$ = combineLatest([this.mediaList$, this.filter]).pipe(
      map(([mediaList, filter]) => {
        if (!mediaList) {
          return null;
        }

        console.log(filter)

        if (filter[0] === FilterType.Video) {
          mediaList = mediaList.filter((media) => media.type === MediaType.Video)
        }
        if (filter[0] === FilterType.Image) {
          mediaList = mediaList.filter((media) => media.type === MediaType.Image)
        }


        if (filter[1] === FilterSort.NameAscended) {
          mediaList = mediaList.sort((a, b) => a.name.localeCompare(b.name))
        }
        if (filter[1] === FilterSort.NameDescended) {
          mediaList = mediaList.sort((a, b) => b.name.localeCompare(a.name))
        }
        if (filter[1] === FilterSort.DateUploadAscended) {
          mediaList = mediaList.sort((a, b) => new Date(a.dateUploaded).getTime() - new Date(b.dateUploaded).getTime())
        }
        if (filter[1] === FilterSort.DateUploadDescended) {
          mediaList = mediaList.sort((a, b) => new Date(b.dateUploaded).getTime() - new Date(a.dateUploaded).getTime())
        }
        if (filter[1] === FilterSort.DateUpdateAscended) {
          mediaList = mediaList.sort((a, b) => new Date(a.dateUpdated).getTime() - new Date(b.dateUpdated).getTime())
        }
        if (filter[1] === FilterSort.DateUpdateDescended) {
          mediaList = mediaList.sort((a, b) => new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime())
        }
        return mediaList
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

  public applyFilter(filterT:FilterType, filterS:FilterSort) {
    this.filter.next([filterT, filterS])
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

  public uploadMedia(file:File, name:string) {
    console.log(name)
    // const formData = {"name":name, "file":file, "originalname":file.name}
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    return this.http.post<any>(`${environmet.apiUrl}/upload`, formData, {withCredentials: true, reportProgress: true, observe: 'events'});
  }

  public checkMediaStatusOneTime(media:Media) {
    return this.http.get<any>(`${environmet.originalUrl}/${media.type}_${media.id}/status`, {withCredentials: true})
  }
  public checkMediaStatus(media:Media) {
    return interval(10000).pipe(
      switchMap(() => this.http.get<any>(`${environmet.originalUrl}/${media.type}_${media.id}/status`, {withCredentials: true})),

    )
  }
}
