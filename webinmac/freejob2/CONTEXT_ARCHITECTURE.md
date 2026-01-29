# Context Architecture Documentation

## Overview

โปรเจค Freejob2 ใช้ **React Context API** สำหรับจัดการ global state แบบ centralized และเตรียมพร้อมสำหรับการ migrate ไปยัง backend จริง

## Context Providers Structure

### Provider Hierarchy (ลำดับสำคัญ)

```tsx
<FontSizeProvider>        // 1. Base - Font size preferences
  <AuthProvider>          // 2. Authentication state
    <LineProvider>        // 3. LINE connect & admin chat (needs Auth; triggers toasts)
      <ToastProvider>     // 4. Global notifications
        <SearchProvider>  // 5. Search & filter state
          <FreelancerProvider>  // 6. Freelancer profile data
            {children}
            <GlobalToastContainer />
            <LineToastBridge />
          </FreelancerProvider>
        </SearchProvider>
      </ToastProvider>
    </LineProvider>
  </AuthProvider>
</FontSizeProvider>
```

**เหตุผลในการเรียงลำดับ:**
- `FontSizeProvider` อยู่ชั้นนอกสุด เพราะเป็น UI preference ที่ไม่ขึ้นกับ business logic
- `AuthProvider` อยู่ก่อน `FreelancerProvider` เพราะ freelancer data ต้องใช้ auth state
- `LineProvider` อยู่หลัง `AuthProvider` (ก่อน `ToastProvider`) เพราะ LINE features อาจใช้ auth; ส่ง toast ผ่าน `LineToastBridge` ที่อยู่ใน `ToastProvider`
- `ToastProvider` อยู่ก่อน `SearchProvider` และ `FreelancerProvider` เพื่อให้ components สามารถแสดง toast ได้
- `SearchProvider` และ `FreelancerProvider` อยู่ชั้นในสุด เพราะเป็น business logic ที่ซับซ้อน

## Context Details

### 1. FontSizeContext (`context/font-size-context.tsx`)

**หน้าที่:** จัดการขนาดฟอนต์ของทั้งแอปพลิเคชัน

**State:**
- `fontSize`: 'small' | 'medium' | 'large'
- `setFontSize`: Function to change font size

**Features:**
- Persist to localStorage (`user-font-pref`)
- Smooth transition animation
- Global scaling via `document.documentElement.style.fontSize`

**Usage:**
```tsx
import { useFontSize } from '@/context/font-size-context'

function MyComponent() {
  const { fontSize, setFontSize } = useFontSize()
  
  return (
    <button onClick={() => setFontSize('large')}>
      ก++ (Large)
    </button>
  )
}
```

**Migration Note:** ไม่ต้องเปลี่ยนเมื่อ migrate ไป backend

---

### 2. AuthContext (`context/auth-context.tsx`)

**หน้าที่:** จัดการ authentication state แบบ global

**State:**
- `user`: AuthUser | null
- `loading`: boolean
- `isAuthenticated`: boolean
- `login(email, password)`: Promise<boolean>
- `logout()`: Promise<void>
- `refreshUser()`: void

**Features:**
- Auto-sync with localStorage
- Listen for storage events (multi-tab sync)
- Type-safe user object

**Usage:**
```tsx
import { useAuth } from '@/context/auth-context'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()
  
  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />
  }
  
  return <div>Welcome, {user?.name}</div>
}
```

**Migration Guide:**
```typescript
// [MOCK-ONLY] Current
const success = loginMock()

// [TODO] Replace with:
const { data, error } = await supabase.auth.signInWithPassword({ email, password })
if (error) throw error
setUser(data.user)
```

---

### 3. ToastContext (`context/toast-context.tsx`)

**หน้าที่:** จัดการ global notifications/toasts

**State:**
- `toasts`: Toast[]
- `showToast(message, type?, duration?)`: void
- `removeToast(id)`: void
- `clearAllToasts()`: void

**Toast Types:**
- `'success'` - Green background
- `'error'` - Red background
- `'warning'` - Yellow background
- `'info'` - Blue background

**Usage:**
```tsx
import { useToast } from '@/context/toast-context'

function MyComponent() {
  const { showToast } = useToast()
  
  const handleSave = async () => {
    try {
      await saveData()
      showToast('บันทึกสำเร็จ', 'success')
    } catch (error) {
      showToast('เกิดข้อผิดพลาด', 'error')
    }
  }
}
```

**UI Component:**
- `<GlobalToastContainer />` - Render all toasts (placed in root layout)

**Migration Note:** ไม่ต้องเปลี่ยนเมื่อ migrate ไป backend

---

### 4. LineContext (`context/line-context.tsx`)

**หน้าที่:** LINE connect / disconnect และแชทกับแอดมิน (Mock)

**State:**
- `isLineConnected`: boolean (sync กับ localStorage `line_connected`)
- `lineProfile`: `{ displayName, pictureUrl } | null`
- `adminMessages`: `Array<{ id, text, sender: 'user'|'admin', timestamp }>`

**Actions:**
- `connectLine()`: เรียก LINE service → อัปเดต state + localStorage → แสดง toast "เชื่อมต่อ LINE สำเร็จ"
- `disconnectLine()`: ล้าง state และ localStorage
- `sendMessageToAdmin(text)`: เพิ่มข้อความ user → ส่ง mock → หลัง 2s เพิ่ม auto-reply แอดมิน → แสดง toast "ส่งข้อความแล้ว"

**Toast Bridge:** `LineProvider` อยู่เหนือ `ToastProvider` จึงใช้ custom event `line-toast` และ `<LineToastBridge />` (ภายใน `ToastProvider`) ฟังแล้วเรียก `showToast`

**Usage:**
```tsx
import { useLine } from '@/context/line-context'

function LineSettings() {
  const { isLineConnected, lineProfile, connectLine, disconnectLine, sendMessageToAdmin } = useLine()
  // ...
}
```

**Migration Note:** แทนที่ `lib/line-service` mock ด้วย Supabase / LINE Messaging API

---

### 5. SearchContext (`context/search-context.tsx`)

**หน้าที่:** จัดการ search state (categories, tags, query)

**State:**
- `selectedCategory`: string | null (single-select)
- `setSelectedCategory(category)`: void
- `selectedTags`: string[] (multi-select)
- `setSelectedTags(tags)`: void
- `addTag(tag)`: void
- `removeTag(tag)`: void
- `clearTags()`: void
- `searchQuery`: string
- `setSearchQuery(query)`: void
- `clearAllFilters()`: void

**Usage:**
```tsx
import { useSearch } from '@/context/search-context'

function SearchPage() {
  const { 
    selectedCategory, 
    setSelectedCategory,
    selectedTags,
    addTag,
    searchQuery,
    setSearchQuery
  } = useSearch()
  
  return (
    <div>
      <input 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
      />
      <button onClick={() => addTag('Graphic Design')}>
        Add Tag
      </button>
    </div>
  )
}
```

**Migration Note:** สามารถ persist search state ไปยัง URL query params หรือ localStorage ได้

---

### 6. FreelancerContext (`context/freelancer-context.tsx`)

**หน้าที่:** จัดการ freelancer profile data

**State:**
- `currentFreelancer`: User | null
- `loading`: boolean
- `updateProfile(updates)`: Promise<void>
- `refreshProfile()`: void

**Features:**
- Auto-load on mount
- Sync with localStorage (mock)
- Type-safe with User interface

**Usage:**
```tsx
import { useFreelancer } from '@/context/freelancer-context'

function SettingsPage() {
  const { currentFreelancer, updateProfile, loading } = useFreelancer()
  
  const handleSave = async () => {
    await updateProfile({
      full_name: 'New Name',
      bio_long: 'New bio'
    })
  }
  
  if (loading) return <div>Loading...</div>
  
  return <form>{/* ... */}</form>
}
```

**Migration Guide:**
```typescript
// [MOCK-ONLY] Current
const updated = updateFreelancer(id, updates)

// [TODO] Replace with:
const { data, error } = await supabase
  .from('users')
  .update(updates)
  .eq('id', id)
  .select()
  .single()
if (error) throw error
setCurrentFreelancer(data)
```

---

## Service Layer Pattern

### Principle

**UI Components NEVER call localStorage/API directly.**  
All data operations go through service layer functions.

### Example: `lib/freelancer-service.ts`

```typescript
// ✅ CORRECT: Component calls service
import { updateFreelancer } from '@/lib/freelancer-service'
await updateFreelancer(id, updates)

// ❌ WRONG: Component calls localStorage directly
localStorage.setItem('freelancers', JSON.stringify(data))
```

### Migration Strategy

1. **Mark mock code clearly:**
   ```typescript
   // [MOCK-ONLY] Start
   localStorage.setItem(key, value)
   // [MOCK-ONLY] End
   ```

2. **Add TODO comments:**
   ```typescript
   // TODO: Replace with:
   // const { data } = await supabase.from('users').update(...)
   ```

3. **Keep function signatures unchanged:**
   - UI components don't need to change
   - Only service layer implementation changes

---

## Best Practices

### 1. Context Usage

✅ **DO:**
- Use context for truly global state
- Keep context focused (one responsibility)
- Use custom hooks (`useAuth`, `useToast`) for type safety

❌ **DON'T:**
- Create context for component-local state
- Put everything in one giant context
- Access context outside provider (will throw error)

### 2. Performance

- Use `useMemo` for expensive computations
- Use `useCallback` for functions passed to children
- Split contexts to avoid unnecessary re-renders

### 3. Error Handling

- All context hooks throw error if used outside provider
- Always wrap providers in try-catch if needed
- Show user-friendly error messages via ToastContext

### 4. Type Safety

- All contexts export TypeScript interfaces
- Use type guards for data validation
- Strict type checking prevents runtime errors

---

## Migration Checklist

เมื่อพร้อม migrate ไป backend จริง:

- [ ] Replace `auth-mock.ts` with Supabase Auth
- [ ] Replace `freelancer-service.ts` localStorage calls with Supabase queries
- [ ] Update `AuthContext.login()` to use Supabase
- [ ] Update `FreelancerContext.updateProfile()` to use Supabase
- [ ] Remove `[MOCK-ONLY]` comments
- [ ] Remove `lib/dummy-freelancers.ts` and `lib/mock-data.ts`
- [ ] Update image upload to use Supabase Storage
- [ ] Test all context functionality with real data

---

## File Structure

```
context/
  ├── auth-context.tsx          # Authentication state
  ├── font-size-context.tsx     # Font size preferences
  ├── freelancer-context.tsx    # Freelancer profile data
  ├── search-context.tsx        # Search & filter state
  └── toast-context.tsx         # Global notifications

lib/
  ├── auth-mock.ts              # [MOCK] Auth functions
  ├── freelancer-service.ts     # [MOCK] Freelancer CRUD
  └── ...

components/
  └── ui/
      └── global-toast-container.tsx  # Toast UI component
```

---

## Summary

Context Architecture ของ Freejob2 ถูกออกแบบมาเพื่อ:

1. **Centralized State Management** - State อยู่ที่เดียว แก้ไขง่าย
2. **Type Safety** - TypeScript interfaces ป้องกัน errors
3. **Easy Migration** - Service layer pattern ช่วยให้ migrate ง่าย
4. **Developer Experience** - Custom hooks ทำให้ใช้งานง่าย
5. **Performance** - Split contexts ลด unnecessary re-renders

**Next Steps:**
- อ่าน code ใน `context/` folder เพื่อดู implementation
- ใช้ custom hooks (`useAuth`, `useToast`, etc.) ใน components
- อย่าเรียก localStorage/API โดยตรง ใช้ service layer แทน
