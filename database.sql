-- Enable RLS (Row Level Security)
alter table auth.users enable row level security;

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
  website text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create articles table
create table public.articles (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  subtitle text,
  content text not null,
  slug text unique not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  published boolean default false,
  featured_image text,
  tags text[] default '{}',
  read_time integer default 0,
  claps_count integer default 0,
  comments_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  published_at timestamp with time zone
);

-- Create comments table
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  article_id uuid references public.articles(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  parent_id uuid references public.comments(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create follows table
create table public.follows (
  id uuid default gen_random_uuid() primary key,
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(follower_id, following_id)
);

-- Create claps table
create table public.claps (
  id uuid default gen_random_uuid() primary key,
  article_id uuid references public.articles(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  count integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(article_id, user_id)
);

-- Create saved_articles table
create table public.saved_articles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  article_id uuid references public.articles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, article_id)
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.articles enable row level security;
alter table public.comments enable row level security;
alter table public.follows enable row level security;
alter table public.claps enable row level security;
alter table public.saved_articles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

create policy "Published articles are viewable by everyone." on articles for select using (published = true or auth.uid() = author_id);
create policy "Users can insert their own articles." on articles for insert with check (auth.uid() = author_id);
create policy "Users can update own articles." on articles for update using (auth.uid() = author_id);

create policy "Comments are viewable by everyone." on comments for select using (true);
create policy "Users can insert comments." on comments for insert with check (auth.uid() = user_id);
create policy "Users can update own comments." on comments for update using (auth.uid() = user_id);

create policy "Follows are viewable by everyone." on follows for select using (true);
create policy "Users can manage their own follows." on follows for all using (auth.uid() = follower_id);

create policy "Claps are viewable by everyone." on claps for select using (true);
create policy "Users can manage their own claps." on claps for all using (auth.uid() = user_id);

create policy "Users can view their own saved articles." on saved_articles for select using (auth.uid() = user_id);
create policy "Users can manage their own saved articles." on saved_articles for all using (auth.uid() = user_id);

-- Create functions for updating timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.articles
  for each row execute procedure public.handle_updated_at();

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create functions for incrementing counters
create or replace function public.increment_claps(article_id uuid)
returns void as $$
begin
  update public.articles 
  set claps_count = claps_count + 1 
  where id = article_id;
end;
$$ language plpgsql;

create or replace function public.increment_comments(article_id uuid)
returns void as $$
begin
  update public.articles 
  set comments_count = comments_count + 1 
  where id = article_id;
end;
$$ language plpgsql;

-- Create indexes for better performance
create index articles_author_id_idx on public.articles(author_id);
create index articles_published_idx on public.articles(published);
create index articles_created_at_idx on public.articles(created_at desc);
create index comments_article_id_idx on public.comments(article_id);
create index follows_follower_id_idx on public.follows(follower_id);
create index follows_following_id_idx on public.follows(following_id);
create index claps_article_id_idx on public.claps(article_id);
create index saved_articles_user_id_idx on public.saved_articles(user_id);
