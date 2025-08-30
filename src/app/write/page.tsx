"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, Save, Send, Plus, X, FileText, Split } from 'lucide-react';
import { articleService } from '@/lib/supabase-service';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import type { Article } from '@/lib/supabase';

export default function WritePage() {
  const { user } = useUser();
  const router = useRouter();
  const [article, setArticle] = useState<Partial<Article>>({
    title: '',
    subtitle: '',
    content: '',
    tags: [],
    published: false
  });
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('edit');

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !article.tags?.includes(newTag.trim())) {
      setArticle(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setArticle(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleSave = async (publish = false) => {
    if (!user || !article.title || !article.content) return;

    setIsLoading(true);
    try {
      const slug = generateSlug(article.title);
      const readTime = calculateReadTime(article.content);

      const articleData = {
        title: article.title,
        subtitle: article.subtitle || '',
        content: article.content,
        tags: article.tags || [],
        slug,
        read_time: readTime,
        author_id: user.id,
        published: publish,
        claps_count: 0,
        comments_count: 0
      };

      await articleService.createArticle(articleData);
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving article:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Please sign in to write articles.</div>
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
              <h1 className="text-xl font-semibold">Write Article</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('edit')}
                className={`border-gray-600 ${viewMode === 'edit' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('preview')}
                className={`border-gray-600 ${viewMode === 'preview' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('split')}
                className={`border-gray-600 ${viewMode === 'split' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Split className="w-4 h-4 mr-2" />
                Split
              </Button>
              <Button
                size="sm"
                onClick={() => handleSave(false)}
                disabled={isLoading || !article.title || !article.content}
                className="bg-gray-600 hover:bg-gray-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button
                size="sm"
                onClick={() => handleSave(true)}
                disabled={isLoading || !article.title || !article.content}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {viewMode === 'edit' ? (
          // Edit Mode
          <div className="space-y-6">
            {/* Title */}
            <div>
              <Input
                placeholder="Article title..."
                value={article.title}
                onChange={(e) => setArticle(prev => ({ ...prev, title: e.target.value }))}
                className="text-3xl font-bold bg-transparent border-none px-0 py-4 text-white placeholder-gray-500 focus:ring-0"
              />
            </div>

            {/* Subtitle */}
            <div>
              <Input
                placeholder="Subtitle (optional)..."
                value={article.subtitle}
                onChange={(e) => setArticle(prev => ({ ...prev, subtitle: e.target.value }))}
                className="text-xl bg-transparent border-none px-0 py-2 text-gray-300 placeholder-gray-500 focus:ring-0"
              />
            </div>

            {/* Tags */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Input
                  placeholder="Add tags..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && handleAddTag()}
                  className="bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                />
                <Button
                  onClick={handleAddTag}
                  variant="outline"
                  className="border-gray-600 text-gray-400 hover:text-white"
                  title="Add tag"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-gray-800 text-gray-300"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-gray-500 hover:text-white"
                        title="Remove tag"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div>
              <Textarea
                placeholder="Write your article in Markdown...

# Heading 1
## Heading 2
### Heading 3

**Bold text** and *italic text*

- Bullet point
- Another point

1. Numbered list
2. Second item

```javascript
// Code block
const example = 'Hello World';
```

> Blockquote

[Link text](https://example.com)"
                value={article.content}
                onChange={(e) => setArticle(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-[500px] bg-gray-900 border-gray-700 text-white placeholder-gray-400 font-mono text-sm leading-relaxed resize-none"
              />
            </div>
          </div>
        ) : viewMode === 'preview' ? (
          // Preview Mode
          <div className="max-w-4xl mx-auto">
            <article className="prose prose-invert prose-emerald max-w-none">
              <h1 className="text-4xl font-bold mb-4">{article.title || 'Untitled Article'}</h1>
              {article.subtitle && (
                <p className="text-xl text-gray-400 mb-8">{article.subtitle}</p>
              )}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-gray-800 text-gray-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="prose-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  className="prose prose-invert prose-emerald max-w-none"
                >
                  {article.content || '*Start writing to see preview...*'}
                </ReactMarkdown>
              </div>
            </article>
          </div>
        ) : (
          // Split Mode
          <div className="grid grid-cols-2 gap-8 h-[calc(100vh-200px)]">
            {/* Editor */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-300">Editor</h2>
              <div className="space-y-4">
                <Input
                  placeholder="Article title..."
                  value={article.title}
                  onChange={(e) => setArticle(prev => ({ ...prev, title: e.target.value }))}
                  className="text-2xl font-bold bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                />
                <Input
                  placeholder="Subtitle (optional)..."
                  value={article.subtitle}
                  onChange={(e) => setArticle(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="text-lg bg-gray-900 border-gray-700 text-gray-300 placeholder-gray-500"
                />
                <Textarea
                  placeholder="Write your article in Markdown..."
                  value={article.content}
                  onChange={(e) => setArticle(prev => ({ ...prev, content: e.target.value }))}
                  className="h-[400px] bg-gray-900 border-gray-700 text-white placeholder-gray-400 font-mono text-sm resize-none"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-300">Preview</h2>
              <div className="bg-gray-900 rounded-lg p-6 h-[500px] overflow-y-auto">
                <article className="prose prose-invert prose-emerald max-w-none">
                  <h1 className="text-3xl font-bold mb-3">{article.title || 'Untitled Article'}</h1>
                  {article.subtitle && (
                    <p className="text-lg text-gray-400 mb-6">{article.subtitle}</p>
                  )}
                  <div className="prose-content">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight, rehypeRaw]}
                      className="prose prose-invert prose-emerald max-w-none"
                    >
                      {article.content || '*Start writing to see preview...*'}
                    </ReactMarkdown>
                  </div>
                </article>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
