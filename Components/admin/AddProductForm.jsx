"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import toast from "react-hot-toast";
import ImageUploader from "./ImageUploader";
import ProductPreview from "./ProductPreview";

const AddProductForm = ({ initialData = null, isEdit = false }) => {
  const router = useRouter();
  const formRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Anime search states - ENHANCED
  const [animeList, setAnimeList] = useState([]);
  const [animeSearch, setAnimeSearch] = useState("");
  const [loadingAnime, setLoadingAnime] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [showAnimeDropdown, setShowAnimeDropdown] = useState(false);
  
  // Category states
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);

  // Initialize form with all fields properly defined
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        // Basic Information
        name: initialData.name || "",
        sku: initialData.sku || "",
        categoryRef: initialData.categoryRef?._id || initialData.categoryRef || "",
        category: initialData.category || "",
        subCategoryRef: initialData.subCategoryRef?._id || initialData.subCategoryRef || null,
        subCategory: initialData.subCategory || "",
        description: initialData.description || "",
        shortDescription: initialData.shortDescription || "",

        // Anime Specific
        anime: {
          name: initialData.anime?.name || "",
          character: initialData.anime?.character || "",
          series: initialData.anime?.series || "",
          season: initialData.anime?.season || "",
          episode: initialData.anime?.episode || "",
        },

        // Pricing
        price: initialData.price || "",
        originalPrice: initialData.originalPrice || "",
        discount: initialData.discount || 0,
        currency: initialData.currency || "USD",

        // Inventory
        stock: initialData.stock || "",
        trackQuantity: initialData.trackQuantity ?? true,
        lowStockThreshold: initialData.lowStockThreshold || "10",
        allowBackorder: initialData.allowBackorder || false,

        // Shipping
        shipping: {
          weight: initialData.shipping?.weight || "",
          dimensions: {
            length: initialData.shipping?.dimensions?.length || "",
            width: initialData.shipping?.dimensions?.width || "",
            height: initialData.shipping?.dimensions?.height || "",
          },
          freeShipping: initialData.shipping?.freeShipping || false,
          estimatedDelivery: initialData.shipping?.estimatedDelivery || "",
        },

        // Brand & Licensing
        brand: initialData.brand || "",
        manufacturer: initialData.manufacturer || "",
        isOfficial: initialData.isOfficial || false,
        licensedBy: initialData.licensedBy || "",

        // Organization
        tags: initialData.tags || [],
        status: initialData.status || "draft",
        isFeatured: initialData.isFeatured || false,
        isNewArrival: initialData.isNewArrival || false,
        isBestseller: initialData.isBestseller || false,

        // Age Rating
        ageRating: initialData.ageRating || "All Ages",

        // Images
        images: initialData.images || [],

        // Specifications
        specifications: {
          material: initialData.specifications?.material || "",
          weight: initialData.specifications?.weight || "",
          dimensions: {
            length: initialData.specifications?.dimensions?.length || "",
            width: initialData.specifications?.dimensions?.width || "",
            height: initialData.specifications?.dimensions?.height || "",
            unit: initialData.specifications?.dimensions?.unit || "cm",
          },
          careInstructions: initialData.specifications?.careInstructions || [],
          features: initialData.specifications?.features || [],
        },

        // Availability
        isAvailable: initialData.isAvailable ?? true,
        isPreOrder: initialData.isPreOrder || false,
        preOrderReleaseDate: initialData.preOrderReleaseDate || "",
        isLimitedEdition: initialData.isLimitedEdition || false,
        limitedQuantity: initialData.limitedQuantity || "",
      };
    } else {
      return {
        // Basic Information
        name: "",
        sku: "",
        categoryRef: "",
        category: "",
        subCategoryRef: null,
        subCategory: "",
        description: "",
        shortDescription: "",

        // Anime Specific
        anime: {
          name: "",
          character: "",
          series: "",
          season: "",
          episode: "",
        },

        // Pricing
        price: "",
        originalPrice: "",
        discount: 0,
        currency: "USD",

        // Inventory
        stock: "",
        trackQuantity: true,
        lowStockThreshold: "10",
        allowBackorder: false,

        // Shipping
        shipping: {
          weight: "",
          dimensions: {
            length: "",
            width: "",
            height: "",
          },
          freeShipping: false,
          estimatedDelivery: "",
        },

        // Brand & Licensing
        brand: "",
        manufacturer: "",
        isOfficial: false,
        licensedBy: "",

        // Organization
        tags: [],
        status: "draft",
        isFeatured: false,
        isNewArrival: false,
        isBestseller: false,

        // Age Rating
        ageRating: "All Ages",

        // Images
        images: [],

        // Specifications
        specifications: {
          material: "",
          weight: "",
          dimensions: {
            length: "",
            width: "",
            height: "",
            unit: "cm",
          },
          careInstructions: [],
          features: [],
        },

        // Availability
        isAvailable: true,
        isPreOrder: false,
        preOrderReleaseDate: "",
        isLimitedEdition: false,
        limitedQuantity: "",
      };
    }
  });

  const [errors, setErrors] = useState({});
  const [newTag, setNewTag] = useState("");

  // Page title and button text based on mode
  const pageTitle = isEdit ? "Edit Product" : "Add New Product";
  const submitButtonText = isEdit ? "Update Product" : "Publish Product";
  const draftButtonText = isEdit ? "Save Changes" : "Save as Draft";

  const steps = [
    { number: 1, title: "Basic Info", icon: "📝" },
    { number: 2, title: "Pricing", icon: "💰" },
    { number: 3, title: "Inventory", icon: "📦" },
    { number: 4, title: "Media", icon: "🖼️" },
    { number: 5, title: "Review", icon: "✓" },
  ];

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await fetch('/api/admin/products/categories?parentId=null');
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data = await response.json();
      
      if (data.success && data.categories && data.categories.length > 0) {
        const formattedCategories = [
          { value: "", label: "Select Category", _id: "", name: "" },
          ...data.categories.map((cat) => ({
            value: cat._id,
            label: cat.productCount > 0 
              ? `${cat.label || cat.name} (${cat.productCount} products)` 
              : (cat.label || cat.name),
            name: cat.name,
            slug: cat.slug,
            _id: cat._id,
          })),
        ];
        setCategories(formattedCategories);
      } else {
        setCategories([{ value: "", label: "Select Category", _id: "", name: "" }]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([{ value: "", label: "Select Category", _id: "", name: "" }]);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch subcategories
  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) {
      setSubCategories([]);
      setSelectedSubCategoryId("");
      return;
    }

    try {
      setLoadingSubCategories(true);
      const response = await fetch(`/api/admin/products/categories/${categoryId}/subcategories`);
      
      if (!response.ok) {
        console.warn('Failed to fetch subcategories');
        setSubCategories([]);
        return;
      }
      
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        const formattedSubCategories = [
          { value: "", label: "Select Subcategory (Optional)", _id: "", name: "" },
          ...data.data.map((subCat) => ({
            value: subCat._id,
            label: subCat.productCount > 0 
              ? `${subCat.label || subCat.name} (${subCat.productCount} products)` 
              : (subCat.label || subCat.name),
            name: subCat.name,
            slug: subCat.slug,
            _id: subCat._id,
          })),
        ];
        setSubCategories(formattedSubCategories);
      } else {
        setSubCategories([]);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubCategories([]);
    } finally {
      setLoadingSubCategories(false);
    }
  };

  // ENHANCED: Search anime from YOUR backend database
  const searchAnime = async (query) => {
    if (!query || query.trim().length < 2) {
      setAnimeList([]);
      setShowAnimeDropdown(false);
      return;
    }

    try {
      setLoadingAnime(true);
      
      // Fetch from YOUR anime API
      const response = await fetch(
        `/api/anime?search=${encodeURIComponent(query.trim())}&limit=10&active=true`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch anime');
      }
      
      const data = await response.json();
      
      console.log('Anime search results:', data);
      
      if (data.success && data.data && data.data.length > 0) {
        const animeResults = data.data.map(anime => ({
          _id: anime._id,
          name: anime.name,
          englishName: anime.englishName || anime.name,
          japaneseName: anime.japaneseName || '',
          image: anime.image,
          banner: anime.banner || '',
          genre: anime.genre || [],
          studio: anime.studio || '',
          releaseYear: anime.releaseYear,
          status: anime.status,
          rating: anime.rating,
          description: anime.description || '',
        }));
        
        setAnimeList(animeResults);
        setShowAnimeDropdown(true);
      } else {
        setAnimeList([]);
        setShowAnimeDropdown(false);
        
        // Show a message if no results found
        if (query.length >= 2) {
          toast.error('No anime found. Try a different search term.');
        }
      }
    } catch (error) {
      console.error("Error searching anime:", error);
      setAnimeList([]);
      setShowAnimeDropdown(false);
      toast.error('Failed to search anime. Please try again.');
    } finally {
      setLoadingAnime(false);
    }
  };

  // ENHANCED: Handle anime selection with auto-fill
  const handleAnimeSelect = (anime) => {
    console.log('Selected anime:', anime);
    
    setSelectedAnime(anime);
    setAnimeSearch(anime.name);
    setShowAnimeDropdown(false);
    
    // Auto-fill form data with anime information
    setFormData((prev) => ({
      ...prev,
      anime: {
        name: anime.name,
        series: anime.name, // Use anime name as series
        character: prev.anime?.character || '', // Keep existing character if any
        season: prev.anime?.season || '',
        episode: prev.anime?.episode || '',
      },
      // Auto-suggest tags from anime genres
      tags: Array.from(new Set([
        ...prev.tags,
        'anime',
        anime.name.toLowerCase().replace(/\s+/g, '-'),
        ...(anime.genre || []).map(g => g.toLowerCase()),
      ])),
      // Optionally set age rating based on anime
      ageRating: prev.ageRating || 'All Ages',
    }));
    
    // Clear anime error if exists
    if (errors.anime) {
      setErrors((prev) => ({ ...prev, anime: "" }));
    }
    
    toast.success(`Selected: ${anime.name}`);
  };

  // ENHANCED: Debounced search with better UX
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (animeSearch.length >= 2) {
        searchAnime(animeSearch);
      } else {
        setAnimeList([]);
        setShowAnimeDropdown(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [animeSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.anime-search-container')) {
        setShowAnimeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initial data load
  useEffect(() => {
    fetchCategories();
    
    // If editing, set anime search to existing anime name
    if (isEdit && initialData?.anime?.name) {
      setAnimeSearch(initialData.anime.name);
      setSelectedAnime({
        name: initialData.anime.name,
        series: initialData.anime.series,
      });
    }
    
    // If editing, set selected category and subcategory IDs
    if (isEdit && initialData) {
      const catId = initialData.categoryRef?._id || initialData.categoryRef;
      if (catId) {
        setSelectedCategoryId(catId);
      }
      
      const subCatId = initialData.subCategoryRef?._id || initialData.subCategoryRef;
      if (subCatId) {
        setSelectedSubCategoryId(subCatId);
      }
    }
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (selectedCategoryId) {
      fetchSubCategories(selectedCategoryId);
    } else {
      setSubCategories([]);
      setSelectedSubCategoryId("");
    }
  }, [selectedCategoryId]);

  // Set initial category on edit
  useEffect(() => {
    if (isEdit && initialData && categories.length > 0) {
      const catId = initialData.categoryRef?._id || initialData.categoryRef;
      if (catId && !selectedCategoryId) {
        setSelectedCategoryId(catId);
      }
    }
  }, [categories, isEdit, initialData]);

  // Set initial subcategory on edit
  useEffect(() => {
    if (isEdit && initialData && subCategories.length > 0) {
      const subCatId = initialData.subCategoryRef?._id || initialData.subCategoryRef;
      if (subCatId && !selectedSubCategoryId) {
        setSelectedSubCategoryId(subCatId);
      }
    }
  }, [subCategories, isEdit, initialData]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(formRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power2.out",
      });
    }, formRef);

    return () => ctx.revert();
  }, [currentStep]);

  // Auto-generate SKU only if not editing and SKU is empty
  useEffect(() => {
    if (!isEdit && formData.name && formData.category && !formData.sku) {
      const category = formData.category.substring(0, 3).toUpperCase();
      const name = formData.name
        .substring(0, 3)
        .toUpperCase()
        .replace(/\s/g, "");
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
      setFormData((prev) => ({
        ...prev,
        sku: `${category}-${name}-${random}`,
      }));
    }
  }, [formData.name, formData.category, isEdit]);

  // Handle category change
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId);
    
    const selectedCategory = categories.find(cat => cat._id === categoryId);
    
    setFormData((prev) => ({
      ...prev,
      categoryRef: categoryId,
      category: selectedCategory?.name || "",
      subCategoryRef: null,
      subCategory: ""
    }));
    
    setSelectedSubCategoryId("");
    
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "" }));
    }
  };

  // Handle subcategory change
  const handleSubCategoryChange = (e) => {
    const subCategoryId = e.target.value;
    setSelectedSubCategoryId(subCategoryId);
    
    const selectedSubCategory = subCategories.find(subCat => subCat._id === subCategoryId);
    
    setFormData((prev) => ({
      ...prev,
      subCategoryRef: subCategoryId || null,
      subCategory: selectedSubCategory?.name || ""
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const keys = name.split(".");
      setFormData((prev) => {
        const newData = { ...prev };
        let current = newData;

        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) {
            current[keys[i]] = {};
          }
          current = current[keys[i]];
        }

        current[keys[keys.length - 1]] = type === "checkbox" ? checked : (value || "");
        return newData;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : (value || ""),
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim().toLowerCase())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageUpload = (images) => {
    const processedImages = images.map((img, index) => {
      if (typeof img === 'string') {
        return { url: img, alt: formData.name || 'Product image', isPrimary: index === 0 };
      }
      if (img.url) {
        return { ...img, isPrimary: index === 0 };
      }
      if (img.preview) {
        return { url: img.preview, alt: formData.name || 'Product image', isPrimary: index === 0 };
      }
      return null;
    }).filter(Boolean);

    setFormData((prev) => ({ ...prev, images: processedImages }));
    
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name?.trim()) newErrors.name = "Product name is required";
      if (!formData.anime?.name?.trim()) newErrors.anime = "Anime name is required";
      if (!selectedCategoryId) newErrors.category = "Category is required";
      if (!formData.brand?.trim()) newErrors.brand = "Brand is required";
      if (!formData.description?.trim()) newErrors.description = "Description is required";
    }

    if (step === 2) {
      if (!formData.price) newErrors.price = "Price is required";
      if (formData.price && isNaN(formData.price)) newErrors.price = "Price must be a number";
      if (formData.price && parseFloat(formData.price) <= 0) newErrors.price = "Price must be greater than 0";
    }

    if (step === 3) {
      if (formData.trackQuantity && !formData.stock) {
        newErrors.stock = "Stock quantity is required when tracking inventory";
      }
      if (formData.stock && isNaN(formData.stock)) {
        newErrors.stock = "Stock must be a number";
      }
      if (!formData.shipping?.weight) {
        newErrors.weight = "Weight is required for shipping";
      }
    }

    if (step === 4) {
      const hasValidImages = formData.images && formData.images.length > 0 && formData.images.some(img => {
        if (typeof img === 'string') return img.trim() !== '';
        if (img?.url) return img.url.trim() !== '';
        if (img?.preview) return img.preview.trim() !== '';
        return false;
      });

      if (!hasValidImages) {
        newErrors.images = "At least one product image is required";
        toast.error("Please add at least one product image");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error("Please fix the errors before continuing");
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (status) => {
    // Validate all steps before submitting
    for (let i = 1; i <= 4; i++) {
      if (!validateStep(i)) {
        setCurrentStep(i);
        toast.error(`Please complete step ${i} correctly`);
        return;
      }
    }

    if (!selectedCategoryId) {
      toast.error("Please select a category");
      setCurrentStep(1);
      return;
    }

    setSaving(true);
    const loadingToast = toast.loading(isEdit ? 'Updating product...' : 'Creating product...');

    try {
      const processedImages = formData.images.map((img, index) => {
        const imageUrl = typeof img === 'string' ? img : (img.url || img.preview || '');
        return {
          url: imageUrl,
          alt: img.alt || formData.name || 'Product image',
          isPrimary: index === 0
        };
      }).filter(img => img.url.trim() !== '');

      if (processedImages.length === 0) {
        toast.dismiss(loadingToast);
        toast.error("Please add at least one product image");
        setCurrentStep(4);
        setSaving(false);
        return;
      }

      const submissionData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        shortDescription: formData.shortDescription?.trim() || formData.description.trim().substring(0, 200),
        
        anime: {
          name: formData.anime.name.trim(),
          series: formData.anime.series?.trim() || '',
          character: formData.anime.character?.trim() || '',
          season: formData.anime.season?.trim() || '',
          episode: formData.anime.episode?.trim() || '',
        },
        
        categoryRef: selectedCategoryId,
        category: formData.category,
        subCategoryRef: selectedSubCategoryId || null,
        subCategory: formData.subCategory || '',
        
        tags: formData.tags || [],
        
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        discount: 0,
        currency: formData.currency || 'USD',
        
        stock: formData.trackQuantity ? parseInt(formData.stock) : 0,
        sku: formData.sku,
        variants: [],
        
        images: processedImages,
        videos: [],
        
        specifications: {
          material: formData.specifications?.material || '',
          weight: formData.specifications?.weight || '',
          dimensions: formData.specifications?.dimensions || {
            length: 0,
            width: 0,
            height: 0,
            unit: 'cm'
          },
          careInstructions: formData.specifications?.careInstructions || [],
          features: formData.specifications?.features || [],
        },
        
        brand: formData.brand.trim(),
        manufacturer: formData.manufacturer?.trim() || formData.brand.trim(),
        isOfficial: formData.isOfficial || false,
        licensedBy: formData.licensedBy?.trim() || '',
        
        isAvailable: status === 'active',
        isFeatured: formData.isFeatured || false,
        isNewArrival: formData.isNewArrival || false,
        isBestseller: formData.isBestseller || false,
        isPreOrder: formData.isPreOrder || false,
        preOrderReleaseDate: formData.preOrderReleaseDate || null,
        
        isLimitedEdition: formData.isLimitedEdition || false,
        limitedQuantity: formData.limitedQuantity ? parseInt(formData.limitedQuantity) : null,
        
        shipping: {
          weight: parseFloat(formData.shipping?.weight || 0.5),
          dimensions: {
            length: parseFloat(formData.shipping?.dimensions?.length || 0),
            width: parseFloat(formData.shipping?.dimensions?.width || 0),
            height: parseFloat(formData.shipping?.dimensions?.height || 0),
          },
          freeShipping: formData.shipping?.freeShipping || false,
          estimatedDelivery: formData.shipping?.estimatedDelivery || '5-7 business days',
        },
        
        status: status === 'active' ? 'published' : 'draft',
        ageRating: formData.ageRating || 'All Ages',
      };

      console.log('Submitting product data:', submissionData);

      const url = isEdit
        ? `/api/admin/products/${initialData._id}`
        : '/api/products/add';

      const method = isEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        let errorData;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          try {
            errorData = await response.json();
          } catch (jsonError) {
            console.error('Error parsing error response:', jsonError);
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
          }
        } else {
          const textResponse = await response.text();
          console.error('Non-JSON error response:', textResponse);
          throw new Error(`Server error: ${response.status} - ${textResponse || response.statusText}`);
        }

        if (errorData.details?.validationErrors) {
          const validationErrors = errorData.details.validationErrors;
          const errorMessages = Object.values(validationErrors).join(', ');
          throw new Error(errorMessages);
        }

        throw new Error(errorData.error || errorData.message || 'Failed to save product');
      }

      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error('Error parsing success response:', jsonError);
          toast.dismiss(loadingToast);
          toast.success(`Product ${isEdit ? 'updated' : 'created'} successfully!`);
          setTimeout(() => {
            router.push('/admin/products');
          }, 1500);
          return;
        }
      } else {
        console.warn('Response is not JSON:', await response.text());
        throw new Error('Invalid response format from server');
      }

      toast.dismiss(loadingToast);
      toast.success(data.message || `Product ${isEdit ? 'updated' : 'created'} successfully!`);

      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);

    } catch (error) {
      console.error('Error saving product:', error);
      toast.dismiss(loadingToast);
      
      const errorMessage = error.message || 'Failed to save product. Please try again.';
      toast.error(errorMessage);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
                      onClick={() =>
                        currentStep > step.number && setCurrentStep(step.number)
                      }
                      disabled={currentStep < step.number}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                        currentStep >= step.number
                          ? "bg-black text-white shadow-lg scale-110"
                          : "bg-black/10 text-black/40"
                      } ${
                        currentStep > step.number
                          ? "cursor-pointer hover:scale-115"
                          : "cursor-default"
                      }`}
                    >
                      {currentStep > step.number ? "✓" : step.icon}
                    </button>
                    <span
                      className={`text-xs mt-2 font-medium hidden sm:block ${
                        currentStep >= step.number
                          ? "text-black"
                          : "text-black/40"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 md:w-16 h-0.5 mx-2 transition-all duration-300 ${
                        currentStep > step.number ? "bg-black" : "bg-black/10"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div
            ref={formRef}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-black/5"
          >
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-black mb-2">
                    Basic Information
                  </h2>
                  <p className="text-sm text-black/50">
                    Add the essential details about your product
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      placeholder="e.g., Naruto Uzumaki Hokage Jacket"
                      className={`w-full px-4 py-3 bg-black/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all ${
                        errors.name ? "border-red-500" : "border-black/10"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* ENHANCED: Anime Search with Better UI */}
                  <div className="relative anime-search-container">
                    <label className="block text-sm font-medium text-black mb-2">
                      Anime Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={animeSearch || ""}
                        onChange={(e) => {
                          setAnimeSearch(e.target.value);
                          setShowAnimeDropdown(true);
                        }}
                        onFocus={() => animeList.length > 0 && setShowAnimeDropdown(true)}
                        placeholder="Search anime from database (e.g., Naruto, One Piece)"
                        className={`w-full px-4 py-3 pr-10 bg-black/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all ${
                          errors.anime ? "border-red-500" : "border-black/10"
                        }`}
                      />
                      
                      {/* Loading Spinner */}
                      {loadingAnime && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        </div>
                      )}
                      
                      {/* Search Icon */}
                      {!loadingAnime && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40">
                          🔍
                        </div>
                      )}
                    </div>
                    
                    {errors.anime && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.anime}
                      </p>
                    )}
                    
                    {/* Selected Anime Badge */}
                    {selectedAnime && (
                      <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-sm">
                        <span className="text-green-600">✓</span>
                        <span className="font-medium text-green-700">
                          Selected: {selectedAnime.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAnime(null);
                            setAnimeSearch('');
                            setFormData(prev => ({
                              ...prev,
                              anime: { ...prev.anime, name: '', series: '' }
                            }));
                          }}
                          className="text-green-600 hover:text-green-800 ml-1"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {/* ENHANCED: Autocomplete Dropdown */}
                    {showAnimeDropdown && animeList.length > 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-black/10 rounded-xl shadow-2xl max-h-96 overflow-y-auto">
                        <div className="p-2 bg-black/5 border-b border-black/10">
                          <p className="text-xs text-black/60 font-medium">
                            {animeList.length} anime found
                          </p>
                        </div>
                        {animeList.map((anime) => (
                          <div
                            key={anime._id}
                            onClick={() => handleAnimeSelect(anime)}
                            className="px-4 py-3 hover:bg-black/5 cursor-pointer flex items-center gap-3 transition-colors border-b border-black/5 last:border-0"
                          >
                            {anime.image && (
                              <img
                                src={anime.image}
                                alt={anime.name}
                                className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-black truncate">
                                {anime.name}
                              </p>
                              {anime.englishName && anime.englishName !== anime.name && (
                                <p className="text-sm text-black/50 truncate">
                                  {anime.englishName}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                {anime.releaseYear && (
                                  <span className="text-xs bg-black/10 px-2 py-0.5 rounded">
                                    {anime.releaseYear}
                                  </span>
                                )}
                                {anime.status && (
                                  <span className={`text-xs px-2 py-0.5 rounded ${
                                    anime.status === 'Completed' 
                                      ? 'bg-green-100 text-green-700'
                                      : anime.status === 'Ongoing'
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {anime.status}
                                  </span>
                                )}
                                {anime.rating && (
                                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                                    ⭐ {anime.rating}
                                  </span>
                                )}
                              </div>
                              {anime.genre && anime.genre.length > 0 && (
                                <div className="flex gap-1 mt-1 flex-wrap">
                                  {anime.genre.slice(0, 3).map((g, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs bg-black/5 px-1.5 py-0.5 rounded"
                                    >
                                      {g}
                                    </span>
                                  ))}
                                  {anime.genre.length > 3 && (
                                    <span className="text-xs text-black/40">
                                      +{anime.genre.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* No Results Message */}
                    {!loadingAnime && animeSearch.length >= 2 && animeList.length === 0 && (
                      <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
                        <p className="font-medium">No anime found for "{animeSearch}"</p>
                        <p className="text-xs mt-1">
                          Try a different search term or check the spelling
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Character & Series - Shows when anime is selected */}
                  {formData.anime?.name && (
                    <div className="grid md:grid-cols-2 gap-4 p-4 bg-black/5 rounded-xl">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Character
                        </label>
                        <input
                          type="text"
                          value={formData.anime?.character || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              anime: {
                                ...prev.anime,
                                character: e.target.value,
                              },
                            }))
                          }
                          placeholder="e.g., Naruto Uzumaki"
                          className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Series/Arc
                        </label>
                        <input
                          type="text"
                          value={formData.anime?.series || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              anime: { ...prev.anime, series: e.target.value },
                            }))
                          }
                          placeholder="e.g., Naruto Shippuden"
                          className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* SKU */}
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        SKU {!isEdit && "(Auto-generated)"}
                      </label>
                      <input
                        type="text"
                        name="sku"
                        value={formData.sku || ""}
                        onChange={handleInputChange}
                        placeholder={
                          isEdit ? "Product SKU" : "Will be auto-generated"
                        }
                        className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                        readOnly={!isEdit}
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="categoryRef"
                        value={selectedCategoryId}
                        onChange={handleCategoryChange}
                        disabled={loadingCategories}
                        className={`w-full px-4 py-3 bg-black/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all cursor-pointer ${
                          errors.category ? "border-red-500" : "border-black/10"
                        }`}
                      >
                        {categories.map((cat) => (
                          <option key={cat._id || cat.value} value={cat._id}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                      {loadingCategories && (
                        <div className="text-xs text-black/40 mt-1 flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                          Loading categories...
                        </div>
                      )}
                      {errors.category && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.category}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subcategory */}
                  {selectedCategoryId && (
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Subcategory
                      </label>
                      <select
                        name="subCategoryRef"
                        value={selectedSubCategoryId}
                        onChange={handleSubCategoryChange}
                        disabled={loadingSubCategories || subCategories.length === 0}
                        className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {subCategories.length > 0 ? (
                          subCategories.map((subCat) => (
                            <option key={subCat._id || subCat.value} value={subCat._id}>
                              {subCat.label}
                            </option>
                          ))
                        ) : (
                          <option value="">No subcategories available</option>
                        )}
                      </select>
                      {loadingSubCategories && (
                        <div className="text-xs text-black/40 mt-1 flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                          Loading subcategories...
                        </div>
                      )}
                    </div>
                  )}

                  {/* Brand & Licensed By */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Brand <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand || ""}
                        onChange={handleInputChange}
                        placeholder="e.g., Crunchyroll, Funimation"
                        className={`w-full px-4 py-3 bg-black/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all ${
                          errors.brand ? "border-red-500" : "border-black/10"
                        }`}
                      />
                      {errors.brand && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.brand}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Licensed By
                      </label>
                      <input
                        type="text"
                        name="licensedBy"
                        value={formData.licensedBy || ""}
                        onChange={handleInputChange}
                        placeholder="e.g., Shueisha, Toei Animation"
                        className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description || ""}
                      onChange={handleInputChange}
                      rows={6}
                      placeholder="Describe your product in detail..."
                      className={`w-full px-4 py-3 bg-black/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all resize-none ${
                        errors.description
                          ? "border-red-500"
                          : "border-black/10"
                      }`}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.description}
                      </p>
                    )}
                    <p className="text-xs text-black/40 mt-1">
                      {(formData.description || "").length} characters
                    </p>
                  </div>

                  {/* Short Description */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Short Description
                    </label>
                    <input
                      type="text"
                      name="shortDescription"
                      value={formData.shortDescription || ""}
                      onChange={handleInputChange}
                      placeholder="Brief summary for product cards"
                      className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                    />
                  </div>

                  {/* Age Rating */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Age Rating
                    </label>
                    <select
                      name="ageRating"
                      value={formData.ageRating || "All Ages"}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all cursor-pointer"
                    >
                      <option value="All Ages">All Ages</option>
                      <option value="13+">13+</option>
                      <option value="16+">16+</option>
                      <option value="18+">18+</option>
                      <option value="Mature">Mature</option>
                    </select>
                  </div>

                  {/* Product Tags */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Product Tags
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newTag || ""}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), handleAddTag())
                        }
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
                    {formData.tags && formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
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
                  <h2 className="text-2xl font-bold text-black mb-2">
                    Pricing
                  </h2>
                  <p className="text-sm text-black/50">
                    Set your product pricing and profit margins
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Price <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40">
                          $
                        </span>
                        <input
                          type="number"
                          name="price"
                          value={formData.price || ""}
                          onChange={handleInputChange}
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          className={`w-full pl-8 pr-4 py-3 bg-black/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all ${
                            errors.price ? "border-red-500" : "border-black/10"
                          }`}
                        />
                      </div>
                      {errors.price && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.price}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Compare at Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40">
                          $
                        </span>
                        <input
                          type="number"
                          name="originalPrice"
                          value={formData.originalPrice || ""}
                          onChange={handleInputChange}
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                        />
                      </div>
                      <p className="text-xs text-black/40 mt-1">
                        Original price for sale calculation
                      </p>
                    </div>
                  </div>

                  {/* Discount Calculation */}
                  {formData.price && formData.originalPrice && parseFloat(formData.originalPrice) > parseFloat(formData.price) && (
                    <div className="bg-black/5 rounded-xl p-6 space-y-3">
                      <h3 className="font-semibold text-black mb-3">
                        Discount Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-black/50 mb-1">You Save</p>
                          <p className="text-xl font-bold text-black">
                            $
                            {(
                              parseFloat(formData.originalPrice) -
                              parseFloat(formData.price)
                            ).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-black/50 mb-1">Discount %</p>
                          <p className="text-xl font-bold text-green-600">
                            {(
                              ((parseFloat(formData.originalPrice) -
                                parseFloat(formData.price)) /
                                parseFloat(formData.originalPrice)) *
                              100
                            ).toFixed(0)}
                            % OFF
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
                  <h2 className="text-2xl font-bold text-black mb-2">
                    Inventory & Stock
                  </h2>
                  <p className="text-sm text-black/50">
                    Manage your product inventory settings
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-black/5 rounded-xl">
                    <input
                      type="checkbox"
                      name="trackQuantity"
                      id="trackQuantity"
                      checked={formData.trackQuantity ?? true}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-black/20 text-black focus:ring-2 focus:ring-black/20 cursor-pointer"
                    />
                    <div>
                      <label
                        htmlFor="trackQuantity"
                        className="font-medium text-black cursor-pointer"
                      >
                        Track quantity
                      </label>
                      <p className="text-xs text-black/50">
                        Enable inventory tracking for this product
                      </p>
                    </div>
                  </div>

                  {formData.trackQuantity && (
                    <>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            Stock Quantity <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="stock"
                            value={formData.stock || ""}
                            onChange={handleInputChange}
                            min="0"
                            placeholder="0"
                            className={`w-full px-4 py-3 bg-black/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all ${
                              errors.stock
                                ? "border-red-500"
                                : "border-black/10"
                            }`}
                          />
                          {errors.stock && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.stock}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            Low Stock Threshold
                          </label>
                          <input
                            type="number"
                            name="lowStockThreshold"
                            value={formData.lowStockThreshold || "10"}
                            onChange={handleInputChange}
                            min="0"
                            placeholder="10"
                            className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                          />
                          <p className="text-xs text-black/40 mt-1">
                            Alert when stock falls below this number
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Shipping Dimensions */}
                  <div className="pt-6 border-t border-black/5">
                    <h3 className="font-semibold text-black mb-4">
                      Shipping Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Weight (kg) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="shipping.weight"
                          value={formData.shipping?.weight || ""}
                          onChange={handleInputChange}
                          step="0.01"
                          min="0"
                          placeholder="0.0"
                          className={`w-full px-4 py-3 bg-black/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all ${
                            errors.weight ? "border-red-500" : "border-black/10"
                          }`}
                        />
                        {errors.weight && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.weight}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            L (cm)
                          </label>
                          <input
                            type="number"
                            name="shipping.dimensions.length"
                            value={formData.shipping?.dimensions?.length || ""}
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
                            name="shipping.dimensions.width"
                            value={formData.shipping?.dimensions?.width || ""}
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
                            name="shipping.dimensions.height"
                            value={formData.shipping?.dimensions?.height || ""}
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
                  <h2 className="text-2xl font-bold text-black mb-2">
                    Product Media
                  </h2>
                  <p className="text-sm text-black/50">
                    Upload product images (first image will be the main image)
                  </p>
                </div>

                {errors.images && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-600 text-sm font-medium">{errors.images}</p>
                  </div>
                )}

                <ImageUploader
                  images={formData.images || []}
                  onImagesChange={handleImageUpload}
                />
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-black mb-2">
                    Review & {isEdit ? "Update" : "Publish"}
                  </h2>
                  <p className="text-sm text-black/50">
                    Review your product details before{" "}
                    {isEdit ? "updating" : "publishing"}
                  </p>
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
                <span className="group-hover:-translate-x-1 transition-transform">
                  ←
                </span>
                Previous
              </button>

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all inline-flex items-center gap-2 group"
                >
                  Next
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleSubmit("draft")}
                    disabled={saving}
                    className="px-6 py-3 bg-black/5 text-black rounded-xl font-medium hover:bg-black/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : draftButtonText}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSubmit("active")}
                    disabled={saving}
                    className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{isEdit ? "Updating..." : "Publishing..."}</span>
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
            <h3 className="font-semibold text-black mb-4">Product Features</h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-black/5 rounded-xl">
                <input
                  type="checkbox"
                  name="isFeatured"
                  id="isFeatured"
                  checked={formData.isFeatured ?? false}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-black/20 text-black focus:ring-2 focus:ring-black/20 cursor-pointer"
                />
                <div>
                  <label
                    htmlFor="isFeatured"
                    className="font-medium text-black text-sm cursor-pointer"
                  >
                    Featured Product
                  </label>
                  <p className="text-xs text-black/50">Show on homepage</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-black/5 rounded-xl">
                <input
                  type="checkbox"
                  name="isNewArrival"
                  id="isNewArrival"
                  checked={formData.isNewArrival ?? false}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-black/20 text-black focus:ring-2 focus:ring-black/20 cursor-pointer"
                />
                <div>
                  <label
                    htmlFor="isNewArrival"
                    className="font-medium text-black text-sm cursor-pointer"
                  >
                    New Arrival
                  </label>
                  <p className="text-xs text-black/50">Mark as new product</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-black/5 rounded-xl">
                <input
                  type="checkbox"
                  name="isBestseller"
                  id="isBestseller"
                  checked={formData.isBestseller ?? false}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-black/20 text-black focus:ring-2 focus:ring-black/20 cursor-pointer"
                />
                <div>
                  <label
                    htmlFor="isBestseller"
                    className="font-medium text-black text-sm cursor-pointer"
                  >
                    Bestseller
                  </label>
                  <p className="text-xs text-black/50">Mark as bestseller</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-black/5 rounded-xl">
                <input
                  type="checkbox"
                  name="isOfficial"
                  id="isOfficial"
                  checked={formData.isOfficial ?? false}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-black/20 text-black focus:ring-2 focus:ring-black/20 cursor-pointer"
                />
                <div>
                  <label
                    htmlFor="isOfficial"
                    className="font-medium text-black text-sm cursor-pointer"
                  >
                    Official Product
                  </label>
                  <p className="text-xs text-black/50">Officially licensed</p>
                </div>
              </div>

              <div className="pt-3 border-t border-black/5">
                <label className="block text-sm font-medium text-black mb-2">
                  Visibility
                </label>
                <select
                  name="status"
                  value={formData.status || "draft"}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all cursor-pointer"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
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
                <span>Search and select anime from your database</span>
              </li>
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
        </div>
      </div>
    </div>
  );
};

export default AddProductForm;