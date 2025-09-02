import React, { useState } from 'react'
import { type CategoryDto } from '@/api'
import useDialogState from '@/hooks/use-dialog-state.tsx'

type CategoriesDialogType = 'add' | 'edit' | 'delete' | 'status'

type CategoriesContextType = {
  open: CategoriesDialogType | null
  setOpen: (str: CategoriesDialogType | null) => void
  currentRow: CategoryDto | null
  setCurrentRow: React.Dispatch<React.SetStateAction<CategoryDto | null>>
}

const CategoriesContext = React.createContext<CategoriesContextType | null>(
  null
)

export function CategoriesProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<CategoriesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<CategoryDto | null>(null)

  return (
    <CategoriesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CategoriesContext>
  )
}

export const useCategories = () => {
  const categoriesContext = React.useContext(CategoriesContext)

  if (!categoriesContext) {
    throw new Error('useCategories has to be used within <CategoriesContext>')
  }

  return categoriesContext
}
