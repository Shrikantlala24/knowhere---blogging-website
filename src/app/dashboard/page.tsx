"use client";
import { useState, useEffect } from 'react';
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Home, BookOpen, User, BarChart3, Users, PenTool, Star, TrendingUp, Heart } from "lucide-react";
import { articleService, profileService, followService } from '@/lib/supabase-service';
import type { Article, Profile } from '@/lib/supabase';

export default function Dashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [articles, setArticles] = useState<(Article & { profiles: Profile })[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const articlesData = await articleService.getPublishedArticles();
      setArticles(articlesData);
      
      // Load suggested users separately to avoid blocking the main content
      if (user?.id) {
        try {
          const suggestedData = await profileService.getSuggestedUsers(user.id, 3);
          setSuggestedUsers(suggestedData);
        } catch (suggestedError) {
          console.error('Error loading suggested users:', suggestedError);
          // Don't fail the whole dashboard if suggested users fail
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadDashboardData();
      return;
    }

    try {
      const searchResults = await articleService.searchArticles(searchQuery);
      setArticles(searchResults);
    } catch (error) {
      console.error('Error searching articles:', error);
    }
  };

  const handleFollowUser = async (userId: string) => {
    if (!user) return;
    
    try {
      await followService.followUser(user.id, userId);
      // Remove from suggested users after following
      setSuggestedUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const staffPicks = [
    {
      title: "Is The Mermalist by Ruchama",
      subtitle: "Gorgeous Lies My Dad Told Me",
      date: "Aug 18"
    },
    {
      title: "UX Collective by Michael McWatters",
      subtitle: "Three hours of vibe design",
      date: "Aug 22"
    },
    {
      title: "The Medium Blog by Tony Stubblebine",
      subtitle: "We want your feedback: How can writers use AI to tell human stories?",
      date: "Aug 21"
    }
  ];

  const recommendedTopics = [
    "Lifestyle", "AWS", "Data Science", "Women", "Android", "Software Engineering", "Flutter"
  ];

  return (
    <SignedIn>
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <h1 className="text-2xl font-bold">Knowhere</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    placeholder="Search" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10 w-80 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 hover:text-white"
                  onClick={() => router.push('/write')}
                >
                  <PenTool className="w-4 h-4 mr-2" />
                  Write
                </Button>
                <UserButton />
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto flex">
          {/* Sidebar */}
          <aside className="w-64 p-6 border-r border-gray-800 min-h-screen">
            <nav className="space-y-2">
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-800 text-white">
                <Home className="w-5 h-5" />
                <span>Home</span>
              </a>
              <button 
                onClick={() => router.push('/library')}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 w-full text-left"
              >
                <BookOpen className="w-5 h-5" />
                <span>Library</span>
              </button>
              <button 
                onClick={() => router.push('/profile')}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 w-full text-left"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
              <button 
                onClick={() => router.push('/stats')}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 w-full text-left"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Stats</span>
              </button>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800">
                <Users className="w-5 h-5" />
                <span>Following</span>
              </a>
            </nav>

            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-400 mb-4">DISCOVER MORE WRITERS</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-emerald-600 rounded-full"></div>
                    <span className="text-sm text-gray-300">Ali Kumar</span>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs border-gray-600 text-gray-400">Follow</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                    <span className="text-sm text-gray-300">Singh Bhai</span>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs border-gray-600 text-gray-400">Follow</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
                    <span className="text-sm text-gray-300">Abhish Pratap</span>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs border-gray-600 text-gray-400">Follow</Button>
                </div>
              </div>
              <Button variant="link" className="text-emerald-400 text-sm mt-4 p-0">
                See suggestions
              </Button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {/* Feed Tabs */}
            <div className="flex items-center space-x-8 mb-8 border-b border-gray-800">
              <button className="pb-4 border-b-2 border-emerald-500 text-white font-medium">
                For you
              </button>
              <button className="pb-4 text-gray-400 hover:text-white">
                Featured
              </button>
            </div>

            {/* Article Feed */}
            <div className="space-y-8">
              {articles.map((article) => (
                <Card 
                  key={article.id} 
                  className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 transition-colors cursor-pointer"
                  onClick={() => router.push(`/article/${article.slug}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-6 h-6 bg-emerald-600 rounded-full"></div>
                          <span className="text-sm text-gray-300">{article.profiles?.full_name || article.profiles?.username}</span>
                          <span className="text-gray-500">·</span>
                          <span className="text-sm text-gray-500">{formatDate(article.created_at)}</span>
                        </div>
                        
                        <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">
                          {article.title}
                        </h2>
                        
                        <p className="text-gray-400 mb-4 line-clamp-2">
                          {article.subtitle}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <span>{article.read_time} min read</span>
                              <div className="flex items-center space-x-1">
                                <span>👏</span>
                                <span>{article.claps_count}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span>💬</span>
                                <span>{article.comments_count}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {article.tags && article.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-24 h-24 bg-gray-800 rounded-lg flex-shrink-0"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="w-80 p-6 border-l border-gray-800">
            {/* Staff Picks */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Star className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold text-white">Staff Picks</h3>
              </div>
              <div className="space-y-4">
                {staffPicks.map((pick, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-gray-700 rounded-full"></div>
                      <span className="text-sm text-gray-400">{pick.title}</span>
                    </div>
                    <h4 className="text-sm font-medium text-white line-clamp-2">
                      {pick.subtitle}
                    </h4>
                    <span className="text-xs text-gray-500">{pick.date}</span>
                  </div>
                ))}
              </div>
              <Button variant="link" className="text-emerald-400 text-sm mt-4 p-0">
                See the full list
              </Button>
            </div>

            {/* Recommended Topics */}
            <div>
              <h3 className="font-semibold text-white mb-4">Recommended topics</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {recommendedTopics.map((topic) => (
                  <span 
                    key={topic} 
                    className="px-3 py-1 border border-gray-600 text-gray-300 hover:bg-gray-800 cursor-pointer rounded-full text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
              <Button variant="link" className="text-emerald-400 text-sm p-0">
                See more topics
              </Button>
            </div>

            {/* Who to Follow */}
            <div className="mt-8">
              <h3 className="font-semibold text-white mb-4">Who to follow</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full"></div>
                    <div>
                      <div className="text-sm font-medium text-white">Himanshu Singour</div>
                      <div className="text-xs text-gray-500">Staff writer</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs border-gray-600 text-gray-400">
                    Follow
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </SignedIn>
  );
}
