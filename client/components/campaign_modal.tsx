"use client";

import { motion, AnimatePresence, useMotionValue } from "motion/react";
import { X, Upload, AlertCircle, CircleDollarSign, Lightbulb, Rocket, Globe, Heart, Code, Music, Book, Camera, Eye, Edit2, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  title: string;
  description: string;
  targetAmount: string;
  images: File[];
  icon: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  targetAmount?: string;
  images?: string;
  icon?: string;
}

export default function CampaignModal({ isOpen, onClose }: CampaignModalProps) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    targetAmount: "",
    images: [],
    icon: "CircleDollarSign"
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    if (!formData.targetAmount) {
      newErrors.targetAmount = "Target amount is required";
    } else {
      const amount = Number(formData.targetAmount);
      if (isNaN(amount)) {
        newErrors.targetAmount = "Please enter a valid number";
      } else if (amount <= 0) {
        newErrors.targetAmount = "Amount must be greater than 0 ETH";
      } else if (amount >= 1000000) {
        newErrors.targetAmount = "Amount cannot exceed 1,000,000 ETH";
      }
    }

    if (formData.images.length === 0) {
      newErrors.images = "At least one image is required";
    }

    if (!formData.icon) {
      newErrors.icon = "Please select an icon";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // TODO: Handle form submission
      console.log("Form submitted:", formData);
      onClose();
    }
  };

  const handleTargetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty input for better UX
    if (value === "") {
      setFormData({ ...formData, targetAmount: "" });
      return;
    }

    // Convert to number and validate
    const amount = Number(value);
    if (!isNaN(amount)) {
      // Ensure we keep the decimal places the user types
      setFormData({ ...formData, targetAmount: value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => file.type.startsWith("image/"));
    const newImages = [...formData.images, ...validFiles].slice(0, 5);
    setFormData({ ...formData, images: newImages });

    const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => {
      prev.forEach(url => URL.revokeObjectURL(url));
      return newPreviewUrls;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const iconOptions = [
    { name: "CircleDollarSign", component: CircleDollarSign, label: "Money" },
    { name: "Lightbulb", component: Lightbulb, label: "Idea" },
    { name: "Rocket", component: Rocket, label: "Startup" },
    { name: "Globe", component: Globe, label: "Global" },
    { name: "Heart", component: Heart, label: "Charity" },
    { name: "Code", component: Code, label: "Tech" },
    { name: "Music", component: Music, label: "Arts" },
    { name: "Book", component: Book, label: "Education" },
    { name: "Camera", component: Camera, label: "Media" }
  ];

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "CircleDollarSign": return CircleDollarSign;
      case "Lightbulb": return Lightbulb;
      case "Rocket": return Rocket;
      case "Globe": return Globe;
      case "Heart": return Heart;
      case "Code": return Code;
      case "Music": return Music;
      case "Book": return Book;
      case "Camera": return Camera;
      default: return CircleDollarSign;
    }
  };

  const togglePreviewMode = () => {
    // Only allow preview if form has no errors
    if (!isPreviewMode) {
      const isValid = validateForm();
      if (isValid) {
        setIsPreviewMode(true);
      }
    } else {
      setIsPreviewMode(false);
    }
  };

  const handlePreviewImageNav = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setPreviewImageIndex((prevIndex) => (prevIndex - 1 + imagePreviewUrls.length) % imagePreviewUrls.length);
    } else if (direction === 'next') {
      setPreviewImageIndex((prevIndex) => (prevIndex + 1) % imagePreviewUrls.length);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-block">
                  {isPreviewMode ? "Campaign Preview" : "Start a New Campaign"}
                </h2>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={togglePreviewMode}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-purple-500 text-purple-600 hover:bg-purple-50 transition-colors"
                  >
                    {isPreviewMode ? (
                      <>
                        <Edit2 size={18} />
                        <span className="font-text">Edit</span>
                      </>
                    ) : (
                      <>
                        <Eye size={18} />
                        <span className="font-text">Preview</span>
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </motion.button>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isPreviewMode ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6"
                >
                  <div className="mb-4">
                    <p className="text-gray-500 font-text text-sm">Preview shows how your campaign will appear on the campaigns page:</p>
                  </div>
                  
                  <div className="bg-neutral-100 p-6 rounded-xl">
                    <div className="max-w-7xl mx-auto">
                      <div className="bg-neutral-800 rounded-xl overflow-hidden">
                        {imagePreviewUrls.length > 0 ? (
                          <div className="relative w-full h-64 bg-neutral-700">
                            <AnimatePresence mode="wait">
                              <motion.img
                                key={previewImageIndex}
                                src={imagePreviewUrls[previewImageIndex]}
                                alt="Campaign Preview"
                                className="w-full h-full object-cover"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              />
                            </AnimatePresence>
                            
                            {imagePreviewUrls.length > 1 && (
                              <>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                  {imagePreviewUrls.map((_, index) => (
                                    <button
                                      key={index}
                                      onClick={() => setPreviewImageIndex(index)}
                                      className={`w-2 h-2 rounded-full transition-colors ${
                                        index === previewImageIndex ? "bg-white" : "bg-white/50"
                                      }`}
                                    />
                                  ))}
                                </div>

                                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
                                  <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handlePreviewImageNav('prev')}
                                    className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                                  >
                                    <ChevronLeft size={20} />
                                  </motion.button>

                                  <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handlePreviewImageNav('next')}
                                    className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                                  >
                                    <ChevronRight size={20} />
                                  </motion.button>
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-64 bg-neutral-700 flex items-center justify-center">
                            <p className="text-white/50 font-text">No images uploaded</p>
                          </div>
                        )}
                        <div className="p-6 space-y-6">
                          <div className="flex items-start gap-6">
                            <div className="h-16 w-16 bg-neutral-700 rounded-full flex-shrink-0 flex items-center justify-center">
                              {React.createElement(getIconComponent(formData.icon), {
                                size: 32,
                                className: "text-purple-500"
                              })}
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between items-start gap-4">
                                <div>
                                  <h3 className="text-white font-block text-2xl mb-2">
                                    {formData.title || "Campaign Title"}
                                  </h3>
                                  <p className="text-neutral-400 font-text text-lg">
                                    {formData.description || "Campaign description will appear here."}
                                  </p>
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="bg-purple-600 text-white px-8 py-3 rounded-lg font-text hover:bg-purple-700 transition-colors flex items-center gap-2 text-lg"
                                >
                                  <CircleDollarSign size={24} />
                                  Fund
                                </motion.button>
                              </div>
                              <div className="mt-6">
                                <div className="w-full bg-neutral-700 rounded-full h-3 overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "0%" }}
                                    transition={{ duration: 1 }}
                                    className="h-full bg-purple-600"
                                  />
                                </div>
                                <p className="text-white font-text mt-3 text-lg">
                                  0 of {formData.targetAmount || "0"} eth
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-6">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={togglePreviewMode}
                      className="px-6 py-2 rounded-lg border-2 border-gray-200 text-gray-700 font-text hover:bg-gray-50 transition-colors"
                    >
                      Back to Edit
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      className="px-6 py-2 rounded-lg bg-purple-600 text-white font-text hover:bg-purple-700 transition-colors"
                    >
                      Create Campaign
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="p-6 space-y-6"
                >
                  <div className="space-y-2">
                    <label className="block font-text text-gray-700">Campaign Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none font-text"
                      placeholder="Enter your campaign title"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm font-text flex items-center gap-1">
                        <AlertCircle size={16} />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block font-text text-gray-700">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none font-text min-h-[120px]"
                      placeholder="Describe your campaign in detail"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm font-text flex items-center gap-1">
                        <AlertCircle size={16} />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block font-text text-gray-700">Target Amount (ETH)</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        min="0.000000000000000001"
                        value={formData.targetAmount}
                        onChange={handleTargetAmountChange}
                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none font-text"
                        placeholder="0.00"
                      />
                    </div>
                    {errors.targetAmount && (
                      <p className="text-red-500 text-sm font-text flex items-center gap-1">
                        <AlertCircle size={16} />
                        {errors.targetAmount}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 font-text">
                      Enter any amount greater than 0 ETH (up to 18 decimal places)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block font-text text-gray-700">Campaign Icon</label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {iconOptions.map((icon) => {
                        const IconComponent = icon.component;
                        return (
                          <motion.button
                            key={icon.name}
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFormData({ ...formData, icon: icon.name })}
                            className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-colors ${
                              formData.icon === icon.name
                                ? "border-purple-500 bg-purple-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <IconComponent size={24} className={formData.icon === icon.name ? "text-purple-600" : "text-gray-600"} />
                            <span className="text-sm font-text">{icon.label}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                    {errors.icon && (
                      <p className="text-red-500 text-sm font-text flex items-center gap-1">
                        <AlertCircle size={16} />
                        {errors.icon}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block font-text text-gray-700">Campaign Images</label>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        isDragging ? "border-purple-500 bg-purple-50" : "border-gray-200"
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <Upload size={32} className="text-gray-400" />
                        <p className="font-text text-gray-500">
                          Drag and drop images here or click to upload
                        </p>
                        <p className="text-sm text-gray-400">
                          (Maximum 5 images, PNG, JPG up to 5MB each)
                        </p>
                      </label>
                    </div>

                    {imagePreviewUrls.length > 0 && (
                      <div className="grid grid-cols-5 gap-2 mt-4">
                        {imagePreviewUrls.map((url, index) => (
                          <div key={url} className="relative group">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </motion.button>
                          </div>
                        ))}
                      </div>
                    )}

                    {errors.images && (
                      <p className="text-red-500 text-sm font-text flex items-center gap-1">
                        <AlertCircle size={16} />
                        {errors.images}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onClose}
                      className="px-6 py-2 rounded-lg border-2 border-gray-200 text-gray-700 font-text hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-2 rounded-lg bg-purple-600 text-white font-text hover:bg-purple-700 transition-colors"
                    >
                      Create Campaign
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
