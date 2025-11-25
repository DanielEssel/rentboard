"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Camera, Loader2, CheckCircle, AlertCircle, LogOut } from "lucide-react"

interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  const checkAuth = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) throw sessionError
      
      if (!session) {
        router.push("/login")
        return
      }

      setUserId(session.user.id)
      setEmail(session.user.email || "")
      await fetchProfile(session.user.id)
    } catch (err: any) {
      console.error("Auth error:", err)
      setError("Authentication failed. Please sign in again.")
      router.push("/login")
    }
  }

  const fetchProfile = async (uid: string) => {
    try {
      setError(null)

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .single()

      if (profileError && profileError.code !== "PGRST116") {
        throw profileError
      }

      if (data) {
        setProfile(data)
        setFullName(data.full_name || "")
        setAvatarUrl(data.avatar_url)
      } else {
        // Create profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert([{ id: uid }])
          .select()
          .single()

        if (createError) throw createError
        setProfile(newProfile)
      }
    } catch (err: any) {
      setError(err.message || "Failed to load profile")
      console.error("Error fetching profile:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB")
      return
    }

    setAvatarFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setError(null)
  }

  const uploadAvatar = async (uid: string): Promise<string | null> => {
    if (!avatarFile) return avatarUrl

    try {
      setUploading(true)

      if (avatarUrl) {
        const oldPath = avatarUrl.split("/avatars/")[1]
        if (oldPath) {
          await supabase.storage.from("avatars").remove([oldPath])
        }
      }

      const fileExt = avatarFile.name.split(".").pop()
      const filePath = `${uid}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath)

      return publicUrl
    } catch (err: any) {
      throw new Error(err.message || "Failed to upload avatar")
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      if (!fullName.trim()) {
        throw new Error("Please enter your full name")
      }

      if (!userId) {
        throw new Error("User not authenticated")
      }

      let newAvatarUrl = avatarUrl
      if (avatarFile) {
        newAvatarUrl = await uploadAvatar(userId)
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          avatar_url: newAvatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (updateError) throw updateError

      setAvatarUrl(newAvatarUrl)
      setAvatarFile(null)
      setPreviewUrl(null)
      setSuccess("Profile updated successfully!")

      await fetchProfile(userId)
    } catch (err: any) {
      setError(err.message || "Failed to save profile")
      console.error("Error saving profile:", err)
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push("/login")
    } catch (err: any) {
      setError("Failed to sign out")
      console.error("Sign out error:", err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006D77] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  const displayAvatarUrl = previewUrl || avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(fullName || "User") + "&background=006D77&color=fff&size=128"

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#006D77] to-[#83C5BE] bg-clip-text text-transparent mb-2">
          Account Settings
        </h1>
        <p className="text-gray-600">Manage your profile information and preferences</p>
      </div>

      {success && (
        <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6 md:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b">
            <div className="relative group">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#006D77]/20 shadow-lg">
                <Image
                  src={displayAvatarUrl}
                  alt="Profile avatar"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
                
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>

              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-8 h-8 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  disabled={saving || uploading}
                />
              </label>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {fullName || "Your Name"}
              </h2>
              <p className="text-gray-600 mb-2">{email}</p>
              
              {profile && (
                <p className="text-sm text-gray-500">
                  Member since {formatDate(profile.created_at)}
                </p>
              )}

              <label className="inline-block mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  disabled={saving || uploading}
                  asChild
                >
                  <span>
                    <Camera className="w-4 h-4 mr-2" />
                    Change Avatar
                  </span>
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  disabled={saving || uploading}
                />
              </label>
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="pl-10"
                  disabled={saving}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  value={email}
                  disabled
                  className="pl-10 bg-gray-50 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed. Contact support if you need assistance.
              </p>
            </div>

            {profile?.updated_at && (
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Last updated: {formatDate(profile.updated_at)}
                </p>
              </div>
            )}
          </div>

          <div className="pt-6 border-t">
            <Button
              className="w-full sm:w-auto bg-gradient-to-r from-[#006D77] to-[#005560] hover:from-[#005560] hover:to-[#004450] text-white px-8"
              onClick={handleSave}
              disabled={saving || uploading}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6 md:p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
          
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}