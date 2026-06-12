import { get } from "@vercel/blob"
import { NextRequest, NextResponse } from "next/server"

const GALLERY_PREFIX = "gallery/"
const GALLERY_ORDER_PATHNAME = `${GALLERY_PREFIX}order.json`

function getBlobConfigError() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return "BLOB_READ_WRITE_TOKEN is not configured. Add it to your environment to enable gallery uploads."
  }

  return null
}

export async function GET(request: NextRequest) {
  try {
    const configError = getBlobConfigError()
    if (configError) {
      return NextResponse.json({ error: configError }, { status: 500 })
    }

    const pathname = request.nextUrl.searchParams.get("pathname")

    if (!pathname) {
      return NextResponse.json({ error: "pathname is required" }, { status: 400 })
    }

    if (!pathname.startsWith(GALLERY_PREFIX) || pathname === GALLERY_ORDER_PATHNAME) {
      return NextResponse.json({ error: "Invalid gallery pathname" }, { status: 400 })
    }

    const blob = await get(pathname, {
      access: "private",
      useCache: true,
    })

    if (!blob || blob.statusCode !== 200 || !blob.stream) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    return new NextResponse(blob.stream, {
      headers: {
        "Content-Type": blob.blob.contentType,
        "Cache-Control": blob.blob.cacheControl,
        ETag: blob.blob.etag,
      },
    })
  } catch (error) {
    console.error("Error loading private gallery image:", error)
    return NextResponse.json({ error: "Failed to load gallery image" }, { status: 500 })
  }
}