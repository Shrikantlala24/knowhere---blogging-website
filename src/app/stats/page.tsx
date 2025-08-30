"use client";
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Eye, Heart, MessageCircle, BookOpen, Calendar } from "lucide-react";
import { articleService, followService } from '@/lib/supabase-service';
import type { Article } from '@/lib/supabase';

export default function StatsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [articlesData, followersData, followingData] = await Promise.all([
        articleService.getArticlesByAuthor(user.id),
        followService.getFollowers(user.id),
        followService.getFollowing(user.id)
      ]);

      setArticles(articlesData);
      setFollowers(followersData.length);
      setFollowing(followingData.length);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalClaps = articles.reduce((sum, article) => sum + article.claps_count, 0);
  const totalComments = articles.reduce((sum, article) => sum + article.comments_count, 0);
  const publishedArticles = articles.filter(article => article.published);
  const draftArticles = articles.filter(article => !article.published);
  const avgClapsPerArticle = publishedArticles.length > 0 ? Math.round(totalClaps / publishedArticles.length) : 0;

  // Get recent articles (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentArticles = articles.filter(article => 
    new Date(article.created_at) > thirtyDaysAgo
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading stats...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-6 h-6 text-emerald-400" />
              <h1 className="text-2xl font-bold">Analytics</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="text-gray-400 hover:text-white"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Articles</p>
                  <p className="text-2xl font-bold text-white">{articles.length}</p>
                </div>
                <BookOpen className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Claps</p>
                  <p className="text-2xl font-bold text-white">{totalClaps}</p>
                </div>
                <Heart className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Comments</p>
                  <p className="text-2xl font-bold text-white">{totalComments}</p>
                </div>
                <MessageCircle className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Followers</p>
                  <p className="text-2xl font-bold text-white">{followers}</p>
                </div>
                <Users className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Article Performance */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>Article Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Published Articles</span>
                <span className="text-white font-semibold">{publishedArticles.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Draft Articles</span>
                <span className="text-white font-semibold">{draftArticles.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Avg. Claps per Article</span>
                <span className="text-white font-semibold">{avgClapsPerArticle}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Articles this month</span>
                <span className="text-white font-semibold">{recentArticles.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Engagement Stats */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-400" />
                <span>Engagement Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Engagement</span>
                <span className="text-white font-semibold">{totalClaps + totalComments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Clap Rate</span>
                <span className="text-white font-semibold">
                  {publishedArticles.length > 0 ? `${avgClapsPerArticle} per article` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Comment Rate</span>
                <span className="text-white font-semibold">
                  {publishedArticles.length > 0 ? 
                    `${Math.round(totalComments / publishedArticles.length)} per article` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Following</span>
                <span className="text-white font-semibold">{following}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Articles */}
        {publishedArticles.length > 0 && (
          <Card className="bg-gray-900/50 border-gray-800 mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>Top Performing Articles</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {publishedArticles
                  .sort((a, b) => (b.claps_count + b.comments_count) - (a.claps_count + a.comments_count))
                  .slice(0, 5)
                  .map((article) => (
                    <div
                      key={article.id}
                      className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800/70 transition-colors"
                      onClick={() => router.push(`/article/${article.slug}`)}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-white line-clamp-1">{article.title}</h4>
                        <p className="text-sm text-gray-400">
                          {new Date(article.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1 text-red-400">
                          <Heart className="w-4 h-4" />
                          <span>{article.claps_count}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-blue-400">
                          <MessageCircle className="w-4 h-4" />
                          <span>{article.comments_count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {articles.length === 0 && (
          <Card className="bg-gray-900/50 border-gray-800 mt-8">
            <CardContent className="p-12 text-center">
              <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">No data to analyze yet</h3>
              <p className="text-gray-400 mb-6">
                Start writing articles to see your analytics and performance metrics.
              </p>
              <Button
                onClick={() => router.push('/write')}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Write Your First Article
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
