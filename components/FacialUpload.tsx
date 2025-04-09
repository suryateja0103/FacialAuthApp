"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"

export default function FacialAuthApp() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResultMessage, setUploadResultMessage] = useState(
    "Please enter your details and capture an image to authenticate.",
  )
  const [isCaptured, setIsCaptured] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const dropZoneRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (firstName && lastName && !stream) {
      startCamera()
    }
  }, [firstName, lastName])

  const startCamera = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: true })
      setStream(newStream)
      if (videoRef.current) {
        videoRef.current.srcObject = newStream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)

        const dataUrl = canvasRef.current.toDataURL("image/jpeg")
        setPreview(dataUrl)
        setIsCaptured(true)
        stopCamera()
      }
    }
  }

  const resetCapture = () => {
    setPreview(null)
    setImage(null)
    setIsCaptured(false)
    setUploadResultMessage("Please enter your details and capture an image to authenticate.")
    if (firstName && lastName) {
      startCamera()
    }
  }

  const uploadImage = async () => {
    if (!preview || !firstName || !lastName) {
      setUploadResultMessage("❌ Please enter first name and last name before uploading.")
      return
    }

    stopCamera()

    const blob = await fetch(preview).then((res) => res.blob())
    const fileName = `${firstName}_${lastName}.jpeg`
    const file = new File([blob], fileName, { type: "image/jpeg" })
    setImage(file)
    setUploadResultMessage("Uploading...")

    sendImage(fileName, file)
  }

  async function sendImage(fileName: string, imageFile: File) {
    setIsUploading(true)
    const imageUrl = `https://xq9m5io0s5.execute-api.us-east-1.amazonaws.com/dev/facial-employees-image-storage/${fileName}`

    try {
      await fetch(imageUrl, {
        method: "PUT",
        headers: { "Content-Type": "image/jpeg", Accept: "*/*" },
        body: imageFile,
      })
      setUploadResultMessage(`✅ Image uploaded successfully as ${fileName}!`)
      setUploadSuccess(true)
      stopCamera()
    } catch (error) {
      console.error("Error uploading image:", error)
      setUploadResultMessage("❌ Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  // Handle drag and drop functionality
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target && typeof event.target.result === "string") {
            setPreview(event.target.result)
            setIsCaptured(true)
            stopCamera()
          }
        }
        reader.readAsDataURL(file)
      } else {
        setUploadResultMessage("❌ Please drop an image file.")
      }
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target && typeof event.target.result === "string") {
            setPreview(event.target.result)
            setIsCaptured(true)
            stopCamera()
          }
        }
        reader.readAsDataURL(file)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Facial Authentication</CardTitle>
          <CardDescription className="text-center">Enter your name and use the camera to authenticate.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full"
            />
            <Input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full"
            />

            <div
              ref={dropZoneRef}
              className={`relative aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center border-2 ${
                isDragging ? "border-green-500 border-dashed" : "border-dashed border-gray-300"
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {preview ? (
                <img src={preview || "/placeholder.svg"} alt="Captured" className="w-full h-full object-cover" />
              ) : (
                <>
                  <video ref={videoRef} autoPlay className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 text-white pointer-events-none">
                    <p className="text-center p-4">Drag & drop an image here or use the camera</p>
                  </div>
                </>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <input type="file" accept="image/*" onChange={handleFileInput} className="hidden" id="file-upload" />
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-center text-sm text-blue-600 hover:text-blue-800"
            >
              Or select a file from your device
            </label>

            {!isCaptured ? (
              <Button type="button" onClick={captureImage} className="w-full">
                Capture
              </Button>
            ) : !uploadSuccess ? (
              <>
                <Button type="button" onClick={uploadImage} className="w-full" disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
                <Button type="button" onClick={resetCapture} className="w-full" variant="outline">
                  Reset
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => router.push("/")} className="w-full" variant="default">
                  Home Page
                </Button>
                <Button onClick={() => window.location.reload()} className="w-full" variant="outline">
                  Add Another Image
                </Button>
              </>
            )}
          </div>
          <Alert className="mt-4">{uploadResultMessage}</Alert>
        </CardContent>
      </Card>
    </div>
  )
}
