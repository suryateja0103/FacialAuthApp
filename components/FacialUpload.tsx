"use client"

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

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
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

            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-300">
              {preview ? (
                <img src={preview} alt="Captured" className="w-full h-full object-cover" />
              ) : (
                <video ref={videoRef} autoPlay className="w-full h-full object-cover" />
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>

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

