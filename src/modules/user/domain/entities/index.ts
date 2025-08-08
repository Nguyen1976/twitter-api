export interface UserProfile {
  id: string
  userId: string
  displayName: string
  bio?: string
  location?: string
  website?: string
  avatarUrl?: string
  headerImageUrl?: string
  followerCount: number
  followingCount: number
  createdAt: Date
  updatedAt: Date
}
