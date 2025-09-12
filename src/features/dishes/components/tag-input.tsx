import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge.tsx'

interface TagInputProps {
  defaultValue: string | Array<string>
  onChange: (value: string | Array<string>) => void
  className?: string
}

function TagInput({ defaultValue, onChange, className }: TagInputProps) {
  const [tags, setTags] = useState<Array<string>>([])
  const [showInput, setShowInput] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')

  useEffect(() => {
    if (!Array.isArray(defaultValue)) {
      if (defaultValue?.trim()) {
        setTags(defaultValue?.trim().split(','))
      }
    } else {
      setTags(defaultValue)
    }
  }, [defaultValue])

  const handleInputConfirm = (value: string) => {
    if (value?.trim()) {
      const newTags = [...tags, value.trim()]
      setTags(newTags)
      onChange(newTags)
    }
    setInput('')
    setShowInput(false)
  }

  return (
    <div className={className}>
      <div className='flex flex-wrap items-center justify-start gap-1'>
        {tags?.map(
          (tag, index) =>
            tag?.trim() && (
              <Badge
                key={index}
                onClick={() => {
                  const newTags = tags.filter((_, i) => i !== index)
                  setTags(newTags)
                  onChange(newTags)
                }}
              >
                {tag?.trim()} <X />
              </Badge>
            )
        )}
      </div>

      {showInput ? (
        <input
          className='max-w-20 border'
          type='text'
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
          }}
          onBlur={(e) => {
            handleInputConfirm(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleInputConfirm(e.currentTarget.value)
            }
          }}
        />
      ) : (
        <Badge
          variant='outline'
          onClick={() => {
            setShowInput(true)
          }}
        >
          +
        </Badge>
      )}
    </div>
  )
}

export default TagInput
