import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, combineLatest, interval, switchMap } from 'rxjs';
import { EditConfigs, FilterSort, FilterType, Media, MediaType } from '../helpers/share';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { environmet } from '../helpers/environmet';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private mediaList$: BehaviorSubject<Media[] | null>
  private filter: BehaviorSubject<[FilterType, FilterSort]>
  private filteredList$: Observable<Media[] | null>
  private selectedMedia$: BehaviorSubject<Media | null>
  constructor(private http: HttpClient) {
    this.mediaList$ = new BehaviorSubject<Media[] | null>(null)
    this.getMedias()
    this.selectedMedia$ = new BehaviorSubject<Media | null>(null)
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

  public get selectedMedia(): Observable<Media | null> {
    return this.selectedMedia$.asObservable()
  }
  public set selectedMedia(media: Media) {
    this.selectedMedia$.next(media)
  }
  public get filteredMedia$(): Observable<Media[] | null> {
    return this.filteredList$
  }

  public applyFilter(filterT: FilterType, filterS: FilterSort) {
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

  public uploadMedia(file: File, name: string) {
    console.log(name)
    // const formData = {"name":name, "file":file, "originalname":file.name}
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    return this.http.post<any>(`${environmet.apiUrl}/upload`, formData, { withCredentials: true, reportProgress: true, observe: 'events' });
  }

  public checkMediaStatusOneTime(media: Media) {
    return this.http.get<any>(`${environmet.originalUrl}/${media.type}_${media.id}/status`, { withCredentials: true })
  }
  public checkMediaStatus(media: Media) {
    return interval(10000).pipe(
      switchMap(() => this.http.get<any>(`${environmet.originalUrl}/${media.type}_${media.id}/status`, { withCredentials: true })),

    )
  }

  public getEditPreview(frame_number: number) {
    const media = this.selectedMedia$.getValue()
    if (media == null)
      return null
    if (media.type === MediaType.Video)
      return `${environmet.originalUrl}/video-edit/${media.id}/${frame_number}/preview`
    return `${environmet.originalUrl}/image-edit/${media.id}/preview`
  }

  public getEditIds(frame_number: number) {
    const media = this.selectedMedia$.getValue()
    if (media == null)
      return null
    console.log(frame_number)
    if (media.type === MediaType.Video)
      return this.http.get<Array<number>>(`${environmet.originalUrl}/video-edit/${media.id}/${frame_number}/get-ids`, { withCredentials: true })
    return this.http.get<Array<number>>(`${environmet.originalUrl}/image-edit/${media.id}/get-ids`, { withCredentials: true })
  }

  public getEditFrames() {
    const media = this.selectedMedia$.getValue()
    if (media === null || media.type === MediaType.Image)
      return null
    return this.http.get<any>(`${environmet.originalUrl}/video-edit/${media.id}/get-frames`, { withCredentials: true })
  }

  public getEditCar(frame_number: number, car_id: number, settings: EditConfigs) {
    const media = this.selectedMedia$.getValue()
    console.log(settings)
    if (media === null)
      return null
    const formData = new FormData();
    formData.append('grayMode', settings.grayMode.toString());
    formData.append('thresholdMode', settings.thresholdMode.toString());
    formData.append('thresholdValue', settings.thresholdValue.toString());
    if (media.type === MediaType.Video) {
      let req = new HttpRequest('POST', `${environmet.originalUrl}/video-edit/${media.id}/${frame_number}/${car_id}`, formData, { responseType: 'blob', withCredentials: true})
      return this.http.request<Blob>(req).pipe(
        map(
          (res) => {
            switch (res.type) {
              case HttpEventType.Response:
                const blob = res.body
                if (blob != null)
                  return URL.createObjectURL(blob)
                return null
              default:
                return null
            }
          }
        )
      )
      }
    let req = new HttpRequest('POST', `${environmet.originalUrl}/image-edit/${media.id}/${car_id}`, formData, { responseType: 'blob', withCredentials: true})
    return this.http.request<Blob>(req).pipe(
      map(
        (res) => {
          switch (res.type) {
            case HttpEventType.Response:
              const blob = res.body
              if (blob != null)
                return URL.createObjectURL(blob)
              return null
            default:
              return null
          }
        }
      )
    )
  }

  public getPlateNumber(car_id: number) {
    const model = this.selectedMedia$.getValue()
    if (model === null)
      return null
    if (model.type === MediaType.Video)
      return this.http.get<any>(`${environmet.originalUrl}/video-edit/${model.id}/${car_id}/get-plate-number`, { withCredentials: true })
    return this.http.get<any>(`${environmet.originalUrl}/image-edit/${model.id}/${car_id}/get-plate-number`, { withCredentials: true })
  }
  public updateMedia(car_id: number, plate_number: string) {
    const media = this.selectedMedia$.getValue()
    if (media === null)
      return
    const formData = new FormData();
    formData.append('plate_number', plate_number);
    if (media.type === MediaType.Video)
      return this.http.post<any>(`${environmet.originalUrl}/video-edit/${media.id}/${car_id}/update`, formData, { withCredentials: true })
    return this.http.post<any>(`${environmet.originalUrl}/image-edit/${media.id}/${car_id}/update`, formData, { withCredentials: true })
    
  }
}
