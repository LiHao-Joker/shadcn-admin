import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDishes } from '@/features/dishes/components/dishes-provider.tsx'

export function DishPrimaryButtons() {
  const { setOpen } = useDishes()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>添加</span> <PlusCircle size={18} />
      </Button>
    </div>
  )
}
