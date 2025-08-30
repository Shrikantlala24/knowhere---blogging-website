"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import { articleService, savedArticleService, clapService } from '@/lib/supabase-service';
import type { Article, Profile } from '@/lib/supabase';

type ArticleWithProfile = Article & { profiles: Profile };

export default function TagPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const tag = params.tag as string;
  
  const [articles, setArticles] = useState<ArticleWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedArticles, setSavedArticles] = useState<Set<string>>(new Set());
  const [clappedArticles, setClappedArticles] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadTaggedArticles();
    if (user) {
      loadUserInteractions();
    }
  }, [tag, user]);

  const loadTaggedArticles = async () => {
    try {
      setLoading(true);
      const allArticles = await articleService.getPublishedArticles();
      const taggedArticles = allArticles.filter(article => 
        article.tags?.some(articleTag => 
          articleTag.toLowerCase() === decodeURIComponent(tag).toLowerCase()
        )
      );
      setArticles(taggedArticles);
    } catch (error) {
      console.error('Error loading tagged articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserInteractions = async () => {
    if (!user) return;
    
    try {
      const [saved, clapped] = await Promise.all([
        savedArticleService.getSavedArticles(user.id),
        // We'll need to implement getUserClaps in the service
        Promise.resolve([]) // Placeholder for now
      ]);
      
      setSavedArticles(new Set(saved.map(item => item.article_id)));
      // setClappedArticles(new Set(clapped.map(item => item.article_id)));
    } catch (error) {
      console.error('Error loading user interactions:', error);
    }
  };

  const handleSaveArticle = async (articleId: string) => {
    if (!user) return;
    
    try {
      if (savedArticles.has(articleId)) {
        await savedArticleService.unsaveArticle(user.id, articleId);
        setSavedArticles(prev => {
          const newSet = new Set(prev);
          newSet.delete(articleId);
          return newSet;
        });
      } else {
        await savedArticleService.saveArticle(user.id, articleId);
        setSavedArticles(prev => new Set(prev).add(articleId));
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  const handleClapArticle = async (articleId: string) => {
    if (!user) return;
    
    try {
      await clapService.clapArticle(articleId, user.id);
      setClappedArticles(prev => new Set(prev).add(articleId));
      
      // Update article claps count locally
      setArticles(prev => prev.map(article => 
        article.id === articleId 
          ? { ...article, claps_count: article.claps_count + 1 }
          : article
      ));
    } catch (error) {
      console.error('Error adding clap:', error);
    }
  };

  const filteredArticles = articles.filter(article =>
    searchQuery === '' || 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.profiles.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatReadTime = (minutes: number) => {
    return `${minutes} min read`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading articles...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">#{decodeURIComponent(tag)}</h1>
                <p className="text-gray-400">{articles.length} articles</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400 w-64"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No articles found</h2>
            <p className="text-gray-400">
              {searchQuery 
                ? `No articles matching "${searchQuery}" found for this tag.`
                : `No articles found with the tag "${decodeURIComponent(tag)}".`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="border-b border-gray-800 pb-8 last:border-b-0 cursor-pointer hover:bg-gray-900/20 p-4 rounded-lg transition-colors"
                onClick={() => router.push(`/article/${article.slug}`)}
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={article.profiles.avatar_url || '/default-avatar.png'}
                    alt={article.profiles.full_name || 'Author'}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                      <span className="font-medium text-white">
                        {article.profiles.full_name || article.profiles.username}
                      </span>
                      <span>·</span>
                      <span>{formatDate(article.created_at)}</span>
                    </div>
                    
                    <h2 className="text-xl font-bold mb-2 text-white hover:text-emerald-400 transition-colors">
                      {article.title}
                    </h2>
                    
                    {article.subtitle && (
                      <p className="text-gray-400 mb-3 line-clamp-2">
                        {article.subtitle}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{formatReadTime(article.read_time)}</span>
                        
                        {article.tags && article.tags.length > 0 && (
                          <div className="flex items-center space-x-2">
                            {article.tags.slice(0, 3).map((articleTag) => (
                              <Badge
                                key={articleTag}
                                variant="secondary"
                                className={`bg-gray-800 text-gray-300 hover:bg-emerald-900 hover:text-emerald-300 cursor-pointer ${
                                  articleTag.toLowerCase() === decodeURIComponent(tag).toLowerCase() 
                                    ? 'bg-emerald-900 text-emerald-300' 
                                    : ''
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/tag/${encodeURIComponent(articleTag)}`);
                                }}
                              >
                                {articleTag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {user && (
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClapArticle(article.id);
                            }}
                            className={`flex items-center space-x-1 text-sm transition-colors ${
                              clappedArticles.has(article.id)
                                ? 'text-emerald-400'
                                : 'text-gray-400 hover:text-emerald-400'
                            }`}
                          >
                            <Heart className="w-4 h-4" />
                            <span>{article.claps_count}</span>
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/article/${article.slug}#comments`);
                            }}
                            className="flex items-center space-x-1 text-sm text-gray-400 hover:text-white transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>{article.comments_count}</span>
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveArticle(article.id);
                            }}
                            title={savedArticles.has(article.id) ? "Remove from saved" : "Save article"}
                            className={`text-sm transition-colors ${
                              savedArticles.has(article.id)
                                ? 'text-emerald-400'
                                : 'text-gray-400 hover:text-emerald-400'
                            }`}
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.share?.({
                                title: article.title,
                                url: `${window.location.origin}/article/${article.slug}`
                              });
                            }}
                            title="Share article"
                            className="text-gray-400 hover:text-white text-sm transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {user && (
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClapArticle(article.id);
                          }}
                          className={`flex items-center space-x-1 text-sm transition-colors ${
                            clappedArticles.has(article.id)
                              ? 'text-emerald-400'
                              : 'text-gray-400 hover:text-emerald-400'
                          }`}
                        >
                          <Heart className="w-4 h-4" />
                          <span>{article.claps_count}</span>
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/article/${article.slug}#comments`);
                          }}
                          className="flex items-center space-x-1 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>{article.comments_count}</span>
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveArticle(article.id);
                          }}
                          title={savedArticles.has(article.id) ? "Remove from saved" : "Save article"}
                          className={`text-sm transition-colors ${
                            savedArticles.has(article.id)
                              ? 'text-emerald-400'
                              : 'text-gray-400 hover:text-emerald-400'
                          }`}
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.share?.({
                              title: article.title,
                              url: `${window.location.origin}/article/${article.slug}`
                            });
                          }}
                          title="Share article"
                          className="text-gray-400 hover:text-white text-sm transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
