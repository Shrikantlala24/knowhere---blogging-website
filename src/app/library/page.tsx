"use client";
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Heart, MessageCircle, Search } from "lucide-react";
import { savedArticleService } from '@/lib/supabase-service';
import type { SavedArticle, Article, Profile } from '@/lib/supabase';

export default function LibraryPage() {
  const { user } = useUser();
  const router = useRouter();
  const [savedArticles, setSavedArticles] = useState<(SavedArticle & { articles: Article & { profiles: Profile } })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSavedArticles();
    }
  }, [user]);

  const loadSavedArticles = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await savedArticleService.getSavedArticles(user.id);
      setSavedArticles(data);
    } catch (error) {
      console.error('Error loading saved articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveArticle = async (articleId: string) => {
    if (!user) return;

    try {
      await savedArticleService.unsaveArticle(user.id, articleId);
      setSavedArticles(prev => prev.filter(item => item.article_id !== articleId));
    } catch (error) {
      console.error('Error unsaving article:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading your library...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Your Library</h1>
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
        {savedArticles.length === 0 ? (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-12 text-center">
              <Bookmark className="w-16 h-16 text-gray-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Your reading list is empty</h2>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Save articles you want to read later by clicking the bookmark icon on any article.
              </p>
              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Discover Articles
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-400">
                {savedArticles.length} saved article{savedArticles.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="space-y-6">
              {savedArticles.map((savedItem) => {
                const article = savedItem.articles;
                return (
                  <Card
                    key={savedItem.id}
                    className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 transition-colors cursor-pointer"
                  >
                    <CardContent className="p-6">
                      <div className="flex space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-6 h-6 bg-emerald-600 rounded-full"></div>
                            <span className="text-sm text-gray-300">
                              {article.profiles?.full_name || article.profiles?.username}
                            </span>
                            <span className="text-gray-500">·</span>
                            <span className="text-sm text-gray-500">
                              {formatDate(article.created_at)}
                            </span>
                          </div>
                          
                          <h2 
                            className="text-xl font-bold text-white mb-2 line-clamp-2 cursor-pointer hover:text-emerald-400"
                            onClick={() => router.push(`/article/${article.slug}`)}
                          >
                            {article.title}
                          </h2>
                          
                          {article.subtitle && (
                            <p className="text-gray-400 mb-4 line-clamp-2">
                              {article.subtitle}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <span>{article.read_time} min read</span>
                              <div className="flex items-center space-x-1">
                                <Heart className="w-4 h-4" />
                                <span>{article.claps_count}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MessageCircle className="w-4 h-4" />
                                <span>{article.comments_count}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUnsaveArticle(article.id);
                                }}
                                className="text-emerald-400 hover:text-emerald-300"
                              >
                                <Bookmark className="w-4 h-4 fill-current" />
                              </Button>
                              {article.tags && article.tags.length > 0 && (
                                <div className="flex space-x-2">
                                  {article.tags.slice(0, 2).map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="secondary"
                                      className="bg-gray-800 text-gray-300 text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-24 h-24 bg-gray-800 rounded-lg flex-shrink-0"></div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
