const GENERIC_CONTENT_TYPES = new Set(["application/octet-stream", "binary/octet-stream"])

const VIDEO_EXTENSIONS = new Set(["mp4", "webm", "mov", "m4v", "avi"])
const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif"])

function getPathExtension(pathname: string) {
  return pathname.split(".").pop()?.toLowerCase() ?? ""
}

function contentTypeFromExtension(extension: string) {
  switch (extension) {
    case "mp4":
    case "m4v":
      return "video/mp4"
    case "webm":
      return "video/webm"
    case "mov":
      return "video/quicktime"
    case "avi":
      return "video/x-msvideo"
    case "png":
      return "image/png"
    case "webp":
      return "image/webp"
    case "gif":
      return "image/gif"
    case "avif":
      return "image/avif"
    case "jpg":
    case "jpeg":
      return "image/jpeg"
    default:
      return null
  }
}

export function isVideoPathname(pathname: string) {
  return VIDEO_EXTENSIONS.has(getPathExtension(pathname))
}

export function isImagePathname(pathname: string) {
  return IMAGE_EXTENSIONS.has(getPathExtension(pathname))
}

export function resolveGalleryContentType(pathname: string, contentType?: string | null) {
  const normalized = contentType?.trim().toLowerCase()

  if (normalized && !GENERIC_CONTENT_TYPES.has(normalized)) {
    return contentType!.trim()
  }

  const fromExtension = contentTypeFromExtension(getPathExtension(pathname))

  if (fromExtension) {
    return fromExtension
  }

  return normalized || "application/octet-stream"
}

export function isGalleryVideoMedia(pathname: string, contentType: string) {
  return contentType.startsWith("video/") || isVideoPathname(pathname)
}

export function isGalleryImageMedia(pathname: string, contentType: string) {
  return contentType.startsWith("image/") || isImagePathname(pathname)
}
