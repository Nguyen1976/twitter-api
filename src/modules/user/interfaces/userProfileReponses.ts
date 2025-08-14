export interface UserProfileUpdateResponse {
    userId: string
    displayName?: string
    bio?: string
    location?: string
    website?: string
    avatarUrl?: string
    headerImageUrl?: string
    followerCount?: number
    followingCount?: number
    updatedAt: Date
}