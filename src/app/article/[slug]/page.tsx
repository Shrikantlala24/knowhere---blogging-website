"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Heart, MessageCircle, Bookmark, Share2, Send } from 'lucide-react';
import { articleService, commentService, clapService, savedArticleService } from '@/lib/supabase-service';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import type { Article, Profile, Comment } from '@/lib/supabase';

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [article, setArticle] = useState<(Article & { profiles: Profile }) | null>(null);
  const [comments, setComments] = useState<(Comment & { profiles: Profile })[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isClapped, setIsClapped] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (params.slug) {
      loadArticle();
    }
  }, [params.slug, user]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
      if (!slug) return;
      
      const [articleData, commentsData] = await Promise.all([
        articleService.getArticleBySlug(slug),
        commentService.getArticleComments(slug)
      ]);

      setArticle(articleData);
      setComments(commentsData);

      // Check if user has clapped or saved this article
      if (user && articleData) {
        const [clapData, savedData] = await Promise.all([
          clapService.getUserClap(articleData.id, user.id).catch(() => null),
          savedArticleService.isArticleSaved(user.id, articleData.id).catch(() => false)
        ]);
        
        setIsClapped(!!clapData);
        setIsSaved(savedData);
      }
    } catch (error) {
      console.error('Error loading article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClap = async () => {
    if (!user || !article) return;

    try {
      await clapService.clapArticle(article.id, user.id);
      setIsClapped(true);
      setArticle(prev => prev ? { ...prev, claps_count: prev.claps_count + 1 } : null);
    } catch (error) {
      console.error('Error clapping article:', error);
    }
  };

  const handleSave = async () => {
    if (!user || !article) return;

    try {
      if (isSaved) {
        await savedArticleService.unsaveArticle(user.id, article.id);
        setIsSaved(false);
      } else {
        await savedArticleService.saveArticle(user.id, article.id);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!user || !article || !newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const comment = await commentService.addComment({
        article_id: article.id,
        user_id: user.id,
        content: newComment.trim()
      });

      setComments(prev => [...prev, comment]);
      setNewComment('');
      setArticle(prev => prev ? { ...prev, comments_count: prev.comments_count + 1 } : null);
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading article...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClap}
                disabled={!user}
                className={`${isClapped ? 'text-red-400' : 'text-gray-400'} hover:text-red-400`}
              >
                <Heart className={`w-4 h-4 mr-1 ${isClapped ? 'fill-current' : ''}`} />
                {article.claps_count}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                disabled={!user}
                className={`${isSaved ? 'text-emerald-400' : 'text-gray-400'} hover:text-emerald-400`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Article Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">{article.title}</h1>
          {article.subtitle && (
            <p className="text-xl text-gray-300 mb-6">{article.subtitle}</p>
          )}
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-full"></div>
              <div>
                <div className="font-medium text-white">
                  {article.profiles?.full_name || article.profiles?.username}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(article.created_at)} · {article.read_time} min read
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-400">
              Follow
            </Button>
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Article Content */}
        <div className="prose prose-lg prose-invert prose-emerald max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
              >
                {article.content}
              </ReactMarkdown>
            </div>

        {/* Engagement Bar */}
        <div className="flex items-center justify-between py-6 border-t border-b border-gray-800 mb-8">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              onClick={handleClap}
              disabled={!user}
              className={`${isClapped ? 'text-red-400' : 'text-gray-400'} hover:text-red-400`}
            >
              <Heart className={`w-5 h-5 mr-2 ${isClapped ? 'fill-current' : ''}`} />
              {article.claps_count}
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <MessageCircle className="w-5 h-5 mr-2" />
              {article.comments_count}
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={handleSave}
              disabled={!user}
              className={`${isSaved ? 'text-emerald-400' : 'text-gray-400'} hover:text-emerald-400`}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white">
            Comments ({article.comments_count})
          </h3>

          {/* Add Comment */}
          {user && (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-4">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 space-y-3">
                    <Textarea
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={handleSubmitComment}
                        disabled={!newComment.trim() || submittingComment}
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        {submittingComment ? 'Posting...' : 'Post Comment'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id} className="bg-gray-900/30 border-gray-800">
                <CardContent className="p-4">
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-white">
                          {comment.profiles?.full_name || comment.profiles?.username}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-300">{comment.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
