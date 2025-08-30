"use client";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { LampContainer } from "@/components/ui/lamp";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { TextRevealCard, TextRevealCardTitle, TextRevealCardDescription } from "@/components/ui/text-reveal-card";
import { WobbleCard } from "@/components/ui/wobble-card";
import { CardStack } from "@/components/ui/card-stack";
import { motion } from "motion/react";

export default function Home() {
  const navItems = [
    { name: "Home", link: "#home" },
    { name: "Story", link: "#story" },
    { name: "Features", link: "#features" },
    { name: "Membership", link: "#membership" },
  ];

  const testimonials = [
    {
      quote: "Knowhere has transformed how I share my thoughts. The writing experience is unmatched.",
      name: "Sarah Chen",
      title: "Tech Writer"
    },
    {
      quote: "The community here is incredible. My articles reach readers who truly appreciate quality content.",
      name: "Marcus Rodriguez",
      title: "Freelance Journalist"
    },
    {
      quote: "Finally, a platform that puts writers first. The analytics help me understand my audience better.",
      name: "Emily Watson",
      title: "Content Creator"
    },
    {
      quote: "The monetization features have allowed me to turn my passion into a sustainable income.",
      name: "David Kim",
      title: "Independent Author"
    }
  ];

  const featureCards = [
    {
      id: 1,
      name: "Writing Tools",
      designation: "Core Feature",
      content: (
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2">Advanced Writing Tools</h3>
          <p className="text-gray-300">Distraction-free editor with powerful formatting options</p>
        </div>
      )
    },
    {
      id: 2,
      name: "Analytics",
      designation: "Growth Feature", 
      content: (
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2">Deep Analytics</h3>
          <p className="text-gray-300">Understand your audience and optimize your content</p>
        </div>
      )
    },
    {
      id: 3,
      name: "Community",
      designation: "Social Feature",
      content: (
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2">Engaged Community</h3>
          <p className="text-gray-300">Connect with readers who appreciate quality content</p>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Floating Navigation */}
      <FloatingNav navItems={navItems} className="z-[9999]" />
      
      {/* Always visible navbar for hero section */}
      <div className="fixed top-0 left-0 right-0 z-[8000] bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Knowhere</h1>
            <div className="flex items-center space-x-4">
              <SignedOut>
                <SignInButton>
                  <Button variant="ghost" className="text-white hover:text-emerald-400">Sign In</Button>
                </SignInButton>
                <SignUpButton>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">Get Started</Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section with Gradient Animation */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <BackgroundGradientAnimation
          gradientBackgroundStart="rgb(0, 0, 0)"
          gradientBackgroundEnd="rgb(17, 24, 39)"
          firstColor="255, 193, 7"
          secondColor="20, 184, 166"
          thirdColor="251, 146, 60"
          fourthColor="245, 158, 11"
          fifthColor="249, 115, 22"
          pointerColor="20, 184, 166"
          size="80%"
          blendingValue="multiply"
          containerClassName="absolute inset-0"
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 px-6">
          <motion.h1
            initial={{ opacity: 0.5, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="text-5xl md:text-7xl font-bold leading-tight text-white"
          >
            Share your voice
            <br />
            <span className="text-emerald-400">with the world</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.5,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto"
          >
            A place where words matter. Write, read, and connect with a community of thoughtful writers and curious readers.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.7,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
          >
            <SignedOut>
              <SignUpButton>
                <Button size="lg" className="text-lg px-8 py-6 bg-emerald-600 hover:bg-emerald-700">
                  Start Writing
                </Button>
              </SignUpButton>
              <SignInButton>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-white/20 text-white hover:bg-white/10">
                  Explore Stories
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => window.location.href = '/dashboard'}
              >
                Go to Dashboard
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 border-white/20 text-white hover:bg-white/10"
                onClick={() => window.location.href = '/dashboard'}
              >
                View Feed
              </Button>
            </SignedIn>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section with Text Reveal Cards */}
      <section id="story" className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Story</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Discover the journey that led to creating a platform where every voice matters and every story finds its audience.
            </p>
          </div>
          <div className="space-y-8">
            <div className="flex justify-start">
              <TextRevealCard
                text="We believe that everyone has a story worth telling"
                revealText="Knowhere was born from this simple truth"
                className="w-full max-w-2xl"
              >
                <TextRevealCardTitle>
                  Every Voice Matters
                </TextRevealCardTitle>
                <TextRevealCardDescription>
                  Our platform combines the best of traditional publishing with modern technology, creating a space where writers can focus on what they do best: telling amazing stories.
                </TextRevealCardDescription>
              </TextRevealCard>
            </div>
            
            <div className="flex justify-end">
              <TextRevealCard
                text="Great writing should be accessible and rewarded"
                revealText="We're building the future of digital publishing"
                className="w-full max-w-2xl"
              >
                <TextRevealCardTitle>
                  Empowering Writers
                </TextRevealCardTitle>
                <TextRevealCardDescription>
                  From emerging voices to established authors, our community celebrates diverse perspectives and meaningful conversations that shape our world.
                </TextRevealCardDescription>
              </TextRevealCard>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Bento Grid */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Why Choose Knowhere?</h2>
            <p className="text-xl text-gray-400">Everything you need to write, publish, and grow your audience</p>
          </div>
          
          <BentoGrid className="max-w-4xl mx-auto">
            <BentoGridItem
              title="Distraction-Free Writing"
              description="Clean, minimal editor that lets you focus on your words. No clutter, no distractions."
              header={<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-emerald-900 to-emerald-600 shadow-lg shadow-emerald-500/20"></div>}
              className="md:col-span-2 bg-black border-emerald-500/20 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20"
              icon={<div className="h-4 w-4 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />}
            />
            <BentoGridItem
              title="Rich Text Editing"
              description="Powerful formatting tools when you need them. Bold, italic, headers, lists, quotes, and media embeds."
              header={<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-900 to-blue-600 shadow-lg shadow-blue-500/20"></div>}
              className="bg-black border-blue-500/20 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20"
              icon={<div className="h-4 w-4 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />}
            />
            <BentoGridItem
              title="Community Discovery"
              description="Smart recommendations help the right readers find your stories, building your audience organically."
              header={<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-purple-900 to-purple-600 shadow-lg shadow-purple-500/20"></div>}
              className="bg-black border-purple-500/20 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20"
              icon={<div className="h-4 w-4 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50" />}
            />
            <BentoGridItem
              title="Analytics & Insights"
              description="Detailed analytics help you understand what works and how to reach more readers."
              header={<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-pink-900 to-pink-600 shadow-lg shadow-pink-500/20"></div>}
              className="md:col-span-2 bg-black border-pink-500/20 shadow-lg shadow-pink-500/10 hover:shadow-pink-500/20"
              icon={<div className="h-4 w-4 rounded-full bg-pink-500 shadow-lg shadow-pink-500/50" />}
            />
          </BentoGrid>
        </div>
      </section>

      {/* Feature Showcase with Card Stack */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-900/50 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Experience the Platform</h2>
          <p className="text-xl text-gray-400 mb-12">See how our features work together seamlessly</p>
          <div className="flex justify-center">
            <CardStack items={featureCards} />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">What Writers Say</h2>
            <p className="text-xl text-gray-400">Join thousands of writers who&apos;ve found their voice on Knowhere</p>
          </div>
          
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />
        </div>
      </section>

      {/* Membership Section with Wobble Cards */}
      <section id="membership" className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Choose Your Plan</h2>
            <p className="text-xl text-gray-400">Start free, upgrade when you&apos;re ready to grow</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <WobbleCard containerClassName="bg-gray-800/50 border border-gray-700">
              <div className="max-w-xs">
                <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                  Free Plan
                </h2>
                <p className="mt-4 text-left text-base/6 text-neutral-200">
                  Perfect for getting started with your writing journey
                </p>
                <div className="text-4xl font-bold text-white mt-6 mb-6">
                  $0<span className="text-lg text-gray-400">/month</span>
                </div>
                <ul className="space-y-3 text-gray-300 mb-6">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span>Unlimited public stories</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span>Basic analytics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span>Community access</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  Get Started Free
                </Button>
              </div>
            </WobbleCard>

            <WobbleCard containerClassName="bg-gradient-to-br from-emerald-800 to-blue-800 border border-emerald-500/20">
              <div className="max-w-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                    Premium Plan
                  </h2>
                  <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm">Popular</div>
                </div>
                <p className="mt-4 text-left text-base/6 text-neutral-200">
                  For serious writers ready to monetize their content
                </p>
                <div className="text-4xl font-bold text-white mt-6 mb-6">
                  $8<span className="text-lg text-gray-400">/month</span>
                </div>
                <ul className="space-y-3 text-gray-300 mb-6">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span>Everything in Free</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span>Monetization tools</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Start Premium
                </Button>
              </div>
            </WobbleCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Knowhere</h3>
              <p className="text-gray-400">
                A platform for writers and readers to connect through meaningful stories.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Knowhere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
