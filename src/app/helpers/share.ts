export enum MediaType {
  Video = 'Video',
  Image = 'Image',
}

export enum FilterType {
  All= "All",
  Video = "Video",
  Image = "Image"
}

export enum FilterSort {
  NameAscended = "nameasc",
  NameDescended = "namedesc",
  DateUploadAscended = "dateupasc",
  DateUploadDescended = "dateupdesc",
  DateUpdateAscended = "dateupdasc",
  DateUpdateDescended = "dateupddesc",
}

export interface EditConfigs {
  grayMode: boolean
  thresholdMode: boolean
  thresholdValue: number
}

export interface Media {
  id: number
  name: string
  dateUploaded: Date
  dateUpdated: Date
  previewUrl: string
  contentUrl: string
  type: MediaType
}
