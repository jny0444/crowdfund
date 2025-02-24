"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Upload, AlertCircle } from "lucide-react";
import { useState } from "react";

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  title: string;
  description: string;
  targetAmount: string;
  images: File[];
}

interface FormErrors {
  title?: string;
  description?: string;
  targetAmount?: string;
  images?: string;
}

export default function CampaignModal({ isOpen, onClose }: CampaignModalProps) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    targetAmount: "",
    images: []
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

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
                <h2 className="text-2xl font-block">Start a New Campaign</h2>
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

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
