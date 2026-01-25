'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  getMockCategories,
  createMockCategory,
  updateMockCategory,
  deleteMockCategory,
} from '@/lib/mock-categories'
import { Plus, Edit, Trash2, X } from 'lucide-react'
import type { JobCategory } from '@/types/database'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<JobCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<JobCategory | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    tags: [] as string[],
  })
  const [newTag, setNewTag] = useState('')

  // Load categories
  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = () => {
    try {
      setLoading(true)
      // Simulate async loading
      setTimeout(() => {
        const data = getMockCategories()
        setCategories(data)
        setLoading(false)
      }, 300)
    } catch (error) {
      console.error('Error loading categories:', error)
      alert('Failed to load categories')
      setLoading(false)
    }
  }

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  // Handle form changes
  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: editingCategory ? formData.slug : generateSlug(name),
    })
  }

  // Add tag
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      })
      setNewTag('')
    }
  }

  // Remove tag
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    })
  }

  // Open dialog for new category
  const handleNewCategory = () => {
    setEditingCategory(null)
    setFormData({ name: '', slug: '', tags: [] })
    setIsDialogOpen(true)
  }

  // Open dialog for editing
  const handleEditCategory = (category: JobCategory) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      tags: category.tags || [],
    })
    setIsDialogOpen(true)
  }

  // Save category
  const handleSave = () => {
    if (!formData.name.trim() || !formData.slug.trim()) {
      alert('Please fill in name and slug')
      return
    }

    try {
      if (editingCategory) {
        // Update existing
        const updated = updateMockCategory(editingCategory.id, {
          name: formData.name,
          slug: formData.slug,
          tags: formData.tags,
        })
        if (!updated) {
          throw new Error('Category not found')
        }
      } else {
        // Create new
        createMockCategory({
          name: formData.name,
          slug: formData.slug,
          tags: formData.tags,
        })
      }

      setIsDialogOpen(false)
      loadCategories()
    } catch (error) {
      console.error('Error saving category:', error)
      const message = error instanceof Error ? error.message : 'Failed to save category'
      alert(message)
    }
  }

  // Delete category
  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return
    }

    try {
      const success = deleteMockCategory(id)
      if (!success) {
        throw new Error('Category not found')
      }
      loadCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      const message = error instanceof Error ? error.message : 'Failed to delete category'
      alert(message)
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories & Tags</h1>
          <p className="text-gray-600 mt-2">Manage job categories and their associated tags</p>
        </div>
        <Button onClick={handleNewCategory}>
          <Plus className="w-4 h-4 mr-2" />
          New Category
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading categories...</div>
      ) : categories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No categories yet. Create your first category!
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription className="mt-1">/{category.slug}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {category.tags && category.tags.length > 0 ? (
                    category.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">No tags</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'Update the category information and tags'
                : 'Add a new job category with associated tags'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Name */}
            <div>
              <label className="text-sm font-medium mb-2 block">Category Name</label>
              <Input
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., Graphic Design"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="text-sm font-medium mb-2 block">Slug (URL-friendly)</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g., graphic-design"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-medium mb-2 block">Tags</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                  placeholder="Add a tag and press Enter"
                />
                <Button type="button" onClick={handleAddTag}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[60px] p-3 border rounded-md">
                {formData.tags.length > 0 ? (
                  formData.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">No tags added yet</span>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
