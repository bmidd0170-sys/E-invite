import { del, get, list, put } from "@vercel/blob"
import { NextRequest, NextResponse } from "next/server"

const GALLERY_PREFIX = "gallery/"
const GALLERY_ORDER_PATHNAME = `${GALLERY_PREFIX}order.json`

function getBlobConfigError() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return "BLOB_READ_WRITE_TOKEN is not configured. Add it to your environment to enable gallery uploads.";
  }

  return null;
}

async function readGalleryOrder(blobs: Awaited<ReturnType<typeof list>>["blobs"]) {
  const orderBlob = blobs.find((blob) => blob.pathname === GALLERY_ORDER_PATHNAME)

  if (!orderBlob) {
    return [] as string[]
  }

  const response = await get(orderBlob.pathname, {
    access: "private",
    useCache: false,
  })

  if (!response || response.statusCode !== 200 || !response.stream) {
    return [] as string[]
  }

  const orderText = await new Response(response.stream).text()

  try {
    const data = JSON.parse(orderText)
    return Array.isArray(data) ? data.filter((pathname) => typeof pathname === "string") : []
  } catch {
    return [] as string[]
  }
}

function toImageProxyUrl(pathname: string) {
  return `/api/gallery/image?pathname=${encodeURIComponent(pathname)}`
}

function sortGalleryImages(blobs: Awaited<ReturnType<typeof list>>["blobs"], order: string[]) {
  const images = blobs.filter((blob) => blob.pathname !== GALLERY_ORDER_PATHNAME)

  if (order.length === 0) {
    return images.sort((left, right) => {
      const leftTime = new Date(left.uploadedAt).getTime()
      const rightTime = new Date(right.uploadedAt).getTime()
      return rightTime - leftTime
    })
  }

  const orderMap = new Map(order.map((pathname, index) => [pathname, index]))

  return images.sort((left, right) => {
    const leftIndex = orderMap.get(left.pathname)
    const rightIndex = orderMap.get(right.pathname)

    if (leftIndex == null && rightIndex == null) {
      return new Date(right.uploadedAt).getTime() - new Date(left.uploadedAt).getTime()
    }

    if (leftIndex == null) {
      return 1
    }

    if (rightIndex == null) {
      return -1
    }

    return leftIndex - rightIndex
  })
}

async function saveGalleryOrder(order: string[]) {
  await put(GALLERY_ORDER_PATHNAME, JSON.stringify(order), {
    access: "private",
    contentType: "application/json",
    allowOverwrite: true,
  })
}

export async function GET() {
  try {
    const configError = getBlobConfigError()
    if (configError) {
      return NextResponse.json({ error: configError }, { status: 500 })
    }

    const { blobs } = await list({ prefix: GALLERY_PREFIX })
    const order = await readGalleryOrder(blobs)
    const images = sortGalleryImages(blobs, order)

    return NextResponse.json({
      images: images.map((blob) => ({
        url: toImageProxyUrl(blob.pathname),
        pathname: blob.pathname,
        uploadedAt: blob.uploadedAt,
      })),
    })
  } catch (error) {
    console.error("Error loading gallery images:", error)
    return NextResponse.json({ error: "Failed to load gallery images" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const configError = getBlobConfigError()
    if (configError) {
      return NextResponse.json({ error: configError }, { status: 500 })
    }

    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
    }

    const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-")
    const pathname = `${GALLERY_PREFIX}${Date.now()}-${originalName || "upload"}`
    const blob = await put(pathname, file, { access: "private" })
    const { blobs } = await list({ prefix: GALLERY_PREFIX })
    const existingOrder = await readGalleryOrder(blobs)
    const nextOrder = [pathname, ...existingOrder.filter((item) => item !== pathname)]

    await saveGalleryOrder(nextOrder)

    return NextResponse.json({
      message: "Image uploaded successfully",
      image: {
        url: toImageProxyUrl(blob.pathname),
        pathname: blob.pathname,
        uploadedAt: blob.uploadedAt ?? new Date(),
      },
    })
  } catch (error) {
    console.error("Error uploading gallery image:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const configError = getBlobConfigError()
    if (configError) {
      return NextResponse.json({ error: configError }, { status: 500 })
    }

    const body = await request.json()
    if (!Array.isArray(body?.order)) {
      return NextResponse.json({ error: "Order array is required" }, { status: 400 })
    }

    const order = body.order.filter((item: unknown) => typeof item === "string")

    await saveGalleryOrder(order)

    return NextResponse.json({ message: "Gallery order saved successfully" })
  } catch (error) {
    console.error("Error saving gallery order:", error)
    return NextResponse.json({ error: "Failed to save gallery order" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const configError = getBlobConfigError()
    if (configError) {
      return NextResponse.json({ error: configError }, { status: 500 })
    }

    const body = await request.json()
    if (!Array.isArray(body?.pathnames)) {
      return NextResponse.json({ error: "pathnames array is required" }, { status: 400 })
    }

    const pathnames = body.pathnames.filter((item: unknown) => typeof item === "string")

    if (pathnames.length === 0) {
      return NextResponse.json({ error: "Select at least one image to delete" }, { status: 400 })
    }

    const validPathnames = pathnames.filter(
      (pathname: string) => pathname.startsWith(GALLERY_PREFIX) && pathname !== GALLERY_ORDER_PATHNAME,
    )

    if (validPathnames.length === 0) {
      return NextResponse.json({ error: "No valid gallery images were selected" }, { status: 400 })
    }

    await del(validPathnames)

    const { blobs } = await list({ prefix: GALLERY_PREFIX })
    const currentOrder = await readGalleryOrder(blobs)
    const deletedSet = new Set(validPathnames)
    const nextOrder = currentOrder.filter((pathname) => !deletedSet.has(pathname))

    await saveGalleryOrder(nextOrder)

    return NextResponse.json({
      message: "Selected images deleted successfully",
      deletedPathnames: validPathnames,
    })
  } catch (error) {
    console.error("Error deleting gallery images:", error)
    return NextResponse.json({ error: "Failed to delete selected images" }, { status: 500 })
  }
}