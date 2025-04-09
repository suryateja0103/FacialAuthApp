// Cookie names
export const AUTH_TOKEN_COOKIE = "auth_token"

// Client-side authentication check
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false

  return !!document.cookie.split("; ").find((row) => row.startsWith(`${AUTH_TOKEN_COOKIE}=`))
}

// Set authentication token in cookie
export function setAuthCookie(token: string): void {
  document.cookie = `${AUTH_TOKEN_COOKIE}=${token}; path=/; max-age=86400; SameSite=Lax` // 24 hours
}

// Clear authentication cookie
export function clearAuthCookie(): void {
  document.cookie = `${AUTH_TOKEN_COOKIE}=; path=/; max-age=0`
}

// Get token from URL query parameters
export function getTokenFromUrl(): string | null {
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get("code")
  }
  return null
}

// Updated Cognito URL for the main login
export const COGNITO_LOGIN_URL =
  "https://us-east-1bx7ooefmj.auth.us-east-1.amazoncognito.com/login?client_id=6nvepr4r2tcl8010phg1pbmd5f&redirect_uri=https://main.d3gk4lrwo7dgvt.amplifyapp.com&response_type=code&scope=aws.cognito.signin.user.admin+email+openid"

// New Cognito URL specifically for facial upload
export const COGNITO_UPLOAD_URL =
  "https://us-east-1ai8l5cf96.auth.us-east-1.amazoncognito.com/login?client_id=6f4jes42oe0a9g1psp2ju4dvea&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fmain.d3gk4lrwo7dgvt.amplifyapp.com%2Ffacial-upload"
