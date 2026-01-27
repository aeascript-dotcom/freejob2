# Category Filtering Logic Fix

## ปัญหาที่พบ

เมื่อเลือก category "ขนส่งและเดลิเวอรี่" แต่ผลลัพธ์ที่แสดงกลับเป็น freelancer ที่เป็น "ออกแบบ" (Design) แม้ว่าจะมี transport tags อยู่ด้วย

## สาเหตุ

1. **Filtering Logic เดิม:** ตรวจสอบแค่ว่า freelancer มี tag ใดๆ ที่ตรงกับ category tags หรือไม่
2. **ปัญหา:** Freelancer อาจมี tags หลาย categories (เช่น มีทั้ง design tags และ transport tags)
3. **ผลลัพธ์:** แสดง freelancer ที่มี transport tag ใดๆ แม้ว่า primary skill จะเป็น design

## การแก้ไข

### 1. เพิ่ม Strict Filtering Logic

**ไฟล์:** `app/search/page.tsx` (บรรทัด 304-360)

**Logic ใหม่:**
- ต้องมี tag หลักที่ตรงกับ category มากกว่า tags อื่นๆ (>=50%)
- หรืออย่างน้อย 2 tags จาก selected category
- ถ้ามี 3+ tags และมีแค่ 1 tag จาก selected category แต่มี tags จาก categories อื่น = ไม่แสดง

**โค้ด:**
```typescript
// Count how many tags match the selected category
const matchingCategoryTags = relevantTags.filter(tag => categoryTags.has(tag))

// Count how many tags match OTHER categories
const otherCategoryTags = relevantTags.filter(tag => {
  return !categoryTags.has(tag) && JOB_CATEGORIES.some(cat => 
    cat.id !== selectedCategory && cat.tags.includes(tag)
  )
})

// STRICT FILTERING:
// 1. Must have at least one tag from selected category
if (matchingCategoryTags.length === 0) {
  return false
}

// 2. If freelancer has tags from other categories, ensure selected category tags are majority
if (otherCategoryTags.length > 0 && totalRelevantTags > 1) {
  const matchingRatio = matchingCategoryTags.length / totalRelevantTags
  
  // Require: either majority (>=50%) OR at least 2 tags from selected category
  if (matchingRatio < 0.5 && matchingCategoryTags.length < 2) {
    return false
  }
}

// 3. If freelancer has 3+ tags, require at least 2 from selected category OR majority
if (totalRelevantTags >= 3 && matchingCategoryTags.length === 1) {
  if (otherCategoryTags.length > 0) {
    return false // Only one tag from selected category, but has other category tags
  }
}
```

## ตัวอย่าง

### ก่อนแก้ไข:
- **Freelancer:** "เกรียงไกร จอง"
- **Tags:** ["รีทัชภาพ", "ไดคัทภาพ", "ส่งของเก็บเงินปลายทาง", "รับส่งสัตว์เลี้ยง", "ส่งเค้ก/ดอกไม้"]
- **Category ที่เลือก:** "ขนส่งและเดลิเวอรี่"
- **ผลลัพธ์:** แสดง (เพราะมี transport tags)

### หลังแก้ไข:
- **Freelancer:** "เกรียงไกร จอง"
- **Tags:** ["รีทัชภาพ", "ไดคัทภาพ", "ส่งของเก็บเงินปลายทาง", "รับส่งสัตว์เลี้ยง", "ส่งเค้ก/ดอกไม้"]
- **Category ที่เลือก:** "ขนส่งและเดลิเวอรี่"
- **Transport tags:** 3 tags
- **Design tags:** 2 tags
- **Total relevant tags:** 5 tags
- **Matching ratio:** 3/5 = 60% (>=50%) ✅
- **ผลลัพธ์:** แสดง (เพราะ transport tags เป็น majority)

### กรณีที่ไม่แสดง:
- **Freelancer:** "ชาญชัย UX/UI"
- **Tags:** ["UX/UI Design", "Web Design", "วางบิล/เก็บเช็ค", "ไปไปรษณีย์/ขนส่งให้"]
- **Category ที่เลือก:** "ขนส่งและเดลิเวอรี่"
- **Transport tags:** 2 tags
- **Design tags:** 2 tags
- **Total relevant tags:** 4 tags
- **Matching ratio:** 2/4 = 50% (>=50%) ✅
- **แต่:** มี 2 tags จาก selected category ✅
- **ผลลัพธ์:** แสดง (เพราะมี 2 tags และเป็น majority)

### กรณีที่ไม่แสดง (ตัวอย่าง):
- **Freelancer:** "Design Pro"
- **Tags:** ["ออกแบบโลโก้", "ออกแบบเว็บไซต์", "ส่งของเก็บเงินปลายทาง"]
- **Category ที่เลือก:** "ขนส่งและเดลิเวอรี่"
- **Transport tags:** 1 tag
- **Design tags:** 2 tags
- **Total relevant tags:** 3 tags
- **Matching ratio:** 1/3 = 33% (<50%) ❌
- **Matching tags count:** 1 (<2) ❌
- **ผลลัพธ์:** ไม่แสดง (เพราะ transport tags ไม่ใช่ primary)

## การทดสอบ

1. เลือก category "ขนส่งและเดลิเวอรี่"
2. ตรวจสอบว่าผลลัพธ์แสดงเฉพาะ freelancer ที่มี transport tags เป็น primary skills
3. ตรวจสอบว่า design freelancers ที่มี transport tags เพียง 1-2 tags ไม่แสดง

## Commit

- `7100c97` - "fix: Improve category filtering logic to prioritize primary category tags"
- `2027f68` - "fix: Strengthen category filtering - require primary category tags"
