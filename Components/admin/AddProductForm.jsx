'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import ImageUploader from './ImageUploader';
import ProductPreview from './ProductPreview';

const AddProductForm = ({ initialData = null, isEdit = false }) => {
  const router = useRouter();
  const formRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Initialize form with existing data if editing, otherwise use defaults
  const [formData, setFormData] = useState(initialData || {
    // Basic Information
    name: '',
    sku: '',
    category: '',
    subcategory: '',
    description: '',
    
    // Pricing
    price: '',
    compareAtPrice: '',
    costPerItem: '',
    
    // Inventory
    trackQuantity: true,
    quantity: '',
    lowStockThreshold: '10',
    allowBackorder: false,
    
    // Shipping
    weight: '',
    length: '',
    width: '',
    height: '',
    
    // Organization
    tags: [],
    status: 'draft',
    featured: false,
    
    // Images
    images: [],
  });

  const [errors, setErrors] = useState({});
  const [newTag, setNewTag] = useState('');

  // Page title and button text based on mode
  const pageTitle = isEdit ? 'Edit Product' : 'Add New Product';
  const submitButtonText = isEdit ? 'Update Product' : 'Publish Product';
  const draftButtonText = isEdit ? 'Save Changes' : 'Save as Draft';

  const categories = [
    { value: '', label: 'Select Category' },
    { value: 'figures', label: 'Figures & Collectibles' },
    { value: 'posters', label: 'Posters & Wall Art' },
    { value: 'keychains', label: 'Keychains & Charms' },
    { value: 'clothing', label: 'Clothing & Apparel' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'stationery', label: 'Stationery' },
    { value: 'plushies', label: 'Plushies & Toys' },
  ];

  const subcategories = {
    figures: ['Action Figures', 'Nendoroid', 'Figma', 'Scale Figures', 'Prize Figures'],
    posters: ['Wall Scrolls', 'Canvas Prints', 'Poster Sets', 'Mini Posters'],
    keychains: ['Acrylic Keychains', 'Metal Keychains', 'Rubber Keychains', 'Charm Sets'],
    clothing: ['T-Shirts', 'Hoodies', 'Jackets', 'Cosplay', 'Accessories'],
    accessories: ['Bags', 'Wallets', 'Phone Cases', 'Jewelry', 'Pins'],
    stationery: ['Notebooks', 'Pens', 'Stickers', 'Bookmarks', 'Cards'],
    plushies: ['Small Plushies', 'Medium Plushies', 'Large Plushies', 'Plush Sets'],
  };

  const steps = [
    { number: 1, title: 'Basic Info', icon: '📝' },
    { number: 2, title: 'Pricing', icon: '💰' },
    { number: 3, title: 'Inventory', icon: '📦' },
    { number: 4, title: 'Media', icon: '🖼️' },
    { number: 5, title: 'Review', icon: '✓' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(formRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out',
      });
    }, formRef);

    return () => ctx.revert();
  }, [currentStep]);

  // Auto-generate SKU only if not editing and SKU is empty
  useEffect(() => {
    if (!isEdit && formData.name && formData.category && !formData.sku) {
      const category = formData.category.substring(0, 3).toUpperCase();
      const name = formData.name.substring(0, 3).toUpperCase().replace(/\s/g, '');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      setFormData(prev => ({ ...prev, sku: `${category}-${name}-${random}` }));
    }
  }, [formData.name, formData.category, isEdit]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = (images) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name) newErrors.name = 'Product name is required';
      if (!formData.category) newErrors.category = 'Category is required';
      if (!formData.description) newErrors.description = 'Description is required';
    }

    if (step === 2) {
      if (!formData.price) newErrors.price = 'Price is required';
      if (formData.price && isNaN(formData.price)) newErrors.price = 'Price must be a number';
      if (formData.price && parseFloat(formData.price) <= 0) newErrors.price = 'Price must be greater than 0';
    }

    if (step === 3) {
      if (formData.trackQuantity && !formData.quantity) {
        newErrors.quantity = 'Quantity is required when tracking inventory';
      }
      if (formData.quantity && isNaN(formData.quantity)) {
        newErrors.quantity = 'Quantity must be a number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (status) => {
    if (!validateStep(currentStep)) return;

    setSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const productData = {
        ...formData,
        status,
        updatedAt: new Date().toISOString(),
        ...(isEdit ? {} : { createdAt: new Date().toISOString() })
      };

      console.log(isEdit ? 'Update Product Data:' : 'Create Product Data:', productData);
      
      // Success notification
      const successMessage = isEdit 
        ? `Product updated successfully!`
        : `Product ${status === 'active' ? 'published' : 'saved as draft'} successfully!`;
      
      alert(successMessage);
      router.push('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Steps */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-black/5">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => currentStep > step.number && setCurrentStep(step.number)}
                      disabled={currentStep < step.number}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                        currentStep >= step.number
                          ? 'bg-black text-white shadow-lg scale-110'
                          : 'bg-black/10 text-black/40'
                      } ${currentStep > step.number ? 'cursor-pointer hover:scale-115' : 'cursor-default'}`}
                    >
                      {currentStep > step.number ? '✓' : step.icon}
                    </button>
                    <span className={`text-xs mt-2 font-medium hidden sm:block ${
                      currentStep >= step.number ? 'text-black' : 'text-black/40'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`w-8 md:w-16 h-0.5 mx-2 transition-all duration-300 ${
                      currentStep > step.number ? 'bg-black' : 'bg-black/10'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div ref={formRef} className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-black/5">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-black mb-2">Basic Information</h2>
                  <p className="text-sm text-black/50">Add the essential details about your product</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Naruto Uzumaki Action Figure"
                      className={`w-full px-4 py-3 bg-black/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all ${
                        errors.name ? 'border-red-500' : 'border-black/10'
                      }`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        SKU {!isEdit && '(Auto-generated)'}
                      </label>
                      <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        placeholder={isEdit ? 'Product SKU' : 'Will be auto-generated'}
                        className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                        readOnly={!isEdit}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-black/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all cursor-pointer ${
                          errors.category ? 'border-red-500' : 'border-black/10'
                        }`}
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                      {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                    </div>
                  </div>

                  {formData.category && subcategories[formData.category] && (
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Subcategory
                      </label>
                      <select
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all cursor-pointer"
                      >
                        <option value="">Select Subcategory</option>
                        {subcategories[formData.category].map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={6}
                      placeholder="Describe your product in detail..."
                      className={`w-full px-4 py-3 bg-black/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all resize-none ${
                        errors.description ? 'border-red-500' : 'border-black/10'
                      }`}
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    <p className="text-xs text-black/40 mt-1">
                      {formData.description.length} characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Product Tags
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        placeholder="Add tags (e.g., anime, naruto, collectible)"
                        className="flex-1 px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all"
                      >
                        Add
                      </button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-black/10 rounded-full text-sm text-black inline-flex items-center gap-2"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="hover:text-red-500 transition-colors"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Pricing */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-black mb-2">Pricing</h2>
                  <p className="text-sm text-black/50">Set your product pricing and profit margins</p>
                </div>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Price <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40">$</span>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          className={`w-full pl-8 pr-4 py-3 bg-black/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all ${
                            errors.price ? 'border-red-500' : 'border-black/10'
                          }`}
                        />
                      </div>
                      {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Compare at Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40">$</span>
                        <input
                          type="number"
                          name="compareAtPrice"
                          value={formData.compareAtPrice}
                          onChange={handleInputChange}
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                        />
                      </div>
                      <p className="text-xs text-black/40 mt-1">Original price for sale calculation</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Cost per Item
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40">$</span>
                      <input
                        type="number"
                        name="costPerItem"
                        value={formData.costPerItem}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                      />
                    </div>
                    <p className="text-xs text-black/40 mt-1">Your cost for this product</p>
                  </div>

                  {/* Profit Margin Calculation */}
                  {formData.price && formData.costPerItem && (
                    <div className="bg-black/5 rounded-xl p-6 space-y-3">
                      <h3 className="font-semibold text-black mb-3">Profit Margin</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-black/50 mb-1">Profit</p>
                          <p className="text-xl font-bold text-black">
                            ${(parseFloat(formData.price) - parseFloat(formData.costPerItem)).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-black/50 mb-1">Margin</p>
                          <p className="text-xl font-bold text-black">
                            {(((parseFloat(formData.price) - parseFloat(formData.costPerItem)) / parseFloat(formData.price)) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Inventory */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-black mb-2">Inventory & Stock</h2>
                  <p className="text-sm text-black/50">Manage your product inventory settings</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-black/5 rounded-xl">
                    <input
                      type="checkbox"
                      name="trackQuantity"
                      id="trackQuantity"
                      checked={formData.trackQuantity}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-black/20 text-black focus:ring-2 focus:ring-black/20 cursor-pointer"
                    />
                    <div>
                      <label htmlFor="trackQuantity" className="font-medium text-black cursor-pointer">
                        Track quantity
                      </label>
                      <p className="text-xs text-black/50">Enable inventory tracking for this product</p>
                    </div>
                  </div>

                  {formData.trackQuantity && (
                    <>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            Quantity <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            min="0"
                            placeholder="0"
                            className={`w-full px-4 py-3 bg-black/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all ${
                              errors.quantity ? 'border-red-500' : 'border-black/10'
                            }`}
                          />
                          {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            Low Stock Threshold
                          </label>
                          <input
                            type="number"
                            name="lowStockThreshold"
                            value={formData.lowStockThreshold}
                            onChange={handleInputChange}
                            min="0"
                            placeholder="10"
                            className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                          />
                          <p className="text-xs text-black/40 mt-1">Alert when stock falls below this number</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-black/5 rounded-xl">
                        <input
                          type="checkbox"
                          name="allowBackorder"
                          id="allowBackorder"
                          checked={formData.allowBackorder}
                          onChange={handleInputChange}
                          className="w-5 h-5 rounded border-black/20 text-black focus:ring-2 focus:ring-black/20 cursor-pointer"
                        />
                        <div>
                          <label htmlFor="allowBackorder" className="font-medium text-black cursor-pointer">
                            Allow backorders
                          </label>
                          <p className="text-xs text-black/50">Customers can order when out of stock</p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Shipping Dimensions */}
                  <div className="pt-6 border-t border-black/5">
                    <h3 className="font-semibold text-black mb-4">Shipping Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          name="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          step="0.01"
                          min="0"
                          placeholder="0.0"
                          className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            L (cm)
                          </label>
                          <input
                            type="number"
                            name="length"
                            value={formData.length}
                            onChange={handleInputChange}
                            min="0"
                            placeholder="0"
                            className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            W (cm)
                          </label>
                          <input
                            type="number"
                            name="width"
                            value={formData.width}
                            onChange={handleInputChange}
                            min="0"
                            placeholder="0"
                            className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            H (cm)
                          </label>
                          <input
                            type="number"
                            name="height"
                            value={formData.height}
                            onChange={handleInputChange}
                            min="0"
                            placeholder="0"
                            className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Media */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-black mb-2">Product Media</h2>
                  <p className="text-sm text-black/50">Upload product images (first image will be the main image)</p>
                </div>

                <ImageUploader
                  images={formData.images}
                  onImagesChange={handleImageUpload}
                />
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-black mb-2">Review & {isEdit ? 'Update' : 'Publish'}</h2>
                  <p className="text-sm text-black/50">Review your product details before {isEdit ? 'updating' : 'publishing'}</p>
                </div>

                <ProductPreview product={formData} />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-black/5 mt-8">
              <button
                type="button"
                onClick={handlePreviousStep}
                disabled={currentStep === 1}
                className="px-6 py-3 bg-black/5 text-black rounded-xl font-medium hover:bg-black/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center gap-2 group"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                Previous
              </button>

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all inline-flex items-center gap-2 group"
                >
                  Next
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleSubmit('draft')}
                    disabled={saving}
                    className="px-6 py-3 bg-black/5 text-black rounded-xl font-medium hover:bg-black/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : draftButtonText}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSubmit('active')}
                    disabled={saving}
                    className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{isEdit ? 'Updating...' : 'Publishing...'}</span>
                      </>
                    ) : (
                      submitButtonText
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Status */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-black/5 sticky top-6">
            <h3 className="font-semibold text-black mb-4">Product Status</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-black/5 rounded-xl">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-black/20 text-black focus:ring-2 focus:ring-black/20 cursor-pointer"
                />
                <div>
                  <label htmlFor="featured" className="font-medium text-black text-sm cursor-pointer">
                    Featured Product
                  </label>
                  <p className="text-xs text-black/50">Show on homepage</p>
                </div>
              </div>

              <div className="pt-3 border-t border-black/5">
                <label className="block text-sm font-medium text-black mb-2">
                  Visibility
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all cursor-pointer"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-black/5 to-black/10 rounded-2xl p-6 border border-black/5">
            <h3 className="font-semibold text-black mb-3 flex items-center gap-2">
              <span>💡</span> Quick Tips
            </h3>
            <ul className="space-y-2 text-sm text-black/60">
              <li className="flex items-start gap-2">
                <span className="text-black mt-0.5">•</span>
                <span>Use clear, high-quality product images</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black mt-0.5">•</span>
                <span>Write detailed descriptions with key features</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black mt-0.5">•</span>
                <span>Add relevant tags for better search results</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black mt-0.5">•</span>
                <span>Set competitive pricing based on market</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black mt-0.5">•</span>
                <span>Keep inventory levels updated</span>
              </li>
            </ul>
          </div>

          {/* Quick Stats (if editing) */}
          {isEdit && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-black/5">
              <h3 className="font-semibold text-black mb-4">Product Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-black/60">Views</span>
                  <span className="text-sm font-semibold text-black">1,234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-black/60">Sales</span>
                  <span className="text-sm font-semibold text-black">89</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-black/60">Revenue</span>
                  <span className="text-sm font-semibold text-black">$7,999</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-black/60">Rating</span>
                  <span className="text-sm font-semibold text-black">⭐ 4.8</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProductForm;