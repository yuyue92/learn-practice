import React, { useState, useRef } from 'react'
import {
  Box,
  Button,
  Typography,
  Paper,
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import {
  CloudUpload,
  Delete,
  PhotoCamera,
  Close,
  Image as ImageIcon
} from '@mui/icons-material'
import axios from 'axios'

interface UploadedFile {
  originalName: string
  filename: string
  size: number
  url: string
}

interface ImageUploadProps {
  mode?: 'avatar' | 'multiple'
  currentImage?: string | null
  onUploadSuccess?: (files: UploadedFile | UploadedFile[]) => void
  onUploadError?: (error: string) => void
  maxFiles?: number
  accept?: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  mode = 'multiple',
  currentImage = null,
  onUploadSuccess,
  onUploadError,
  maxFiles = 10,
  accept = 'image/*'
}) => {
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    // 验证文件类型
    for (let i = 0; i < files.length; i++) {
      if (!files[i].type.startsWith('image/')) {
        setError('只能上传图片文件')
        return
      }
      // 验证文件大小 (5MB)
      if (files[i].size > 5 * 1024 * 1024) {
        setError('文件大小不能超过5MB')
        return
      }
    }

    setError(null)
    setUploading(true)

    try {
      const formData = new FormData()
      
      if (mode === 'avatar') {
        formData.append('avatar', files[0])
        const response = await axios.post('/api/upload/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        
        const uploadedFile = response.data.file
        setUploadedFiles([uploadedFile])
        onUploadSuccess?.(uploadedFile)
      } else {
        // 多文件上传
        for (let i = 0; i < Math.min(files.length, maxFiles); i++) {
          formData.append('files', files[i])
        }
        
        const response = await axios.post('/api/upload/files', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        
        const newFiles = response.data.files
        setUploadedFiles(prev => [...prev, ...newFiles])
        onUploadSuccess?.(newFiles)
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || '上传失败'
      setError(errorMessage)
      onUploadError?.(errorMessage)
    } finally {
      setUploading(false)
      // 重置文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveFile = async (filename: string) => {
    try {
      await axios.delete(`/api/upload/${filename}`)
      setUploadedFiles(prev => prev.filter(file => file.filename !== filename))
    } catch (err) {
      setError('删除文件失败')
    }
  }

  const handlePreview = (imageUrl: string) => {
    setPreviewImage(`http://localhost:5000${imageUrl}`)
    setPreviewOpen(true)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  if (mode === 'avatar') {
    return (
      <Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={uploadedFiles[0]?.url ? `http://localhost:5000${uploadedFiles[0].url}` : currentImage}
            sx={{ width: 120, height: 120, cursor: 'pointer' }}
            onClick={() => uploadedFiles[0]?.url && handlePreview(uploadedFiles[0].url)}
          >
            {!uploadedFiles[0]?.url && !currentImage && <PhotoCamera sx={{ fontSize: 40 }} />}
          </Avatar>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
              onClick={triggerFileInput}
              disabled={uploading}
            >
              {uploading ? '上传中...' : '选择头像'}
            </Button>
            
            {(uploadedFiles[0]?.url || currentImage) && (
              <IconButton
                color="error"
                onClick={() => uploadedFiles[0] && handleRemoveFile(uploadedFiles[0].filename)}
                disabled={uploading}
              >
                <Delete />
              </IconButton>
            )}
          </Box>
        </Box>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* 预览对话框 */}
        <Dialog
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          maxWidth="md"
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            图片预览
            <IconButton onClick={() => setPreviewOpen(false)}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ textAlign: 'center' }}>
              <img
                src={previewImage}
                alt="预览"
                style={{ maxWidth: '100%', maxHeight: '500px' }}
              />
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    )
  }

  return (
    <Box>
      {/* 上传区域 */}
      <Paper
        sx={{
          p: 3,
          border: '2px dashed',
          borderColor: 'primary.main',
          borderRadius: 2,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: 'background.paper',
          '&:hover': {
            bgcolor: 'action.hover'
          }
        }}
        onClick={triggerFileInput}
      >
        <ImageIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {uploading ? '上传中...' : '点击选择图片文件'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          支持 JPG、PNG、GIF 格式，最大 5MB，最多 {maxFiles} 个文件
        </Typography>
        
        {uploading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        )}
      </Paper>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={mode === 'multiple'}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* 已上传文件列表 */}
      {uploadedFiles.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            已上传文件 ({uploadedFiles.length})
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {uploadedFiles.map((file) => (
              <Paper key={file.filename} sx={{ p: 2, minWidth: 200 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={`http://localhost:5000${file.url}`}
                    sx={{ width: 60, height: 60, cursor: 'pointer' }}
                    onClick={() => handlePreview(file.url)}
                  >
                    <ImageIcon />
                  </Avatar>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" noWrap>
                      {file.originalName}
                    </Typography>
                    <Chip
                      label={formatFileSize(file.size)}
                      size="small"
                      variant="outlined"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleRemoveFile(file.filename)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
      )}

      {/* 预览对话框 */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          图片预览
          <IconButton onClick={() => setPreviewOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center' }}>
            <img
              src={previewImage}
              alt="预览"
              style={{ maxWidth: '100%', maxHeight: '500px' }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default ImageUpload