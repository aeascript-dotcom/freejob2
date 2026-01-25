// Helper function to get item by index (deterministic, no random)
const getItemByIndex = <T,>(arr: T[], index: number): T => {
  return arr[index % arr.length]
}

// Helper function to get items by indices (deterministic, no random)
const getItemsByIndices = <T,>(arr: T[], indices: number[]): T[] => {
  return indices.map(idx => arr[idx % arr.length])
}

// Helper function to get local avatar path (deterministic, cycles through a1-a20)
const getLocalAvatar = (index: number): string => {
  const avatarNumber = (index % 20) + 1 // Cycle through 1-20
  return `/character/a${avatarNumber}.png`
}

// Provinces list - All 77 provinces of Thailand
export const PROVINCES = [
  "กรุงเทพมหานคร",
  "กระบี่",
  "กาญจนบุรี",
  "กาฬสินธุ์",
  "กำแพงเพชร",
  "ขอนแก่น",
  "จันทบุรี",
  "ฉะเชิงเทรา",
  "ชลบุรี",
  "ชัยนาท",
  "ชัยภูมิ",
  "ชุมพร",
  "เชียงราย",
  "เชียงใหม่",
  "ตรัง",
  "ตราด",
  "ตาก",
  "นครนายก",
  "นครปฐม",
  "นครพนม",
  "นครราชสีมา",
  "นครศรีธรรมราช",
  "นครสวรรค์",
  "นนทบุรี",
  "บึงกาฬ",
  "บุรีรัมย์",
  "ปทุมธานี",
  "ประจวบคีรีขันธ์",
  "ปราจีนบุรี",
  "ปัตตานี",
  "พระนครศรีอยุธยา",
  "พังงา",
  "พัทลุง",
  "พิจิตร",
  "พิษณุโลก",
  "เพชรบุรี",
  "เพชรบูรณ์",
  "แพร่",
  "ภูเก็ต",
  "มหาสารคาม",
  "มุกดาหาร",
  "แม่ฮ่องสอน",
  "ยะลา",
  "ยโสธร",
  "ร้อยเอ็ด",
  "ระนอง",
  "ระยอง",
  "ราชบุรี",
  "ลพบุรี",
  "ลำปาง",
  "ลำพูน",
  "เลย",
  "ศรีสะเกษ",
  "สกลนคร",
  "สงขลา",
  "สตูล",
  "สมุทรปราการ",
  "สมุทรสงคราม",
  "สมุทรสาคร",
  "สระแก้ว",
  "สระบุรี",
  "สิงห์บุรี",
  "สุโขทัย",
  "สุพรรณบุรี",
  "สุราษฎร์ธานี",
  "สุรินทร์",
  "หนองคาย",
  "หนองบัวลำภู",
  "อ่างทอง",
  "อำนาจเจริญ",
  "อุดรธานี",
  "อุตรดิตถ์",
  "อุทัยธานี",
  "อุบลราชธานี"
]

// Work style tags
export const WORK_STYLES = [
  "งานเร็ว",
  "งานละเอียด",
  "งานมีระบบ",
  "งานด่วน"
]

// Thai first names pool
const THAI_FIRST_NAMES = [
  'สมชาย', 'มานี', 'วิชัย', 'สุภาพร', 'ประเสริฐ', 'สมศักดิ์', 'วิไล', 'เกรียงไกร',
  'อาน้อย', 'แมททิว', 'สมเกียรติ', 'ปิยะดา', 'อรรถพล', 'กมลชนก', 'ธีรพงษ์', 'วราภรณ์',
  'อัครพงศ์', 'สุชาดา', 'พงศ์ศักดิ์', 'อรอนงค์', 'ชาญชัย', 'ปิยวรรณ', 'ธนพล', 'กัญญารัตน์',
  'อรรถพล', 'ศิริพร', 'วรพล', 'นันทนา', 'ธีระพงษ์', 'อารยา', 'ณัฐพล', 'ปิยะดา',
  'ศุภชัย', 'กมลชนก', 'ธีรพงษ์', 'วราภรณ์', 'อัครพงศ์', 'สุชาดา', 'พงศ์ศักดิ์', 'อรอนงค์',
  'รัตนา', 'ธนพล', 'อานนท์', 'กิตติ', 'ปกรณ์', 'วรวิทย์', 'ศุภชัย', 'กิตติพงษ์',
  'อภิชัย', 'กิตติศักดิ์', 'ปิยะ', 'วรพล', 'ศุภชัย', 'กิตติ', 'ปกรณ์', 'วรวิทย์'
]

// Thai last names pool
const THAI_LAST_NAMES = [
  'ใจดี', 'รักการออกแบบ', 'โปรแกรมเมอร์', 'คอนเทนต์', 'ทนาย', 'เดลิเวอรี่', 'ไกด์ทัวร์', 'จอง',
  'การช่าง', 'ไฟฟ้า', 'แอร์เย็น', 'ทำความสะอาด', 'ตกแต่ง', 'ช่างไม้', 'งานสี', 'ระบบน้ำ',
  'งานปูน', 'งานเหล็ก', 'ดีไซน์', 'แบนเนอร์', 'UX/UI', 'อิลลัส', 'แพ็คเกจจิ้ง', 'เว็บดีไซน์',
  'กราฟิก', 'อาร์ต', 'แบรนด์', 'มินิมอล', 'คอนเทนต์', 'แอดส์', 'SEO', 'อินฟลูเอนเซอร์',
  'คัดลอก', 'ทิกท็อก', 'รีวิว', 'โซเชียล', 'บล็อก', 'มาร์เก็ตติ้ง', 'เว็บดีฟ', 'แอป',
  'เวิร์ดเพรส', 'แบคเอนด์', 'ฟิก', 'ฟรอนต์เอนด์', 'ฟูลสแตก', 'พีเอชพี', 'ไพธอน', 'ดีบั๊ก'
]

// Bio templates by category
const BIO_TEMPLATES: Record<string, string[]> = {
  design: [
    'กราฟิกดีไซเนอร์มืออาชีพ รับออกแบบโลโก้ แบนเนอร์',
    'UX/UI Designer รับออกแบบเว็บไซต์ แอปพลิเคชัน',
    'Illustrator มืออาชีพ รับวาดภาพประกอบ อาร์ตเวิร์ค',
    'ดีไซเนอร์แพ็คเกจจิ้ง รับออกแบบบรรจุภัณฑ์ ผลิตภัณฑ์'
  ],
  marketing: [
    'Content Writer มืออาชีพ รับเขียนบทความ บล็อก',
    'Facebook Ads Specialist รับทำโฆษณา Facebook Instagram',
    'SEO Specialist รับทำ SEO เว็บไซต์ เพิ่มอันดับ Google',
    'Copywriter มืออาชีพ รับเขียนโฆษณา คัดลอกขาย'
  ],
  tech: [
    'Web Developer มืออาชีพ รับทำเว็บไซต์ React Next.js',
    'Mobile App Developer รับทำแอป iOS Android',
    'Backend Developer รับทำ API Server Node.js Python',
    'Full Stack Developer รับทำเว็บครบวงจร'
  ],
  home: [
    'ช่างประปามืออาชีพ รับซ่อมท่อน้ำ ตรวจระบบ',
    'ช่างไฟฟ้ามืออาชีพ รับเดินไฟใหม่ ตรวจระบบไฟฟ้า',
    'บริการล้างแอร์ทุกยี่ห้อ ตรวจเช็คระบบ',
    'แม่บ้านมืออาชีพ รับทำความสะอาดบ้าน คอนโด'
  ],
  lifestyle: [
    'หมอดูมืออาชีพ รับดูดวง โหราศาสตร์',
    'Personal Trainer รับเทรนฟิตเนส ออกกำลังกาย',
    'ช่างแต่งหน้ามืออาชีพ รับแต่งหน้า งานแต่งงาน',
    'ไกด์ทัวร์มืออาชีพ รับพาทัวร์ กรุงเทพ ต่างจังหวัด'
  ]
}

// Job Categories - Must be declared before generateMockFreelancers()
export const JOB_CATEGORIES = [
  { id: "cat_design", name: "กราฟิกและดีไซน์", slug: "design", tags: ["Logo Design", "Banner", "Packaging", "UX/UI", "Illustrator"] },
  { id: "cat_marketing", name: "การตลาดและโฆษณา", slug: "marketing", tags: ["Facebook Ads", "SEO", "Content Writing", "Influencer", "TikTok"] },
  { id: "cat_tech", name: "เว็บไซต์และโปรแกรมมิ่ง", slug: "tech", tags: ["Web Dev", "Mobile App", "WordPress", "Frontend", "Backend"] },
  { id: "cat_video", name: "วิดีโอและเสียง", slug: "video-audio", tags: ["Video Editing", "Voice Over", "Motion Graphic", "Sound Engineer"] },
  { id: "cat_home", name: "บ้านและที่อยู่อาศัย", slug: "home-living", tags: ["ช่างประปา", "ล้างแอร์", "เดินไฟ", "ทำความสะอาด", "ตกแต่งภายใน"] },
  { id: "cat_lifestyle", name: "ไลฟ์สไตล์", slug: "lifestyle", tags: ["ดูดวง", "เทรนเนอร์", "ช่างแต่งหน้า", "ไกด์", "พี่เลี้ยงเด็ก"] },
  { id: "cat_law", name: "กฎหมาย", slug: "law", tags: ["ทนายความ", "ร่างสัญญา", "ที่ปรึกษากฎหมาย", "จดทะเบียนทรัพย์สินทางปัญญา", "สืบทรัพย์บังคับคดี"] },
  { id: "cat_logistic", name: "ขนส่งและเดลิเวอรี่", slug: "logistic-delivery", tags: ["รับส่งของด่วน", "แมสเซนเจอร์", "ขนย้ายบ้าน/คอนโด", "รถกระบะรับจ้าง", "ขับรถผู้บริหาร"] },
  { id: "cat_travel", name: "ท่องเที่ยวและการเดินทาง", slug: "travel", tags: ["วางแผนเที่ยว", "ไกด์นำเที่ยว", "รถเช่าพร้อมคนขับ", "ทำวีซ่า", "จองที่พัก"] },
  { id: "cat_booking", name: "บริการจองและธุระ", slug: "booking-errands", tags: ["จองบัตรคอนเสิร์ต", "จองร้านอาหาร", "ต่อคิว", "รับหิ้วของ", "จ่ายบิล/ทำธุระแทน"] }
];

// Type definition for freelancer
type MockFreelancer = {
  id: string
  email: string
  full_name: string
  name: string
  role: string
  bio: string
  bio_short: string
  province: string
  work_style_tags: string[]
  skills_tags: string[]
  hourly_rate: number
  avatar_url: string
  availability_status: 'available' | 'busy'
  stats_completed_jobs: number
  created_at: string
}

/**
 * Generate mock freelancers programmatically (50-60 freelancers)
 */
function generateMockFreelancers(): MockFreelancer[] {
  const count = 60 // Generate 60 freelancers
  const freelancers = []
  
  // Collect all tags from all categories
  const allCategoryTags: string[] = []
  JOB_CATEGORIES.forEach(cat => {
    allCategoryTags.push(...cat.tags)
  })
  
  for (let i = 0; i < count; i++) {
    // Randomly select name
    const firstName = getItemByIndex(THAI_FIRST_NAMES, i)
    const lastName = getItemByIndex(THAI_LAST_NAMES, i)
    const fullName = `${firstName} ${lastName}`
    
    // Randomly select category (deterministic based on index)
    const categoryIndex = i % JOB_CATEGORIES.length
    const category = JOB_CATEGORIES[categoryIndex]
    
    // Randomly select 2-3 tags from the category (deterministic)
    const numTags = 2 + (i % 2) // Alternates between 2 and 3
    const categoryTags = [...category.tags]
    const selectedCategoryTags: string[] = []
    for (let j = 0; j < numTags && j < categoryTags.length; j++) {
      const tagIndex = (i * 3 + j) % categoryTags.length
      if (!selectedCategoryTags.includes(categoryTags[tagIndex])) {
        selectedCategoryTags.push(categoryTags[tagIndex])
      }
    }
    
    // Randomly select 1-2 work style tags
    const numWorkStyles = 1 + (i % 2) // Alternates between 1 and 2
    const selectedWorkStyles = getItemsByIndices(WORK_STYLES, [
      (i * 2) % WORK_STYLES.length,
      (i * 2 + 1) % WORK_STYLES.length
    ].slice(0, numWorkStyles))
    
    // Combine all tags
    const allTags = [...selectedCategoryTags, ...selectedWorkStyles]
    
    // Generate price between 500-10,000 THB (deterministic)
    const priceBase = 500
    const priceRange = 9500
    const price = priceBase + ((i * 157) % priceRange) // Use prime number for better distribution
    
    // Select province (deterministic)
    const province = getItemByIndex(PROVINCES, i)
    
    // Select avatar (cycles through a1-a20)
    const avatarUrl = getLocalAvatar(i)
    
    // Select availability (80% available pattern)
    const availabilityStatus = (i % 5 === 0) ? 'busy' : 'available'
    
    // Generate bio based on category
    const categorySlug = category.slug.split('-')[0] // Get base slug
    const bioTemplates = BIO_TEMPLATES[categorySlug] || BIO_TEMPLATES.design
    const bioTemplate = getItemByIndex(bioTemplates, i)
    const bio = bioTemplate
    const bioShort = bio.length > 50 ? bio.substring(0, 50) + '...' : bio
    
    // Generate stats (deterministic)
    const statsCompletedJobs = 5 + (i * 3) % 50
    
    freelancers.push({
      id: String(i + 1),
      email: `freelancer${i + 1}@example.com`,
      full_name: fullName,
      name: fullName,
      role: 'freelancer',
      bio: bio,
      bio_short: bioShort,
      province: province,
      work_style_tags: selectedWorkStyles,
      skills_tags: allTags,
      hourly_rate: price,
      avatar_url: avatarUrl,
      availability_status: availabilityStatus,
      stats_completed_jobs: statsCompletedJobs,
      created_at: '2024-01-01T00:00:00.000Z'
    })
  }
  
  return freelancers
}

export const mockFreelancers = generateMockFreelancers()
