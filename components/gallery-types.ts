import { isGalleryImageMedia, isGalleryVideoMedia } from "@/lib/gallery-media"

export type GalleryPhoto = {
  url: string
  pathname: string
  uploadedAt: string
  contentType: string
}

export function isGalleryVideo(item: Pick<GalleryPhoto, "contentType" | "pathname">) {
  return isGalleryVideoMedia(item.pathname, item.contentType)
}

export function isGalleryImage(item: Pick<GalleryPhoto, "contentType" | "pathname">) {
  return isGalleryImageMedia(item.pathname, item.contentType)
}
