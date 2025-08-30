import { supabase } from './supabase'
import type { Article, Profile, Comment, Follow, Clap, SavedArticle } from './supabase'

// Article Services
export const articleService = {
  // Get all published articles with author info
  async getPublishedArticles() {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        profiles!articles_author_id_fkey (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('published', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as (Article & { profiles: Profile })[]
  },

  // Get articles by author
  async getArticlesByAuthor(authorId: string) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('author_id', authorId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Article[]
  },

  // Get user articles with profile info
  async getUserArticles(authorId: string) {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        profiles!articles_author_id_fkey (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('author_id', authorId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as (Article & { profiles: Profile })[]
  },

  // Get single article by slug
  async getArticleBySlug(slug: string) {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        profiles!articles_author_id_fkey (
          id,
          username,
          full_name,
          avatar_url,
          bio
        )
      `)
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data as Article & { profiles: Profile }
  },

  // Create new article
  async createArticle(article: Omit<Article, 'id' | 'created_at' | 'updated_at' | 'claps_count' | 'comments_count'>) {
    const { data, error } = await supabase
      .from('articles')
      .insert(article)
      .select()
      .single()

    if (error) throw error
    return data as Article
  },

  // Update article
  async updateArticle(id: string, updates: Partial<Article>) {
    const { data, error } = await supabase
      .from('articles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Article
  },

  // Delete article
  async deleteArticle(id: string) {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Search articles
  async searchArticles(query: string) {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        profiles!articles_author_id_fkey (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('published', true)
      .or(`title.ilike.%${query}%, subtitle.ilike.%${query}%, content.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as (Article & { profiles: Profile })[]
  }
}

// Profile Services
export const profileService = {
  // Get user profile
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data as Profile | null
  },

  // Get profile by username
  async getProfileByUsername(username: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data as Profile | null
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data as Profile
  },

  // Get suggested users to follow
  async getSuggestedUsers(currentUserId: string, limit = 5) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', currentUserId)
      .limit(limit)

    if (error) throw error
    return data as Profile[]
  }
}

// Follow Services
export const followService = {
  // Follow a user
  async followUser(followerId: string, followingId: string) {
    const { data, error } = await supabase
      .from('follows')
      .insert({ follower_id: followerId, following_id: followingId })
      .select()
      .single()

    if (error) throw error
    return data as Follow
  },

  // Unfollow a user
  async unfollowUser(followerId: string, followingId: string) {
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId)

    if (error) throw error
  },

  // Check if user is following another user
  async isFollowing(followerId: string, followingId: string) {
    const { data, error } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return !!data
  },

  // Get followers
  async getFollowers(userId: string) {
    const { data, error } = await supabase
      .from('follows')
      .select(`
        *,
        profiles:follower_id (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('following_id', userId)

    if (error) throw error
    return data as (Follow & { profiles: Profile })[]
  },

  // Get following
  async getFollowing(userId: string) {
    const { data, error } = await supabase
      .from('follows')
      .select(`
        *,
        profiles:following_id (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('follower_id', userId)

    if (error) throw error
    return data as (Follow & { profiles: Profile })[]
  }
}

// Clap Services
export const clapService = {
  // Add clap to article
  async clapArticle(articleId: string, userId: string) {
    const { data, error } = await supabase
      .from('claps')
      .upsert(
        { article_id: articleId, user_id: userId, count: 1 },
        { onConflict: 'article_id,user_id' }
      )
      .select()
      .single()

    if (error) throw error

    // Update article claps count
    await supabase.rpc('increment_claps', { article_id: articleId })

    return data as Clap
  },

  // Get user's clap for article
  async getUserClap(articleId: string, userId: string) {
    const { data, error } = await supabase
      .from('claps')
      .select('*')
      .eq('article_id', articleId)
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data as Clap | null
  }
}

// Comment Services
export const commentService = {
  // Get comments for article
  async getArticleComments(articleId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles!comments_user_id_fkey (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('article_id', articleId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data as (Comment & { profiles: Profile })[]
  },

  // Add comment
  async addComment(comment: Omit<Comment, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('comments')
      .insert(comment)
      .select(`
        *,
        profiles!comments_user_id_fkey (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .single()

    if (error) throw error

    // Update article comments count
    await supabase.rpc('increment_comments', { article_id: comment.article_id })

    return data as Comment & { profiles: Profile }
  }
}

// Saved Articles Services
export const savedArticleService = {
  // Save article
  async saveArticle(userId: string, articleId: string) {
    const { data, error } = await supabase
      .from('saved_articles')
      .insert({ user_id: userId, article_id: articleId })
      .select()
      .single()

    if (error) throw error
    return data as SavedArticle
  },

  // Unsave article
  async unsaveArticle(userId: string, articleId: string) {
    const { error } = await supabase
      .from('saved_articles')
      .delete()
      .eq('user_id', userId)
      .eq('article_id', articleId)

    if (error) throw error
  },

  // Check if article is saved
  async isArticleSaved(userId: string, articleId: string) {
    const { data, error } = await supabase
      .from('saved_articles')
      .select('id')
      .eq('user_id', userId)
      .eq('article_id', articleId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return !!data
  },

  // Get user's saved articles
  async getSavedArticles(userId: string) {
    const { data, error } = await supabase
      .from('saved_articles')
      .select(`
        *,
        articles!saved_articles_article_id_fkey (
          *,
          profiles!articles_author_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as (SavedArticle & { articles: Article & { profiles: Profile } })[]
  }
}
