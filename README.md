# Knowhere - Modern Blogging Platform

A beautiful, feature-rich blogging platform built with Next.js, Clerk authentication, and Supabase database. Inspired by Medium's clean design with a modern dark theme.

## ✨ Features

- **🔐 Authentication**: Secure user authentication with Clerk
- **📝 Rich Writing Experience**: Full-featured article editor with preview mode
- **💬 Engagement**: Comments, claps, and article saving functionality
- **👥 Social Features**: Follow users, discover new writers
- **📊 Analytics**: Personal stats and article performance tracking
- **🎨 Modern UI**: Dark theme with emerald accents, fully responsive
- **🔍 Search**: Real-time article search functionality
- **📚 Library**: Save articles for later reading

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel (recommended)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd knowhere
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```bash
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Supabase Database
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL commands from `database.sql` in your Supabase SQL editor
   - This will create all necessary tables, policies, and functions

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🗄️ Database Schema

The application uses the following main tables:
- `profiles` - User profile information
- `articles` - Blog articles with metadata
- `comments` - Article comments
- `follows` - User following relationships
- `claps` - Article engagement (likes)
- `saved_articles` - User's saved articles

## 🎯 Key Pages

- **Landing Page** (`/`) - Beautiful hero section with authentication
- **Dashboard** (`/dashboard`) - Main feed with article discovery
- **Write** (`/write`) - Article creation and editing
- **Article** (`/article/[slug]`) - Individual article reading page
- **Profile** (`/profile`) - User profile management
- **Library** (`/library`) - Saved articles
- **Stats** (`/stats`) - Analytics and performance metrics

## 🚀 Deployment

### Recommended: Vercel

1. **Connect to Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Set environment variables in Vercel dashboard**
   - Add all environment variables from `.env.local`
   - Ensure Supabase URL and keys are correctly set

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Alternative: Other Platforms

The app can also be deployed to:
- Netlify
- Railway
- DigitalOcean App Platform

## 🔧 Configuration

### Clerk Setup
1. Create a Clerk application
2. Configure sign-in/sign-up pages
3. Add your domain to allowed origins

### Supabase Setup
1. Create a new project
2. Run the database migration from `database.sql`
3. Enable Row Level Security (RLS)
4. Configure authentication settings

## 🎨 Customization

The application uses a consistent design system:
- **Colors**: Dark theme with emerald green accents
- **Typography**: Clean, readable fonts
- **Components**: Reusable shadcn/ui components
- **Animations**: Smooth transitions and hover effects

## 📱 Responsive Design

Fully responsive design that works on:
- Desktop computers
- Tablets
- Mobile phones

## 🔒 Security Features

- Row Level Security (RLS) in Supabase
- Protected API routes
- Secure authentication with Clerk
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Open an issue on GitHub
- Contact the development team

---

Built with ❤️ using Next.js, Clerk, and Supabase.
