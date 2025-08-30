import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Profile {
  id: string
  username: string
  full_name?: string
  avatar_url?: string
  bio?: string
  location?: string
  website?: string
  created_at: string
  updated_at: string
}

export interface Article {
  id: string
  title: string
  subtitle?: string
  content: string
  slug: string
  author_id: string
  published: boolean
  featured_image?: string
  tags: string[]
  read_time: number
  claps_count: number
  comments_count: number
  created_at: string
  updated_at: string
  published_at?: string
  profiles?: Profile
}

export interface Comment {
  id: string
  article_id: string
  user_id: string
  content: string
  parent_id?: string
  created_at: string
  profiles?: Profile
}

export interface Follow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

export interface Clap {
  id: string
  article_id: string
  user_id: string
  count: number
  created_at: string
}

export interface SavedArticle {
  id: string
  user_id: string
  article_id: string
  created_at: string
}
