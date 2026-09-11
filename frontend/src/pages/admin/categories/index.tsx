import { useEffect, useState } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { createCategory, getApiError, getCategories, updateCategory, type Category } from "@/lib/client"
import AdminPage, { AdminState } from "@/pages/admin/AdminPage"

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState("")
  const [error, setError] = useState("")

  useEffect(() => { getCategories().then(setCategories).catch((requestError) => setError(getApiError(requestError, "Unable to load categories."))) }, [])

  const addCategory = async () => {
    if (!name.trim()) return
    try { const category = await createCategory(name.trim()); setCategories((current) => [...current, category].sort((a, b) => a.name.localeCompare(b.name))); setName(""); toast.success("Category created.") } catch (requestError) { toast.error(getApiError(requestError, "Unable to create category.")) }
  }

  const saveCategory = async (id: number) => {
    if (!editingName.trim()) return
    try { const category = await updateCategory(id, editingName.trim()); setCategories((current) => current.map((item) => item.id === id ? category : item)); setEditingId(null); toast.success("Category updated.") } catch (requestError) { toast.error(getApiError(requestError, "Unable to update category.")) }
  }

  const removeCategory = async (id: number) => {
    if (!window.confirm("Delete this category?")) return
    try { await api.delete(`/categories/${id}`); setCategories((current) => current.filter((category) => category.id !== id)); toast.success("Category deleted.") } catch (requestError) { toast.error(getApiError(requestError, "Unable to delete category.")) }
  }

  return <AdminPage title="Categories" description="Maintain the categories used by lost and found reports."><div className="mb-6 flex max-w-xl gap-2"><input value={name} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void addCategory() }} placeholder="New category name" className="flex-1 rounded-lg border border-[#E2DDD0] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#E3963E]" /><button type="button" onClick={() => void addCategory()} className="flex items-center gap-2 rounded-lg bg-[#E3963E] px-4 py-2.5 text-sm font-semibold text-white"><Plus size={15} /> Add</button></div>{error ? <AdminState error>{error}</AdminState> : categories.length === 0 ? <AdminState>No categories found.</AdminState> : <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{categories.map((category, index) => <div key={category.id} className="rounded-xl border border-[#E2DDD0] bg-white p-4">{editingId === category.id ? <div className="flex gap-2"><input autoFocus value={editingName} onChange={(event) => setEditingName(event.target.value)} className="min-w-0 flex-1 rounded border border-[#E2DDD0] px-2 py-1 text-sm" /><button type="button" onClick={() => void saveCategory(category.id)} className="text-xs font-semibold text-[#3F6C63]">Save</button></div> : <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm font-semibold text-[#1B2430]"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ["#3F6C63", "#E3963E", "#B6503A", "#7A7568", "#1B2430"][index % 5] }} />{category.name}</div><div className="flex gap-1"><button type="button" title="Edit category" onClick={() => { setEditingId(category.id); setEditingName(category.name) }} className="p-1.5 text-[#83796A] hover:text-[#C97A28]"><Pencil size={14} /></button><button type="button" title="Delete category" onClick={() => void removeCategory(category.id)} className="p-1.5 text-[#B6503A]"><Trash2 size={14} /></button></div></div>}</div>)}</div>}</AdminPage>
}