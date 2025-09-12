import React, { useState } from 'react'
import { type DishDto } from '@/api'
import useDialogState from '@/hooks/use-dialog-state.tsx'

type DishesDialogType = 'add' | 'edit' | 'delete' | 'status'

type DishesContextType = {
  open: DishesDialogType | null
  setOpen: (str: DishesDialogType | null) => void
  currentRow: DishDto | null
  setCurrentRow: React.Dispatch<React.SetStateAction<DishDto | null>>
}

const DishesContext = React.createContext<DishesContextType | null>(null)

export function DishesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DishesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<DishDto | null>(null)

  return (
    <DishesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </DishesContext>
  )
}

export const useDishes = () => {
  const dishesContext = React.useContext(DishesContext)

  if (!dishesContext) {
    throw new Error('useDishes has to be used with in <DishesContext>')
  }

  return dishesContext
}
