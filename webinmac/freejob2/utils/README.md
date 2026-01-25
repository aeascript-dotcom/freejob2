# Database Seeding Script

This directory contains utility scripts for database operations.

## Seed Dummy Users Script

The `seed_dummy_users.ts` script inserts **50 realistic dummy freelancers** into the Supabase `users` table for stress-testing the Search & Filtering and Quotation systems.

### Data Distribution

The 50 users are distributed across 5 categories (10 users each):

1. **Home & Living** (10 users)
   - ช่างประปา, ช่างไฟ, ล้างแอร์, ทำความสะอาด, ตกแต่งภายใน, ช่างไม้, ทาสี, งานปูน, งานเหล็ก

2. **Graphic & Design** (10 users)
   - Logo Design, Banner, UX/UI, Illustrator, Packaging, Web Design, Branding

3. **Marketing & Content** (10 users)
   - Facebook Ads, SEO, Content Writing, Influencer, TikTok, Copywriting, Review

4. **Tech & Web** (10 users)
   - Web Dev, Mobile App, WordPress, Frontend, Backend, Bug Fix

5. **Lifestyle & Services** (10 users)
   - ดูดวง, เทรนเนอร์, ช่างแต่งหน้า, ไกด์, พี่เลี้ยงเด็ก, โยคะ, นวด, สอนภาษา

### Prerequisites

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase credentials:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     ```
   
   **⚠️ Important:** For seeding, you need the **Service Role Key** (not the anon key) to bypass Row Level Security (RLS). Get it from:
   - Supabase Dashboard → Settings → API → `service_role` key
   - **Never expose this key in client-side code!**

3. **Ensure database schema is set up:**
   - Run the SQL migration from `schema.sql` in your Supabase SQL Editor

### Usage

Run the seeding script:

```bash
npm run seed
```

Or directly with tsx:

```bash
npx tsx utils/seed_dummy_users.ts
```

### What the Script Does

1. Creates 50 realistic Thai freelancer profiles with:
   - Realistic Thai names
   - Category-appropriate skills tags
   - Catchy bio_short (for card view)
   - Detailed bio_long (for profile view)
   - Random stats_completed_jobs (0-50)
   - Random availability_status (80% available, 20% busy)
   - Avatar URLs from pravatar.cc

2. Inserts them into the `users` table in Supabase

3. Provides progress feedback and error reporting

### Expected Output

```
🌱 Starting database seeding...
📊 Total freelancers to insert: 50
✅ Inserted: สมชาย การช่าง (freelance_01@test.com)
✅ Inserted: วิชัย ไฟฟ้า (freelance_02@test.com)
...
📈 Seeding Summary:
✅ Success: 50
❌ Errors: 0
📊 Total: 50
✨ Seeding completed!
🎉 All done!
```

### Troubleshooting

**Error: Missing Supabase environment variables**
- Make sure `.env.local` exists and contains all required variables
- Verify the Service Role Key is correct

**Error: Permission denied / RLS policy violation**
- Ensure you're using the Service Role Key (not anon key)
- Check that RLS policies allow inserts (or temporarily disable RLS for seeding)

**Error: Duplicate key violation**
- The script will skip users that already exist (based on email uniqueness)
- To re-seed, delete existing test users first

### Testing the Data

After seeding, you can test:

1. **Search & Filtering:**
   - Visit `/search` page
   - Test category filters
   - Test tag filtering
   - Test search queries

2. **Quotation System:**
   - Select multiple freelancers
   - Send quotation requests
   - Verify freelancers receive notifications

### Notes

- All emails use the pattern `freelance_[n]@test.com` to avoid email sending errors
- Avatar URLs are generated using pravatar.cc with sequential IDs
- The script includes a 100ms delay between inserts to avoid rate limiting
- All users have `role: 'freelancer'` and `is_duplicate_flag: false`
