import { FullImageUpload, FullImageUploadProps } from '@/features/imageFlow/ui/fullImageUpload/FullImageUpload'

type StepUploadProps = {
  onNext?: (files: File[]) => void
  onFilesSelected?: (files: File[]) => void
  jumpToStep?: (step: string) => void
  currentStep?: string
  isProcessing?: boolean
  setProcessing?: (processing: boolean) => void
} & Partial<FullImageUploadProps>

export const StepUpload = ({ onNext, onFilesSelected, jumpToStep, ...props }: StepUploadProps) => {
  const handleFilesSelected = (files: File[]) => {
    if (onFilesSelected) {
      onFilesSelected(files)
    }

    if (onNext) {
      onNext(files)
    }
  }

  return (
    <FullImageUpload
      onFilesSelected={handleFilesSelected}
      placeholder="Drag and drop your image here or click to browse"
      dragPlaceholder="Drop the image here"
      primaryButtonText="Select from Computer"
      showDraftButton={false}
      {...props}
    />
  )
}
