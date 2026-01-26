import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Extract text from an image using Google Cloud Vision OCR (via backend)
 * @param {File} imageFile - Image file
 * @param {Function} onProgress - Optional progress callback (0-1)
 * @returns {Promise<string>} Extracted text
 */
export const extractTextFromImage = async (imageFile, onProgress = null) => {
  try {
    // Create FormData to send the image
    const formData = new FormData();
    formData.append('image', imageFile);

    // Get auth token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    // Simulate progress for better UX
    if (onProgress) {
      onProgress(0.2); // Starting
      setTimeout(() => onProgress(0.5), 100); // Uploading
      setTimeout(() => onProgress(0.8), 500); // Processing
    }

    // Call backend OCR API
    const response = await axios.post(
      `${API_BASE_URL}/ocr/extract-text`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            // Upload progress (0-80%)
            const uploadProgress = (progressEvent.loaded / progressEvent.total) * 0.8;
            onProgress(uploadProgress);
          }
        },
      }
    );

    if (onProgress) {
      onProgress(1.0); // Complete
    }

    if (response.data.success && response.data.data) {
      return response.data.data.text || '';
    }

    throw new Error(response.data.error?.message || 'Failed to extract text from image');
  } catch (error) {
    console.error('OCR Error:', error);
    
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please log in.');
    } else if (error.response?.status === 503) {
      throw new Error('OCR service is not available. Please contact administrator.');
    } else if (error.response?.data?.error?.message) {
      throw new Error(error.response.data.error.message);
    } else if (error.message) {
      throw error;
    } else {
      throw new Error('Failed to extract text from image. Please ensure the image is clear and try again.');
    }
  }
};

// Import and re-export the parseDriverLicense and parseInsuranceCard functions
import { parseDriverLicense as parseDriverLicenseUtil, parseInsuranceCard as parseInsuranceCardUtil } from '../utils/ocr.service';
export const parseDriverLicense = parseDriverLicenseUtil;
export const parseInsuranceCard = parseInsuranceCardUtil;

