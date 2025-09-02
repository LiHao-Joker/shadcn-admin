import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCategories } from '@/features/categories/components/categories-provider.tsx'

export function CategoriesPrimaryButtons() {
  const { setOpen } = useCategories()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>添加</span> <PlusCircle size={18} />
      </Button>
    </div>
  )
}
