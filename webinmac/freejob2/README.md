# Freejob - Freelance Marketplace

A database-driven freelance marketplace built with Next.js 14 (App Router) and Supabase.

## Features

- **Sand Sifting**: Filter freelancers via tags
- **Direct Deal**: No payment gateway, just direct transfer
- **Real-time Chat**: Text-only messaging between clients and freelancers
- **Bidding System**: Clients post quotations, freelancers bid
- **Role-based Access**: Clients, Freelancers, and Admins

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **Font**: Noto Sans Thai (Google Fonts)
- **Authentication**: Supabase Auth (Google & Email)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project on [Supabase](https://supabase.com)
2. Copy `.env.local.example` to `.env.local`
3. Fill in your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Run Database Migration

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `schema.sql`
4. Run the migration

### 4. Configure Authentication

In your Supabase dashboard:
1. Go to Authentication > Providers
2. Enable Email provider
3. Enable Google provider (configure OAuth credentials)

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following main tables:

- **users**: User profiles (clients, freelancers, admins)
- **job_categories**: Taxonomy for job categories
- **quotations**: Bidding system for job postings
- **deals**: Active jobs between clients and freelancers
- **chat_logs**: Text-only messaging between participants

See `schema.sql` for the complete schema with indexes and RLS policies.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with Noto Sans Thai font
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ui/               # Shadcn UI components
├── lib/                  # Utilities
│   ├── supabase/        # Supabase client configuration
│   └── utils.ts         # Helper functions
├── schema.sql            # Database migration file
└── middleware.ts        # Next.js middleware for auth
```

## Next Steps

- Populate database with dummy data
- Build authentication pages (login, signup)
- Create freelancer browsing and filtering UI
- Implement quotation posting and bidding
- Build deal management interface
- Add chat functionality
