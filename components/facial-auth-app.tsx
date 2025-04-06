"use client"
import { useEffect, useRef, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"

export default function FacialAuthApp() {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isAuth, setAuth] = useState(false)
  const [uploadResultMessage, setUploadResultMessage] = useState("Please capture an image to authenticate")
  const [isCaptured, setIsCaptured] = useState(false)
  const [authResponse, setAuthResponse] = useState<string>("")
  const [stream, setStream] = useState<MediaStream | null>(null)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const router = useRouter()

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [])

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
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.srcObject = null
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    console.log("Camera stopped")
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
    setAuth(false)
    setIsCaptured(false)
    setUploadResultMessage("Please capture an image to authenticate")
    setAuthResponse("")
    startCamera()
  }

  const authenticate = async () => {
    if (!preview) return

    const blob = await fetch(preview).then((res) => res.blob())
    const file = new File([blob], `${uuidv4()}.jpeg`, { type: "image/jpeg" })
    setImage(file)
    setAuth(false)
    setUploadResultMessage("Authenticating...")
    sendImage(file)
  }

  async function sendImage(imageFile: File) {
    setIsUploading(true)
    const visitorImageName = uuidv4()
    const imageUrl = `https://t11oq5vyz7.execute-api.us-east-1.amazonaws.com/dev/facial-visitor-image-storage/${visitorImageName}.jpeg`

    try {
      await fetch(imageUrl, {
        method: "PUT",
        headers: { "Content-Type": "image/jpeg", Accept: "*/*" },
        body: imageFile,
      })

      const response = await verifyAuthentication(visitorImageName)
      console.log("response", response)

      if (response.status === 200) {
        const { firstName, lastName } = response.data
        setAuth(true)

        router.push(`/todo?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`)
      } else {
        setAuth(false)
        setUploadResultMessage("❌ Sorry, you are not authorized to access the worksite.")
        setAuthResponse(
          `<span class='text-red-600 font-bold'>❌ Sorry, you are not authorized to access this worksite.</span>`,
        )
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      setAuth(false)
      setUploadResultMessage("Error during authentication process. Please try again.")
      setAuthResponse(
        `<span class='text-red-600 font-bold'>Error during authentication process. Please try again.</span>`,
      )
    } finally {
      setIsUploading(false)
    }
  }

  async function verifyAuthentication(visitorImageName: string) {
    const requestUrl = `https://t11oq5vyz7.execute-api.us-east-1.amazonaws.com/dev/employees?objectKey=${visitorImageName}.jpeg`

    try {
      const response = await fetch(requestUrl, {
        method: "GET",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
      })
      const data = await response.json()
      return { status: response.status, data }
    } catch (error) {
      console.error("Error in authentication request:", error)
      return { status: 500, data: {} }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Facial Authentication</CardTitle>
          <CardDescription className="text-center">Use your camera to authenticate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-300">
              {preview ? (
                <img src={preview} alt="Captured Image" className="w-full h-full object-cover" />
              ) : (
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {!isCaptured ? (
              <Button type="button" onClick={captureImage} className="w-full">
                Capture
              </Button>
            ) : (
              <>
                <Button type="button" onClick={authenticate} className="w-full" disabled={isUploading}>
                  {isUploading ? "Authenticating..." : "Authenticate"}
                </Button>
                <Button type="button" onClick={resetCapture} className="w-full">
                  Reset
                </Button>
              </>
            )}
          </div>
          {authResponse && <Alert className="mt-4" dangerouslySetInnerHTML={{ __html: authResponse }} />}
        </CardContent>
      </Card>
    </div>
  )
}

