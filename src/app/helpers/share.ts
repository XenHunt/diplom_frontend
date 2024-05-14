export enum MediaType {
  Video = 'Video',
  Image = 'Image',
}

export enum Filter {
  All= "All",
  Video = "Video",
  Image = "Image"
}

export interface Media {
  id: number
  name: string
  previewUrl: string
  type: MediaType
}
