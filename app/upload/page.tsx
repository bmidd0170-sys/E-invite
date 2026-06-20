"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowDown, ArrowLeft, ArrowUp, Check, CheckCircle2, GripVertical, ImagePlus, Loader2, Play, Trash2, UploadCloud, X } from "lucide-react"
import type { GalleryPhoto } from "@/components/gallery-types"
import { isGalleryVideo } from "@/components/gallery-types"

type PendingUpload = {
  id: string
  file: File
  previewUrl: string
}

export default function UploadPage() {
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isSavingOrder, setIsSavingOrder] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [gallery, setGallery] = useState<GalleryPhoto[]>([])
  const [selectedPathnames, setSelectedPathnames] = useState<string[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const previewUrlsRef = useRef<string[]>([])

  useEffect(() => {
    previewUrlsRef.current = pendingUploads.map((item) => item.previewUrl)
  }, [pendingUploads])

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((previewUrl) => URL.revokeObjectURL(previewUrl))
    }
  }, [])

  useEffect(() => {
    async function loadGallery() {
      try {
        const response = await fetch("/api/gallery", { cache: "no-store" })
        if (!response.ok) {
          const data = await response.json().catch(() => null)
          throw new Error(data?.error || "Failed to load gallery")
        }

        const data = await response.json()
        setGallery(Array.isArray(data.images) ? data.images : [])
        setSelectedPathnames([])
      } catch (loadError) {
        setError((loadError as Error).message || "Failed to load gallery")
      }
    }

    loadGallery()
  }, [])

  const selectedFileLabel = useMemo(() => {
    if (pendingUploads.length === 0) {
      return "No file selected"
    }

    if (pendingUploads.length === 1) {
      const file = pendingUploads[0].file
      return `${file.name} • ${(file.size / 1024 / 1024).toFixed(2)} MB`
    }

    return `${pendingUploads.length} files selected`
  }, [pendingUploads])

  const selectedFileNames = useMemo(() => pendingUploads.map((item) => item.file.name), [pendingUploads])

  const selectedImages = useMemo(
    () => gallery.filter((image) => selectedPathnames.includes(image.pathname)),
    [gallery, selectedPathnames],
  )

  async function saveOrder(nextGallery: GalleryPhoto[], previousGallery?: GalleryPhoto[]) {
    setIsSavingOrder(true)

    try {
      const response = await fetch("/api/gallery", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order: nextGallery.map((image) => image.pathname) }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save order")
      }

      setMessage("Gallery order saved.")
      return true
    } catch (orderError) {
      if (previousGallery) {
        setGallery(previousGallery)
      }
      setError((orderError as Error).message || "Failed to save order")
      return false
    } finally {
      setIsSavingOrder(false)
    }
  }

  async function moveImage(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= gallery.length) {
      return
    }

    const nextGallery = [...gallery]
    const [movedImage] = nextGallery.splice(index, 1)
    nextGallery.splice(targetIndex, 0, movedImage)

    const previousGallery = gallery
    setGallery(nextGallery)
    await saveOrder(nextGallery, previousGallery)
  }

  async function moveImageByDrag(sourceIndex: number, targetIndex: number) {
    if (sourceIndex === targetIndex || sourceIndex < 0 || targetIndex < 0 || sourceIndex >= gallery.length || targetIndex >= gallery.length) {
      return
    }

    const nextGallery = [...gallery]
    const [movedImage] = nextGallery.splice(sourceIndex, 1)
    nextGallery.splice(targetIndex, 0, movedImage)

    const previousGallery = gallery
    setGallery(nextGallery)
    await saveOrder(nextGallery, previousGallery)
  }

  function handleDragStart(index: number) {
    if (isSavingOrder || isDeleting) {
      return
    }

    setDraggedIndex(index)
    setDragOverIndex(index)
  }

  function handleDragOver(event: React.DragEvent<HTMLElement>, index: number) {
    event.preventDefault()
    if (draggedIndex == null || draggedIndex === index) {
      return
    }

    setDragOverIndex(index)
  }

  async function handleDrop(index: number) {
    if (draggedIndex == null) {
      return
    }

    await moveImageByDrag(draggedIndex, index)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  function handleDragEnd() {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  function toggleSelected(pathname: string) {
    setSelectedPathnames((current) =>
      current.includes(pathname) ? current.filter((item) => item !== pathname) : [...current, pathname],
    )
  }

  function toggleSelectAll() {
    setSelectedPathnames((current) => (current.length === gallery.length ? [] : gallery.map((image) => image.pathname)))
  }

  async function confirmDeleteSelected() {
    if (selectedPathnames.length === 0) {
      return
    }

    try {
      setIsDeleting(true)
      setMessage(null)
      setError(null)

      const response = await fetch("/api/gallery", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pathnames: selectedPathnames }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete selected images")
      }

      const deletedPathnames = Array.isArray(data.deletedPathnames) ? data.deletedPathnames : selectedPathnames
      const deletedSet = new Set(deletedPathnames)

      setGallery((current) => current.filter((image) => !deletedSet.has(image.pathname)))
      setSelectedPathnames([])
      setIsDeleteModalOpen(false)
      setMessage("Selected images were deleted.")
    } catch (deleteError) {
      setError((deleteError as Error).message || "Failed to delete selected images")
    } finally {
      setIsDeleting(false)
    }
  }

  function getFileKey(file: File) {
    return `${file.name}-${file.size}-${file.lastModified}`
  }

  function clearPendingUploads(items: PendingUpload[]) {
    items.forEach((item) => URL.revokeObjectURL(item.previewUrl))
    setPendingUploads([])
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const pickedFiles = Array.from(event.target.files ?? [])
    event.target.value = ""

    if (pickedFiles.length === 0) {
      return
    }

    setMessage(null)
    setError(null)

    setPendingUploads((currentUploads) => {
      const existingKeys = new Set(currentUploads.map((item) => item.id))
      const newUploads = pickedFiles
        .filter((file) => !existingKeys.has(getFileKey(file)))
        .map((file) => ({
          id: getFileKey(file),
          file,
          previewUrl: URL.createObjectURL(file),
        }))

      if (newUploads.length === 0) {
        return currentUploads
      }

      return [...currentUploads, ...newUploads]
    })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget

    if (pendingUploads.length === 0) {
      setError("Choose one or more photos or videos to upload first.")
      return
    }

    try {
      setIsUploading(true)
      setMessage(null)
      setError(null)

      const nextGalleryItems: GalleryPhoto[] = []
      const uploadsToSend = [...pendingUploads]

      for (const { file } of [...uploadsToSend].reverse()) {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/gallery", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || `Upload failed for ${file.name}`)
        }

        nextGalleryItems.push(data.image)
        setGallery((currentGallery) => [data.image, ...currentGallery])
      }

      setMessage(`Uploaded ${uploadsToSend.length} file${uploadsToSend.length === 1 ? "" : "s"} to Blob and added to the gallery.`)
      clearPendingUploads(uploadsToSend)
      form.reset()
    } catch (uploadError) {
      setError((uploadError as Error).message || "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="w-full h-1" style={{ background: "linear-gradient(to right, #0a0a0a, #C41E3A, #8B0000, #C41E3A, #0a0a0a)" }} />

      <div className="px-4 md:px-6 py-10 md:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex justify-start">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/50 px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to invite
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="overflow-hidden rounded-2xl border border-border bg-secondary/50 shadow-2xl shadow-black/30">
              <div className="border-b border-border px-6 py-5 md:px-8">
                <p className="text-xs uppercase tracking-[0.25em] text-[#C41E3A]">Gallery Upload</p>
                <h1 className="mt-2 font-serif text-3xl md:text-5xl text-foreground">Add new celebration media</h1>
                <p className="mt-3 max-w-2xl text-sm md:text-base text-muted-foreground">
                  Upload photos and videos here, then they will be displayed in the gallery on the invitation page.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6 md:px-8 md:py-8">
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#C41E3A]/45 bg-background/35 px-6 py-10 text-center transition-colors hover:border-[#C41E3A] hover:bg-background/50">
                  <UploadCloud className="h-10 w-10 text-[#C41E3A]" />
                  <span className="mt-4 font-serif text-2xl text-foreground">Choose photos or videos</span>
                  <span className="mt-2 text-sm text-muted-foreground">
                    JPEG, PNG, WebP, GIF, MP4, WebM, or MOV. You can choose multiple files.
                  </span>
                  <span className="mt-4 rounded-full border border-border bg-secondary px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {selectedFileLabel}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>

                <button
                  type="submit"
                  disabled={isUploading || pendingUploads.length === 0}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#C41E3A] bg-[#C41E3A] px-6 py-3 font-serif text-lg font-semibold text-white transition-all duration-300 hover:bg-[#A01830] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
                  {isUploading ? "Uploading..." : pendingUploads.length > 1 ? "Upload Files to Gallery" : "Upload to Gallery"}
                </button>

                {pendingUploads.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {pendingUploads.map((item, index) => {
                      const isVideo = item.file.type.startsWith("video/")

                      return (
                        <div key={item.id} className="overflow-hidden rounded-2xl border border-[#C41E3A]/70 bg-background">
                          {isVideo ? (
                            <video src={item.previewUrl} controls muted playsInline className="h-44 w-full object-cover" />
                          ) : (
                            <img src={item.previewUrl} alt={`Selected preview ${index + 1}`} className="h-44 w-full object-cover" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {selectedFileNames.length > 1 && (
                  <div className="rounded-xl border border-border bg-background/40 px-4 py-3 text-xs text-muted-foreground">
                    {selectedFileNames.map((name) => (
                      <div key={name} className="truncate">
                        {name}
                      </div>
                    ))}
                  </div>
                )}

                {message && (
                  <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                    {message}
                  </div>
                )}

                {error && (
                  <div className="rounded-lg border border-[#C41E3A]/30 bg-[#C41E3A]/10 px-4 py-3 text-sm text-[#f7b3bf]">
                    {error}
                  </div>
                )}
              </form>
            </section>

            <aside className="rounded-2xl border border-border bg-secondary/50 p-6 md:p-8">
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.25em] text-[#C41E3A]">Live Gallery</p>
                <h2 className="mt-2 font-serif text-2xl md:text-3xl text-foreground">What is currently live</h2>
                <p className="mt-3 text-sm md:text-base text-muted-foreground">
                  Reorder photos and videos here and the invite page will follow this order.
                </p>
              </div>

              {gallery.length > 0 && (
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="rounded-md border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {selectedPathnames.length === gallery.length ? "Clear all" : "Select all"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    disabled={selectedPathnames.length === 0 || isDeleting}
                    className="inline-flex items-center gap-2 rounded-md border border-[#C41E3A]/70 bg-[#C41E3A]/15 px-3 py-1.5 text-xs font-semibold text-[#f5f5f5] transition-colors hover:bg-[#C41E3A]/25 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete selected ({selectedPathnames.length})
                  </button>
                </div>
              )}

              {gallery.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-background/40 px-5 py-10 text-center text-sm text-muted-foreground">
                  No gallery media has been uploaded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {gallery.map((image, index) => (
                    <figure
                      key={image.pathname}
                      draggable={!isSavingOrder && !isDeleting}
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(event) => handleDragOver(event, index)}
                      onDrop={() => handleDrop(index)}
                      onDragEnd={handleDragEnd}
                      className={`overflow-hidden rounded-xl border bg-background transition-all duration-200 ${
                        draggedIndex === index
                          ? "border-[#C41E3A] opacity-70"
                          : dragOverIndex === index
                            ? "border-[#C41E3A] shadow-lg shadow-[#C41E3A]/20"
                            : "border-[#C41E3A]/70"
                      }`}
                    >
                      <div className="flex items-stretch gap-3 p-3">
                        <label className="group pt-1">
                          <input
                            type="checkbox"
                            checked={selectedPathnames.includes(image.pathname)}
                            onChange={() => toggleSelected(image.pathname)}
                            className="peer sr-only"
                            aria-label={`Select image at position ${index + 1}`}
                          />
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm border border-[#C41E3A]/60 bg-[#111111] text-transparent transition-all duration-200 peer-checked:border-[#FF5A72] peer-checked:bg-[#C41E3A] peer-checked:text-white peer-checked:shadow-[0_0_0_2px_rgba(196,30,58,0.35)] peer-focus-visible:ring-2 peer-focus-visible:ring-[#C41E3A] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background group-hover:border-[#C41E3A]">
                            <Check className="h-3.5 w-3.5 scale-75 opacity-0 transition-all duration-200 peer-checked:scale-100 peer-checked:opacity-100" />
                          </span>
                        </label>

                        <div className="w-20 shrink-0 overflow-hidden rounded-lg border border-[#C41E3A]/70 bg-black">
                          {isGalleryVideo(image) ? (
                            <div className="relative h-20 w-full">
                              <video
                                src={image.url}
                                muted
                                playsInline
                                preload="metadata"
                                className="h-20 w-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <Play className="h-4 w-4 fill-white text-white" />
                              </div>
                            </div>
                          ) : (
                            <img src={image.url} alt="Gallery upload" className="h-20 w-full object-cover" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C41E3A]">
                            <GripVertical className="h-3.5 w-3.5" />
                            Position {index + 1}
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">Drag this card to reorder, or use the arrows.</p>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => moveImage(index, "up")}
                            disabled={index === 0 || isSavingOrder || isDeleting}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary text-foreground transition-colors hover:border-[#C41E3A] hover:text-[#C41E3A] disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`Move ${image.pathname} up`}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(index, "down")}
                            disabled={index === gallery.length - 1 || isSavingOrder || isDeleting}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary text-foreground transition-colors hover:border-[#C41E3A] hover:text-[#C41E3A] disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`Move ${image.pathname} down`}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </figure>
                  ))}
                </div>
              )}

              {isSavingOrder && (
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin text-[#C41E3A]" />
                  Saving gallery order...
                </div>
              )}

              <div className="mt-6 rounded-xl border border-border bg-background/35 px-4 py-4 text-sm text-muted-foreground">
                Keep this page private if you want uploads limited to the organizer.
              </div>
            </aside>
          </div>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#C41E3A]/45 bg-[#101010] p-6 shadow-2xl shadow-black/60">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#C41E3A]">Confirm Deletion</p>
                <h3 className="mt-2 font-serif text-2xl text-foreground">Delete selected items?</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  The following items are selected and will be removed from the gallery:
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                aria-label="Close delete confirmation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
              {selectedImages.map((image) => {
                const position = gallery.findIndex((item) => item.pathname === image.pathname)

                return (
                  <div key={image.pathname} className="flex items-center gap-3 rounded-lg border border-[#C41E3A]/40 bg-background/35 p-2.5">
                    <div className="h-14 w-14 overflow-hidden rounded-md border border-[#C41E3A]/60">
                      {isGalleryVideo(image) ? (
                        <div className="relative h-full w-full bg-black">
                          <video src={image.url} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play className="h-3.5 w-3.5 fill-white text-white" />
                          </div>
                        </div>
                      ) : (
                        <img src={image.url} alt="Selected for deletion" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <p className="text-sm text-foreground">
                      {isGalleryVideo(image) ? "Video" : "Photo"} at position {position + 1}
                    </p>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="rounded-md border border-border bg-secondary px-4 py-2 text-sm text-foreground transition-colors hover:border-[#C41E3A] disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteSelected}
                disabled={isDeleting || selectedImages.length === 0}
                className="inline-flex items-center gap-2 rounded-md border border-[#C41E3A] bg-[#C41E3A] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#A01830] disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {isDeleting ? "Deleting..." : `Delete ${selectedImages.length} item${selectedImages.length === 1 ? "" : "s"}`}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full h-1" style={{ background: "linear-gradient(to right, #0a0a0a, #C41E3A, #8B0000, #C41E3A, #0a0a0a)" }} />
    </main>
  )
}