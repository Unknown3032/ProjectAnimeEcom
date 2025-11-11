'use client';

import { useState, useRef } from 'react';
import { gsap } from 'gsap';

const ImageUploader = ({ images = [], onImagesChange }) => {
  const [dragActive, setDragActive] = useState(false);
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

  const handleFiles = (files) => {
    const newImages = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));

    onImagesChange([...images, ...newImages]);
  };

  const handleRemoveImage = (imageId) => {
    const imageToRemove = images.find(img => img.id === imageId);
    if (imageToRemove?.preview) {
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
        />

        <div className="space-y-4">
          <div className="text-6xl">📸</div>
          <div>
            <p className="text-lg font-semibold text-black mb-2">
              Drag and drop images here
            </p>
            <p className="text-sm text-black/50 mb-4">
              or click to browse
            </p>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all inline-flex items-center gap-2"
          >
            <span>Choose Files</span>
          </button>

          <p className="text-xs text-black/40 mt-4">
            Supports: JPG, PNG, GIF (Max 5MB each)
          </p>
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative group aspect-square bg-black/5 rounded-xl overflow-hidden border border-black/10"
            >
              <img
                src={image.preview}
                alt={image.name}
                className="w-full h-full object-cover"
              />

              {/* Main Image Badge */}
              {index === 0 && (
                <div className="absolute top-3 left-3 px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
                  Main Image
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
                  {(image.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;