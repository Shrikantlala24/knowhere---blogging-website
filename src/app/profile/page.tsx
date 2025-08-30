"use client";
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Edit, Settings, Users, BookOpen, Heart, MessageCircle } from "lucide-react";
import { profileService, articleService, followService } from '@/lib/supabase-service';
import type { Profile, Article } from '@/lib/supabase';

export default function ProfilePage() {
  const { user } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    full_name: '',
    bio: '',
    website: ''
  });

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [profileData, articlesData, followersData, followingData] = await Promise.all([
        profileService.getProfile(user.id).catch(() => null),
        articleService.getArticlesByAuthor(user.id),
        followService.getFollowers(user.id),
        followService.getFollowing(user.id)
      ]);

      setProfile(profileData);
      setArticles(articlesData);
      setFollowers(followersData.length);
      setFollowing(followingData.length);

      if (profileData) {
        setEditForm({
          username: profileData.username || '',
          full_name: profileData.full_name || '',
          bio: profileData.bio || '',
          website: profileData.website || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      const updatedProfile = await profileService.updateProfile(user.id, editForm);
      setProfile(updatedProfile);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalClaps = articles.reduce((sum, article) => sum + article.claps_count, 0);
  const totalComments = articles.reduce((sum, article) => sum + article.comments_count, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Profile</h1>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(!editing)}
                className="border-gray-600 text-gray-400 hover:text-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                {editing ? 'Cancel' : 'Edit Profile'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="text-gray-400 hover:text-white"
              >
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-emerald-600 rounded-full mx-auto mb-4"></div>
                  {editing ? (
                    <div className="space-y-3">
                      <Input
                        placeholder="Full Name"
                        value={editForm.full_name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                      <Input
                        placeholder="Username"
                        value={editForm.username}
                        onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                      <Textarea
                        placeholder="Bio"
                        value={editForm.bio}
                        onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                        className="bg-gray-800 border-gray-700 text-white resize-none"
                        rows={3}
                      />
                      <Input
                        placeholder="Website"
                        value={editForm.website}
                        onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                      <Button
                        onClick={handleSaveProfile}
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                      >
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold text-white">
                        {profile?.full_name || user?.fullName || 'Anonymous User'}
                      </h2>
                      {profile?.username && (
                        <p className="text-gray-400">@{profile.username}</p>
                      )}
                      {profile?.bio && (
                        <p className="text-gray-300 mt-3">{profile.bio}</p>
                      )}
                      {profile?.website && (
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 mt-2 inline-block"
                        >
                          {profile.website}
                        </a>
                      )}
                    </>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-800">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{followers}</div>
                    <div className="text-sm text-gray-400">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{following}</div>
                    <div className="text-sm text-gray-400">Following</div>
                  </div>
                </div>

                {/* Article Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white">{articles.length}</div>
                    <div className="text-xs text-gray-400">Articles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white">{totalClaps}</div>
                    <div className="text-xs text-gray-400">Claps</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white">{totalComments}</div>
                    <div className="text-xs text-gray-400">Comments</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Articles */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Your Articles</h3>
              <Button
                onClick={() => router.push('/write')}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Write New Article
              </Button>
            </div>

            {articles.length === 0 ? (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-8 text-center">
                  <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-white mb-2">No articles yet</h4>
                  <p className="text-gray-400 mb-4">Start sharing your thoughts with the world</p>
                  <Button
                    onClick={() => router.push('/write')}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Write Your First Article
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {articles.map((article) => (
                  <Card
                    key={article.id}
                    className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 transition-colors cursor-pointer"
                    onClick={() => router.push(`/article/${article.slug}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                            {article.title}
                          </h4>
                          {article.subtitle && (
                            <p className="text-gray-400 mb-3 line-clamp-2">
                              {article.subtitle}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant={article.published ? "default" : "secondary"}
                          className={article.published ? "bg-emerald-600" : "bg-gray-600"}
                        >
                          {article.published ? "Published" : "Draft"}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>{formatDate(article.created_at)}</span>
                          <span>{article.read_time} min read</span>
                        </div>
                        <div className="flex items-center space-x-4">
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

                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {article.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="border-gray-600 text-gray-400 text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
