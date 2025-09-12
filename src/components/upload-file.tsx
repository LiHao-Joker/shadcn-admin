import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { type UploadDto, uploadEndpoint } from '@/api'
import { FileImage } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { Input } from '@/components/ui/input.tsx'

interface UploadFileProps {
  defaultValue: string | null
  onChange: (value: UploadDto) => void
}

function UploadFile({ defaultValue, onChange }: UploadFileProps) {
  const [preview, setPreview] = useState<string | ArrayBuffer | null>('')

  useEffect(() => {
    setPreview(defaultValue)
  }, [defaultValue])

  const { mutateAsync } = useMutation({
    mutationFn: async (file: File) => {
      const res = await uploadEndpoint({
        body: {
          file,
        },
      })
      return res.data
    },
    onSuccess: (data) => {
      setPreview(data.removeUri)
      onChange(data)
    },
  })

  const onDrop = async (acceptedFiles: File[]) => {
    await mutateAsync(acceptedFiles[0])
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 1024 * 1024 * 10,
    accept: { 'image/png': [], 'image/jpg': [], 'image/jpeg': [] },
  })

  return (
    <div
      {...getRootProps()}
      className='mx-auto flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-lg border p-8'
    >
      {preview && (
        <img
          className={`min-w-50 border object-cover`}
          src={preview as string}
          alt='上传图片预览'
        />
      )}
      <FileImage className={`size-40 ${preview ? 'hidden' : 'block'}`} />
      <Input {...getInputProps()} type='file' />
      {isDragActive ? (
        <p>释放图片即可上传！</p>
      ) : (
        <p>点击此处或拖拽图片至此处上传</p>
      )}
    </div>
  )
}

export default UploadFile
