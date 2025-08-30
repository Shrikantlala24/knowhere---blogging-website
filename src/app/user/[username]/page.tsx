'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Calendar, Users, FileText, Heart, MessageCircle, UserPlus, UserMinus } from 'lucide-react';
import { profileService, articleService, followService } from '@/lib/supabase-service';
import type { Profile, Article } from '@/lib/supabase';

type ArticleWithProfile = Article & { profiles: Profile };

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const username = params.username as string;
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [articles, setArticles] = useState<ArticleWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    loadUserProfile();
  }, [username, user]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      
      // Get user profile by username
      const userProfile = await profileService.getProfileByUsername(username);
      if (!userProfile) {
        router.push('/404');
        return;
      }
      
      setProfile(userProfile);
      
      // Load user's articles
      const userArticles = await articleService.getUserArticles(userProfile.id);
      setArticles(userArticles);
      
      // Load follow stats
      const [followers, following] = await Promise.all([
        followService.getFollowers(userProfile.id),
        followService.getFollowing(userProfile.id)
      ]);
      
      setFollowerCount(followers.length);
      setFollowingCount(following.length);
      
      // Check if current user is following this profile
      if (user && user.id !== userProfile.id) {
        const following = await followService.isFollowing(user.id, userProfile.id);
        setIsFollowing(following);
      }
      
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!user || !profile || user.id === profile.id) return;
    
    try {
      if (isFollowing) {
        await followService.unfollowUser(user.id, profile.id);
        setIsFollowing(false);
        setFollowerCount(prev => prev - 1);
      } else {
        await followService.followUser(user.id, profile.id);
        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const formatReadTime = (minutes: number) => {
    return `${minutes} min read`;
  };

  const formatArticleDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">User not found</h1>
          <p className="text-gray-400 mb-4">The user you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const publishedArticles = articles.filter(article => article.published);
  const totalClaps = publishedArticles.reduce((sum, article) => sum + article.claps_count, 0);
  const totalComments = publishedArticles.reduce((sum, article) => sum + article.comments_count, 0);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            {user && user.id !== profile.id && (
              <Button
                onClick={handleFollowToggle}
                className={`${
                  isFollowing
                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserMinus className="w-4 h-4 mr-2" />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Follow
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Profile Section */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-start space-x-6 mb-8">
          <img
            src={profile.avatar_url || '/default-avatar.png'}
            alt={profile.full_name || profile.username}
            className="w-24 h-24 rounded-full"
          />
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              {profile.full_name || profile.username}
            </h1>
            
            <p className="text-gray-400 mb-4">@{profile.username}</p>
            
            {profile.bio && (
              <p className="text-gray-300 mb-4 max-w-2xl">{profile.bio}</p>
            )}
            
            <div className="flex items-center space-x-6 text-sm text-gray-400 mb-4">
              {profile.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {formatDate(profile.created_at)}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-white font-medium">{followerCount}</span>
                <span className="text-gray-400">followers</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <span className="text-white font-medium">{followingCount}</span>
                <span className="text-gray-400">following</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span className="text-gray-400">Articles</span>
            </div>
            <div className="text-2xl font-bold">{publishedArticles.length}</div>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="w-5 h-5 text-red-400" />
              <span className="text-gray-400">Total Claps</span>
            </div>
            <div className="text-2xl font-bold">{totalClaps}</div>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <MessageCircle className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400">Comments</span>
            </div>
            <div className="text-2xl font-bold">{totalComments}</div>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span className="text-gray-400">Followers</span>
            </div>
            <div className="text-2xl font-bold">{followerCount}</div>
          </div>
        </div>

        {/* Articles */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            Articles ({publishedArticles.length})
          </h2>
          
          {publishedArticles.length === 0 ? (
            <div className="text-center py-12 bg-gray-900 rounded-lg">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No articles yet</h3>
              <p className="text-gray-400">
                {profile.username} hasn't published any articles yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {publishedArticles.map((article) => (
                <article
                  key={article.id}
                  className="border border-gray-800 p-6 rounded-lg hover:bg-gray-900/50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/article/${article.slug}`)}
                >
                  <div className="flex items-center space-x-2 text-sm text-gray-400 mb-3">
                    <span>{formatArticleDate(article.created_at)}</span>
                    <span>·</span>
                    <span>{formatReadTime(article.read_time)}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 text-white hover:text-emerald-400 transition-colors">
                    {article.title}
                  </h3>
                  
                  {article.subtitle && (
                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {article.subtitle}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex items-center space-x-2">
                          {article.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-gray-800 text-gray-300 hover:bg-emerald-900 hover:text-emerald-300 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/tag/${encodeURIComponent(tag)}`);
                              }}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{article.claps_count}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{article.comments_count}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
