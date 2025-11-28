'use client';

import { useState, useRef } from 'react';
import { gsap } from 'gsap';
import toast from 'react-hot-toast';

const ImageUploader = ({ images = [], onImagesChange }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    const fileArray = Array.from(files);
    
    // Validate file types
    const validFiles = fileArray.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isImage) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    const uploadingToast = toast.loading(`Uploading ${validFiles.length} image(s)...`);

    try {
      const formData = new FormData();
      
      if (validFiles.length === 1) {
        // Single file upload
        formData.append('file', validFiles[0]);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          const newImage = {
            id: Math.random().toString(36).substr(2, 9),
            preview: data.data.url,
            url: data.data.url,
            publicId: data.data.publicId,
            name: validFiles[0].name,
            size: validFiles[0].size,
            width: data.data.width,
            height: data.data.height
          };

          onImagesChange([...images, newImage]);
          toast.success('Image uploaded successfully!', { id: uploadingToast });
        } else {
          throw new Error(data.error || 'Upload failed');
        }
      } else {
        // Multiple files upload
        validFiles.forEach(file => formData.append('files', file));
        
        const response = await fetch('/api/upload/multiple', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          const newImages = data.data.map((img, idx) => ({
            id: Math.random().toString(36).substr(2, 9),
            preview: img.url,
            url: img.url,
            publicId: img.publicId,
            name: validFiles[idx].name,
            size: validFiles[idx].size,
            width: img.width,
            height: img.height
          }));

          onImagesChange([...images, ...newImages]);
          toast.success(`${data.count} images uploaded successfully!`, { id: uploadingToast });
        } else {
          throw new Error(data.error || 'Upload failed');
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload images', { id: uploadingToast });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async (imageId) => {
    const imageToRemove = images.find(img => img.id === imageId);
    
    if (imageToRemove?.publicId) {
      // Delete from Cloudinary
      try {
        const response = await fetch(`/api/upload?publicId=${imageToRemove.publicId}`, {
          method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
          toast.success('Image deleted from cloud');
        }
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete from cloud, but removed from list');
      }
    }

    // Remove preview URL if it's a local blob
    if (imageToRemove?.preview && imageToRemove.preview.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    onImagesChange(images.filter(img => img.id !== imageId));
  };

  const handleSetMainImage = (imageId) => {
    const imageIndex = images.findIndex(img => img.id === imageId);
    if (imageIndex > 0) {
      const newImages = [...images];
      const [movedImage] = newImages.splice(imageIndex, 1);
      newImages.unshift(movedImage);
      onImagesChange(newImages);
      toast.success('Main image updated');
    }
  };

  // Add image URL manually
  const [imageUrl, setImageUrl] = useState('');

  const handleAddImageUrl = () => {
    if (imageUrl.trim()) {
      const newImage = {
        id: Math.random().toString(36).substr(2, 9),
        preview: imageUrl.trim(),
        url: imageUrl.trim(),
        name: 'External Image',
        size: 0
      };
      
      onImagesChange([...images, newImage]);
      setImageUrl('');
      toast.success('Image URL added');
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all duration-300 ${
          dragActive
            ? 'border-black bg-black/5 scale-105'
            : uploading
            ? 'border-black/40 bg-black/5'
            : 'border-black/20 hover:border-black/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          disabled={uploading}
        />

        <div className="space-y-4">
          <div className="text-6xl">
            {uploading ? '⏳' : '📸'}
          </div>
          <div>
            <p className="text-lg font-semibold text-black mb-2">
              {uploading ? 'Uploading to cloud...' : 'Drag and drop images here'}
            </p>
            <p className="text-sm text-black/50 mb-4">
              {uploading ? 'Please wait' : 'or click to browse'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={`px-6 py-3 bg-black text-white rounded-xl font-medium transition-all inline-flex items-center gap-2 ${
              uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/90'
            }`}
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <span>Choose Files</span>
            )}
          </button>

          <p className="text-xs text-black/40 mt-4">
            Supports: JPG, PNG, GIF (Max 5MB each)
          </p>
        </div>
      </div>

      {/* Manual URL Input */}
      <div className="border border-black/10 rounded-xl p-4 bg-black/5">
        <label className="block text-sm font-medium text-black mb-2">
          Or add image URL manually
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImageUrl())}
            placeholder="https://example.com/image.jpg"
            disabled={uploading}
            className="flex-1 px-4 py-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handleAddImageUrl}
            disabled={uploading || !imageUrl.trim()}
            className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            Add URL
          </button>
        </div>
      </div>

      {/* Quick Add Options */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            const newImage = {
              id: Math.random().toString(36).substr(2, 9),
              preview: 'https://via.placeholder.com/800x800?text=Product+Image',
              url: 'https://via.placeholder.com/800x800?text=Product+Image',
              name: 'Placeholder',
              size: 0
            };
            onImagesChange([...images, newImage]);
            toast.success('Placeholder added');
          }}
          disabled={uploading}
          className="px-4 py-2 bg-black/5 text-black text-sm rounded-lg hover:bg-black/10 transition-all disabled:opacity-50"
        >
          + Add Placeholder
        </button>
        <button
          type="button"
          onClick={() => {
            const newImage = {
              id: Math.random().toString(36).substr(2, 9),
              preview: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800',
              url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800',
              name: 'Sample Image',
              size: 0
            };
            onImagesChange([...images, newImage]);
            toast.success('Sample image added');
          }}
          disabled={uploading}
          className="px-4 py-2 bg-black/5 text-black text-sm rounded-lg hover:bg-black/10 transition-all disabled:opacity-50"
        >
          + Add Sample
        </button>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group aspect-square bg-black/5 rounded-xl overflow-hidden border border-black/10"
            >
              <img
                src={image.preview || image.url}
                alt={image.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x400?text=Invalid+Image';
                }}
              />

              {/* Main Image Badge */}
              {index === 0 && (
                <div className="absolute top-3 left-3 px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
                  Main Image
                </div>
              )}

              {/* Cloudinary Badge */}
              {image.publicId && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                  ☁️ Cloud
                </div>
              )}

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleSetMainImage(image.id)}
                    className="p-2 bg-white rounded-lg hover:bg-black hover:text-white transition-all"
                    title="Set as main image"
                  >
                    ⭐
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(image.id)}
                  className="p-2 bg-white rounded-lg hover:bg-red-500 hover:text-white transition-all"
                  title="Remove image"
                >
                  🗑️
                </button>
              </div>

              {/* File Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-white text-xs truncate">{image.name}</p>
                <p className="text-white/60 text-xs">
                  {image.size > 0 ? `${(image.size / 1024).toFixed(1)} KB` : 'External'}
                  {image.width && ` • ${image.width}×${image.height}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Count */}
      {images.length > 0 && (
        <div className="text-sm text-black/60 text-center">
          {images.length} {images.length === 1 ? 'image' : 'images'} added
          {images.length > 0 && ' • First image will be the main product image'}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;