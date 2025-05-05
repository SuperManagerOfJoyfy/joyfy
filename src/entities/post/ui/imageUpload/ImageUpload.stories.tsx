import React, { useState } from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { ImageUpload } from './ImageUpload'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const meta: Meta<typeof ImageUpload> = {
  title: 'entities/ImageUpload',
  tags: ['autodocs'],
  component: ImageUpload,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof ImageUpload>

const ImageUploadDemo = () => {
  const [files, setFiles] = useState<File[]>([])

  const handleFilesSelected = (selectedFiles: File[]) => {
    console.log('Files selected:', selectedFiles)
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles])
  }

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  }

  const dropzoneStyle = (isDragActive: boolean) => ({
    border: `2px dashed ${isDragActive ? '#3B82F6' : '#D1D5DB'}`,
    borderRadius: '8px',
    padding: '24px',
    textAlign: 'center' as const,
    cursor: 'pointer',
    width: '300px',
    height: '150px',
    backgroundColor: isDragActive ? '#EFF6FF' : 'transparent',
  })

  const innerContainerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  }

  const titleStyle = {
    marginBottom: '8px',
    fontWeight: 500,
  }

  const subtitleStyle = {
    fontSize: '14px',
    color: '#6B7280',
  }

  const filesContainerStyle = {
    marginTop: '16px',
  }

  const filesHeaderStyle = {
    fontWeight: 500,
  }

  const fileListStyle = {
    listStyleType: 'disc',
    paddingLeft: '20px',
    marginTop: '8px',
  }

  return (
    <div style={containerStyle}>
      <ImageUpload
        onFilesSelected={handleFilesSelected}
        maxFileSize={5}
        maxImages={10}
        acceptedTypes={['image/jpeg', 'image/png']}
        validateCurrentCount={files.length}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div {...getRootProps()} style={dropzoneStyle(isDragActive)}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop files here...</p>
            ) : (
              <div style={innerContainerStyle}>
                <p style={titleStyle}>
                  <span>Click to upload</span> or drag and drop
                </p>
                <p style={subtitleStyle}>PNG, JPG (Max: 5MB)</p>
              </div>
            )}
          </div>
        )}
      </ImageUpload>

      {files.length > 0 && (
        <div style={filesContainerStyle}>
          <h3 style={filesHeaderStyle}>Uploaded files ({files.length})</h3>
          <ul style={fileListStyle}>
            {files.map((file, index) => (
              <li key={index}>
                {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
              </li>
            ))}
          </ul>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  )
}

export const Default: Story = {
  render: () => <ImageUploadDemo />,
}
