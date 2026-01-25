/**
 * Database Seeding Script for Freejob App
 * 
 * This script inserts 50 realistic dummy freelancers into the Supabase `users` table
 * for stress-testing the Search & Filtering and Quotation systems.
 * 
 * Usage:
 *   npx tsx utils/seed_dummy_users.ts
 *   or
 *   ts-node utils/seed_dummy_users.ts
 */

import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with service role key for admin operations
// For production, use environment variable: process.env.SUPABASE_SERVICE_ROLE_KEY
// For development, you may need to use the anon key if RLS allows inserts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)')
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Helper function to generate random number between min and max
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Helper function to randomly select availability (80% available, 20% busy)
const randomAvailability = (): 'available' | 'busy' => {
  return Math.random() < 0.8 ? 'available' : 'busy'
}

// Helper function to generate avatar URL
const generateAvatarUrl = (index: number): string => {
  return `https://pravatar.cc/150?img=${index + 10}`
}

// ============================================
// 1. HOME & LIVING CATEGORY (10 users)
// ============================================
const homeLivingFreelancers = [
  {
    email: 'freelance_01@test.com',
    full_name: 'สมชาย การช่าง',
    role: 'freelancer' as const,
    bio_short: 'รับซ่อมท่อ เดินระบบน้ำ ทั่วกทม.',
    bio_long: 'ประสบการณ์ช่างประปา 10 ปี รับแก้ท่อตัน เดินท่อใหม่ งานด่วนเรียกได้ 24 ชม. รับประกันงานทุกชิ้น',
    skills_tags: ['ช่างประปา', 'ซ่อมท่อ', 'กรุงเทพ', 'งานด่วน'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_02@test.com',
    full_name: 'วิชัย ไฟฟ้า',
    role: 'freelancer' as const,
    bio_short: 'ช่างไฟมืออาชีพ รับเดินไฟ ตรวจระบบ',
    bio_long: 'ช่างไฟฟ้ามืออาชีพ 15 ปีประสบการณ์ รับเดินไฟใหม่ ตรวจระบบไฟฟ้า ซ่อมแผงเมน ปลอดภัย มาตรฐาน',
    skills_tags: ['เดินไฟ', 'ช่างไฟฟ้า', 'ตรวจระบบ', 'ซ่อมแผงเมน'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_03@test.com',
    full_name: 'มานี แอร์เย็น',
    role: 'freelancer' as const,
    bio_short: 'ล้างแอร์ ตรวจเช็ค ราคาเป็นกันเอง',
    bio_long: 'บริการล้างแอร์ทุกยี่ห้อ ตรวจเช็คระบบ เปลี่ยนฟิลเตอร์ ราคาเป็นกันเอง งานสะอาด รับประกัน',
    skills_tags: ['ล้างแอร์', 'ตรวจเช็ค', 'เปลี่ยนฟิลเตอร์', 'ซ่อมแอร์'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_04@test.com',
    full_name: 'สุภาพร ทำความสะอาด',
    role: 'freelancer' as const,
    bio_short: 'แม่บ้านมืออาชีพ ทำความสะอาดบ้าน สำนักงาน',
    bio_long: 'แม่บ้านมืออาชีพ รับทำความสะอาดบ้าน คอนโด สำนักงาน งานละเอียด ใช้ผลิตภัณฑ์คุณภาพ ราคายุติธรรม',
    skills_tags: ['ทำความสะอาด', 'แม่บ้าน', 'บ้าน', 'สำนักงาน'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_05@test.com',
    full_name: 'ประเสริฐ ตกแต่ง',
    role: 'freelancer' as const,
    bio_short: 'ออกแบบตกแต่งภายใน บ้าน คอนโด',
    bio_long: 'ดีไซเนอร์ตกแต่งภายใน รับออกแบบและตกแต่งบ้าน คอนโด อพาร์ตเมนต์ สไตล์โมเดิร์น มินิมอล',
    skills_tags: ['ตกแต่งภายใน', 'ออกแบบ', 'บ้าน', 'คอนโด'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_06@test.com',
    full_name: 'สมศักดิ์ ช่างไม้',
    role: 'freelancer' as const,
    bio_short: 'ช่างไม้ รับทำเฟอร์นิเจอร์ ซ่อมแซม',
    bio_long: 'ช่างไม้มืออาชีพ รับทำเฟอร์นิเจอร์ตามสั่ง ซ่อมแซมงานไม้ ตกแต่งบ้าน งานละเอียด ราคาเป็นกันเอง',
    skills_tags: ['ช่างไม้', 'เฟอร์นิเจอร์', 'ซ่อมแซม', 'งานไม้'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_07@test.com',
    full_name: 'วิไล งานสี',
    role: 'freelancer' as const,
    bio_short: 'ช่างทาสี รับทาสีบ้าน อาคาร',
    bio_long: 'ช่างทาสีมืออาชีพ รับทาสีบ้าน อาคาร คอนโด งานละเอียด ใช้สีคุณภาพ ราคายุติธรรม',
    skills_tags: ['ทาสี', 'ช่างสี', 'บ้าน', 'อาคาร'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_08@test.com',
    full_name: 'เกรียงไกร ระบบน้ำ',
    role: 'freelancer' as const,
    bio_short: 'ช่างประปา รับซ่อม ตรวจระบบน้ำ',
    bio_long: 'ช่างประปามืออาชีพ รับซ่อมท่อน้ำ ตรวจระบบน้ำ เปลี่ยนอุปกรณ์ งานด่วน 24 ชม.',
    skills_tags: ['ช่างประปา', 'ซ่อมท่อ', 'ระบบน้ำ', 'งานด่วน'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_09@test.com',
    full_name: 'รัตนา งานปูน',
    role: 'freelancer' as const,
    bio_short: 'ช่างปูน รับก่อสร้าง ซ่อมแซม',
    bio_long: 'ช่างปูนมืออาชีพ รับก่อสร้าง ซ่อมแซม งานปูน งานกระเบื้อง งานละเอียด ราคาเป็นกันเอง',
    skills_tags: ['ช่างปูน', 'ก่อสร้าง', 'ซ่อมแซม', 'กระเบื้อง'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_10@test.com',
    full_name: 'ธนพล งานเหล็ก',
    role: 'freelancer' as const,
    bio_short: 'ช่างเหล็ก รับทำประตู หน้าต่าง เหล็กดัด',
    bio_long: 'ช่างเหล็กมืออาชีพ รับทำประตู หน้าต่าง เหล็กดัด งานเชื่อม งานละเอียด ราคายุติธรรม',
    skills_tags: ['ช่างเหล็ก', 'ประตู', 'หน้าต่าง', 'เหล็กดัด'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
]

// ============================================
// 2. GRAPHIC & DESIGN CATEGORY (10 users)
// ============================================
const designFreelancers = [
  {
    email: 'freelance_11@test.com',
    full_name: 'อารยา ดีไซน์',
    role: 'freelancer' as const,
    bio_short: 'ออกแบบโลโก้ สไตล์มินิมอล โมเดิร์น',
    bio_long: 'กราฟิกดีไซเนอร์มืออาชีพ รับออกแบบโลโก้ แบรนด์ไอเดนติตี้ สไตล์มินิมอล โมเดิร์น งานสร้างสรรค์',
    skills_tags: ['Logo Design', 'Branding', 'UX/UI', 'Illustrator'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_12@test.com',
    full_name: 'ณัฐพล แบนเนอร์',
    role: 'freelancer' as const,
    bio_short: 'ออกแบบแบนเนอร์ โปสเตอร์ โฆษณา',
    bio_long: 'ดีไซเนอร์รับออกแบบแบนเนอร์ โปสเตอร์ โฆษณา สื่อสิ่งพิมพ์ งานสร้างสรรค์ ตรงตามความต้องการ',
    skills_tags: ['Banner', 'Poster', 'Packaging', 'Photoshop'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_13@test.com',
    full_name: 'ปิยะดา UX/UI',
    role: 'freelancer' as const,
    bio_short: 'UX/UI Designer รับออกแบบเว็บ แอป',
    bio_long: 'UX/UI Designer มืออาชีพ รับออกแบบเว็บไซต์ แอปพลิเคชัน งานวิจัยผู้ใช้ ดีไซน์ที่ใช้งานง่าย',
    skills_tags: ['UX/UI', 'Web Design', 'App Design', 'Figma'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_14@test.com',
    full_name: 'ศุภชัย อิลลัส',
    role: 'freelancer' as const,
    bio_short: 'Illustrator รับวาดภาพประกอบ อาร์ตเวิร์ค',
    bio_long: 'Illustrator มืออาชีพ รับวาดภาพประกอบ อาร์ตเวิร์ค การ์ตูน สไตล์หลากหลาย งานสร้างสรรค์',
    skills_tags: ['Illustrator', 'Digital Art', 'Character Design', 'Adobe Illustrator'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_15@test.com',
    full_name: 'กมลชนก แพ็คเกจจิ้ง',
    role: 'freelancer' as const,
    bio_short: 'ออกแบบแพ็คเกจจิ้ง ผลิตภัณฑ์',
    bio_long: 'ดีไซเนอร์แพ็คเกจจิ้ง รับออกแบบบรรจุภัณฑ์ ผลิตภัณฑ์ สร้างแบรนด์ให้โดดเด่น งานคุณภาพ',
    skills_tags: ['Packaging', 'Product Design', 'Branding', '3D Design'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_16@test.com',
    full_name: 'ธีรพงษ์ เว็บดีไซน์',
    role: 'freelancer' as const,
    bio_short: 'Web Designer รับออกแบบเว็บไซต์',
    bio_long: 'Web Designer มืออาชีพ รับออกแบบเว็บไซต์ Responsive Design ใช้งานง่าย สวยงาม',
    skills_tags: ['Web Design', 'UX/UI', 'Responsive', 'Figma'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_17@test.com',
    full_name: 'วราภรณ์ กราฟิก',
    role: 'freelancer' as const,
    bio_short: 'กราฟิกดีไซเนอร์ รับงานครบวงจร',
    bio_long: 'กราฟิกดีไซเนอร์มืออาชีพ รับงานออกแบบครบวงจร โลโก้ แบนเนอร์ โปสเตอร์ งานคุณภาพ',
    skills_tags: ['Logo Design', 'Banner', 'Graphic Design', 'Photoshop'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_18@test.com',
    full_name: 'อัครพงศ์ อาร์ต',
    role: 'freelancer' as const,
    bio_short: 'Digital Artist รับวาดภาพดิจิทัล',
    bio_long: 'Digital Artist มืออาชีพ รับวาดภาพดิจิทัล อาร์ตเวิร์ค สไตล์หลากหลาย งานสร้างสรรค์',
    skills_tags: ['Illustrator', 'Digital Art', 'Concept Art', 'Procreate'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_19@test.com',
    full_name: 'สุชาดา แบรนด์',
    role: 'freelancer' as const,
    bio_short: 'Brand Designer รับออกแบบแบรนด์',
    bio_long: 'Brand Designer มืออาชีพ รับออกแบบแบรนด์ไอเดนติตี้ โลโก้ สี ฟอนต์ งานครบวงจร',
    skills_tags: ['Logo Design', 'Branding', 'Identity Design', 'Typography'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_20@test.com',
    full_name: 'พงศ์ศักดิ์ มินิมอล',
    role: 'freelancer' as const,
    bio_short: 'ดีไซเนอร์สไตล์มินิมอล เรียบง่าย',
    bio_long: 'ดีไซเนอร์สไตล์มินิมอล รับออกแบบโลโก้ แบรนด์ งานเรียบง่าย สวยงาม โดดเด่น',
    skills_tags: ['Logo Design', 'Minimalist', 'UX/UI', 'Branding'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
]

// ============================================
// 3. MARKETING & CONTENT CATEGORY (10 users)
// ============================================
const marketingFreelancers = [
  {
    email: 'freelance_21@test.com',
    full_name: 'อรอนงค์ คอนเทนต์',
    role: 'freelancer' as const,
    bio_short: 'Content Writer รับเขียนบทความ บล็อก',
    bio_long: 'Content Writer มืออาชีพ รับเขียนบทความ บล็อก คอนเทนต์โซเชียล งานคุณภาพ SEO Friendly',
    skills_tags: ['Content Writing', 'SEO', 'Blog Writing', 'Copywriting'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_22@test.com',
    full_name: 'ชาญชัย แอดส์',
    role: 'freelancer' as const,
    bio_short: 'Facebook Ads Specialist รับทำโฆษณา',
    bio_long: 'Facebook Ads Specialist มืออาชีพ รับทำโฆษณา Facebook Instagram วิเคราะห์ผลลัพธ์ ROI สูง',
    skills_tags: ['Facebook Ads', 'Instagram Ads', 'Marketing', 'Analytics'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_23@test.com',
    full_name: 'ปิยวรรณ SEO',
    role: 'freelancer' as const,
    bio_short: 'SEO Specialist รับทำ SEO เว็บไซต์',
    bio_long: 'SEO Specialist มืออาชีพ รับทำ SEO เว็บไซต์ เพิ่มอันดับ Google วิเคราะห์คีย์เวิร์ด',
    skills_tags: ['SEO', 'Google Ads', 'Keyword Research', 'Analytics'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_24@test.com',
    full_name: 'ธนพล อินฟลูเอนเซอร์',
    role: 'freelancer' as const,
    bio_short: 'Influencer Marketing รับรีวิว โปรโมท',
    bio_long: 'Influencer Marketing Specialist รับรีวิวสินค้า โปรโมทแบรนด์ TikTok Instagram ฟอลโลว์เยอะ',
    skills_tags: ['Influencer', 'TikTok', 'Instagram', 'Review'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_25@test.com',
    full_name: 'กัญญารัตน์ คัดลอก',
    role: 'freelancer' as const,
    bio_short: 'Copywriter รับเขียนโฆษณา คัดลอก',
    bio_long: 'Copywriter มืออาชีพ รับเขียนโฆษณา คัดลอกขาย สโลแกน งานสร้างสรรค์ ขายได้จริง',
    skills_tags: ['Copywriting', 'Content Writing', 'Advertising', 'Marketing'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_26@test.com',
    full_name: 'อรรถพล ทิกท็อก',
    role: 'freelancer' as const,
    bio_short: 'TikTok Creator รับทำคอนเทนต์',
    bio_long: 'TikTok Creator มืออาชีพ รับทำคอนเทนต์ TikTok วิดีโอสั้น ไวรัล วิวเยอะ',
    skills_tags: ['TikTok', 'Video Content', 'Social Media', 'Influencer'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_27@test.com',
    full_name: 'ศิริพร รีวิว',
    role: 'freelancer' as const,
    bio_short: 'Review Writer รับรีวิวสินค้า บริการ',
    bio_long: 'Review Writer มืออาชีพ รับรีวิวสินค้า บริการ ร้านอาหาร งานละเอียด ตรงประเด็น',
    skills_tags: ['Review', 'Content Writing', 'SEO', 'Blog Writing'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_28@test.com',
    full_name: 'วรพล โซเชียล',
    role: 'freelancer' as const,
    bio_short: 'Social Media Manager รับจัดการโซเชียล',
    bio_long: 'Social Media Manager มืออาชีพ รับจัดการโซเชียลมีเดีย Facebook Instagram วางแผนคอนเทนต์',
    skills_tags: ['Social Media', 'Facebook Ads', 'Content Strategy', 'Marketing'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_29@test.com',
    full_name: 'นันทนา บล็อก',
    role: 'freelancer' as const,
    bio_short: 'Blog Writer รับเขียนบล็อก บทความ',
    bio_long: 'Blog Writer มืออาชีพ รับเขียนบล็อก บทความ SEO Friendly งานคุณภาพ อ่านง่าย',
    skills_tags: ['Blog Writing', 'Content Writing', 'SEO', 'Copywriting'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_30@test.com',
    full_name: 'ธีระพงษ์ มาร์เก็ตติ้ง',
    role: 'freelancer' as const,
    bio_short: 'Marketing Consultant รับปรึกษาการตลาด',
    bio_long: 'Marketing Consultant มืออาชีพ รับปรึกษาการตลาด วางแผนกลยุทธ์ วิเคราะห์ตลาด',
    skills_tags: ['Marketing', 'Strategy', 'Analytics', 'Facebook Ads'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
]

// ============================================
// 4. TECH & WEB CATEGORY (10 users)
// ============================================
const techFreelancers = [
  {
    email: 'freelance_31@test.com',
    full_name: 'สมเกียรติ เว็บดีฟ',
    role: 'freelancer' as const,
    bio_short: 'Web Developer รับทำเว็บไซต์',
    bio_long: 'Web Developer มืออาชีพ รับทำเว็บไซต์ React Next.js TypeScript งานคุณภาพ รองรับทุกอุปกรณ์',
    skills_tags: ['Web Dev', 'React', 'Next.js', 'Frontend'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_32@test.com',
    full_name: 'ปิยะดา แอป',
    role: 'freelancer' as const,
    bio_short: 'Mobile App Developer รับทำแอป',
    bio_long: 'Mobile App Developer มืออาชีพ รับทำแอป iOS Android React Native Flutter งานคุณภาพ',
    skills_tags: ['Mobile App', 'React Native', 'iOS', 'Android'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_33@test.com',
    full_name: 'อรรถพล เวิร์ดเพรส',
    role: 'freelancer' as const,
    bio_short: 'WordPress Developer รับทำเว็บ WordPress',
    bio_long: 'WordPress Developer มืออาชีพ รับทำเว็บ WordPress WooCommerce Plugin Theme งานคุณภาพ',
    skills_tags: ['WordPress', 'WooCommerce', 'PHP', 'Web Dev'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_34@test.com',
    full_name: 'กมลชนก แบคเอนด์',
    role: 'freelancer' as const,
    bio_short: 'Backend Developer รับทำ API Server',
    bio_long: 'Backend Developer มืออาชีพ รับทำ API Server Node.js Python Django งานคุณภาพ ปลอดภัย',
    skills_tags: ['Backend', 'Node.js', 'Python', 'API'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_35@test.com',
    full_name: 'ธีรพงษ์ ฟิก',
    role: 'freelancer' as const,
    bio_short: 'Bug Fix Specialist รับแก้บั๊ก',
    bio_long: 'Bug Fix Specialist มืออาชีพ รับแก้บั๊ก ปัญหาเว็บ แอป งานด่วน ราคาเป็นกันเอง',
    skills_tags: ['Bug Fix', 'Debugging', 'Web Dev', 'Troubleshooting'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_36@test.com',
    full_name: 'วราภรณ์ ฟรอนต์เอนด์',
    role: 'freelancer' as const,
    bio_short: 'Frontend Developer รับทำ UI',
    bio_long: 'Frontend Developer มืออาชีพ รับทำ UI React Vue.js Angular งานสวยงาม ใช้งานง่าย',
    skills_tags: ['Frontend', 'React', 'Vue.js', 'UI'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_37@test.com',
    full_name: 'อัครพงศ์ ฟูลสแตก',
    role: 'freelancer' as const,
    bio_short: 'Full Stack Developer รับทำเว็บครบวงจร',
    bio_long: 'Full Stack Developer มืออาชีพ รับทำเว็บครบวงจร Frontend Backend Database งานคุณภาพ',
    skills_tags: ['Web Dev', 'Frontend', 'Backend', 'Full Stack'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_38@test.com',
    full_name: 'สุชาดา พีเอชพี',
    role: 'freelancer' as const,
    bio_short: 'PHP Developer รับทำเว็บ PHP',
    bio_long: 'PHP Developer มืออาชีพ รับทำเว็บ PHP Laravel CodeIgniter งานคุณภาพ ปลอดภัย',
    skills_tags: ['PHP', 'Laravel', 'Backend', 'Web Dev'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_39@test.com',
    full_name: 'พงศ์ศักดิ์ ไพธอน',
    role: 'freelancer' as const,
    bio_short: 'Python Developer รับทำโปรแกรม Python',
    bio_long: 'Python Developer มืออาชีพ รับทำโปรแกรม Python Django Flask งานคุณภาพ เร็ว',
    skills_tags: ['Python', 'Django', 'Backend', 'API'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_40@test.com',
    full_name: 'อรอนงค์ ดีบั๊ก',
    role: 'freelancer' as const,
    bio_short: 'Debugging Specialist รับแก้ปัญหา',
    bio_long: 'Debugging Specialist มืออาชีพ รับแก้ปัญหาเว็บ แอป ระบบ งานด่วน ราคาเป็นกันเอง',
    skills_tags: ['Bug Fix', 'Debugging', 'Troubleshooting', 'Web Dev'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
]

// ============================================
// 5. LIFESTYLE & SERVICES CATEGORY (10 users)
// ============================================
const lifestyleFreelancers = [
  {
    email: 'freelance_41@test.com',
    full_name: 'ชาญชัย ดูดวง',
    role: 'freelancer' as const,
    bio_short: 'หมอดู รับดูดวง โหราศาสตร์',
    bio_long: 'หมอดูมืออาชีพ รับดูดวง โหราศาสตร์ ดูดวงไพ่ ดูดวงมือ งานแม่นยำ ราคาเป็นกันเอง',
    skills_tags: ['ดูดวง', 'โหราศาสตร์', 'ไพ่', 'ดวงชะตา'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_42@test.com',
    full_name: 'ปิยวรรณ เทรนเนอร์',
    role: 'freelancer' as const,
    bio_short: 'Personal Trainer รับเทรนฟิตเนส',
    bio_long: 'Personal Trainer มืออาชีพ รับเทรนฟิตเนส ออกกำลังกาย วางแผนอาหาร งานคุณภาพ',
    skills_tags: ['เทรนเนอร์', 'ฟิตเนส', 'ออกกำลังกาย', 'Personal Training'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_43@test.com',
    full_name: 'ธนพล แต่งหน้า',
    role: 'freelancer' as const,
    bio_short: 'ช่างแต่งหน้า รับแต่งหน้า งานแต่งงาน',
    bio_long: 'ช่างแต่งหน้ามืออาชีพ รับแต่งหน้า งานแต่งงาน งานอีเวนต์ งานคุณภาพ สวยงาม',
    skills_tags: ['ช่างแต่งหน้า', 'แต่งหน้า', 'งานแต่งงาน', 'Makeup'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_44@test.com',
    full_name: 'กัญญารัตน์ ไกด์',
    role: 'freelancer' as const,
    bio_short: 'ไกด์ทัวร์ รับพาทัวร์ กรุงเทพ',
    bio_long: 'ไกด์ทัวร์มืออาชีพ รับพาทัวร์ กรุงเทพ ต่างจังหวัด ภาษาอังกฤษ ไทย งานคุณภาพ',
    skills_tags: ['ไกด์', 'ทัวร์', 'กรุงเทพ', 'Tour Guide'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_45@test.com',
    full_name: 'อรรถพล พี่เลี้ยง',
    role: 'freelancer' as const,
    bio_short: 'พี่เลี้ยงเด็ก รับเลี้ยงเด็ก',
    bio_long: 'พี่เลี้ยงเด็กมืออาชีพ รับเลี้ยงเด็ก ดูแลเด็ก งานคุณภาพ ปลอดภัย มีประสบการณ์',
    skills_tags: ['พี่เลี้ยงเด็ก', 'เลี้ยงเด็ก', 'ดูแลเด็ก', 'Babysitter'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_46@test.com',
    full_name: 'ศิริพร โยคะ',
    role: 'freelancer' as const,
    bio_short: 'ครูโยคะ รับสอนโยคะ',
    bio_long: 'ครูโยคะมืออาชีพ รับสอนโยคะ กลุ่ม เดี่ยว งานคุณภาพ สุขภาพดี',
    skills_tags: ['โยคะ', 'สอนโยคะ', 'ออกกำลังกาย', 'Yoga'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_47@test.com',
    full_name: 'วรพล นวด',
    role: 'freelancer' as const,
    bio_short: 'หมอนวด รับนวดแผนไทย',
    bio_long: 'หมอนวดมืออาชีพ รับนวดแผนไทย นวดเพื่อสุขภาพ งานคุณภาพ ผ่อนคลาย',
    skills_tags: ['นวด', 'นวดแผนไทย', 'สุขภาพ', 'Massage'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_48@test.com',
    full_name: 'นันทนา ครูสอน',
    role: 'freelancer' as const,
    bio_short: 'ครูสอนพิเศษ รับสอนภาษา',
    bio_long: 'ครูสอนพิเศษมืออาชีพ รับสอนภาษา อังกฤษ ไทย งานคุณภาพ เข้าใจง่าย',
    skills_tags: ['สอนภาษา', 'ครูสอน', 'ภาษาอังกฤษ', 'Tutor'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_49@test.com',
    full_name: 'ธีระพงษ์ งานอีเวนต์',
    role: 'freelancer' as const,
    bio_short: 'Event Organizer รับจัดงานอีเวนต์',
    bio_long: 'Event Organizer มืออาชีพ รับจัดงานอีเวนต์ งานแต่งงาน งานเลี้ยง งานคุณภาพ',
    skills_tags: ['งานอีเวนต์', 'จัดงาน', 'Event', 'Party'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
  {
    email: 'freelance_50@test.com',
    full_name: 'สมเกียรติ งานถ่ายภาพ',
    role: 'freelancer' as const,
    bio_short: 'ช่างภาพ รับถ่ายภาพ งานแต่งงาน',
    bio_long: 'ช่างภาพมืออาชีพ รับถ่ายภาพ งานแต่งงาน งานอีเวนต์ งานคุณภาพ สวยงาม',
    skills_tags: ['ถ่ายภาพ', 'ช่างภาพ', 'งานแต่งงาน', 'Photography'],
    stats_completed_jobs: randomInt(0, 50),
    availability_status: randomAvailability(),
  },
]

// ============================================
// COMBINE ALL FREELANCERS
// ============================================
const allFreelancers = [
  ...homeLivingFreelancers,
  ...designFreelancers,
  ...marketingFreelancers,
  ...techFreelancers,
  ...lifestyleFreelancers,
]

// ============================================
// MAIN SEEDING FUNCTION
// ============================================
async function seedDummyUsers() {
  console.log('🌱 Starting database seeding...')
  console.log(`📊 Total freelancers to insert: ${allFreelancers.length}`)

  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < allFreelancers.length; i++) {
    const freelancer = allFreelancers[i]
    
    // Add avatar URL
    const freelancerData = {
      ...freelancer,
      avatar_url: generateAvatarUrl(i),
      is_duplicate_flag: false,
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .insert([freelancerData])
        .select()

      if (error) {
        console.error(`❌ Error inserting ${freelancer.email}:`, error.message)
        errorCount++
      } else {
        console.log(`✅ Inserted: ${freelancer.full_name} (${freelancer.email})`)
        successCount++
      }
    } catch (err) {
      console.error(`❌ Exception inserting ${freelancer.email}:`, err)
      errorCount++
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log('\n📈 Seeding Summary:')
  console.log(`✅ Success: ${successCount}`)
  console.log(`❌ Errors: ${errorCount}`)
  console.log(`📊 Total: ${allFreelancers.length}`)
  console.log('\n✨ Seeding completed!')
}

// ============================================
// RUN THE SCRIPT
// ============================================
if (require.main === module) {
  seedDummyUsers()
    .then(() => {
      console.log('🎉 All done!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Fatal error:', error)
      process.exit(1)
    })
}

export { seedDummyUsers, allFreelancers }
