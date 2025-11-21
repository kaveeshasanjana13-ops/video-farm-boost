import { getBaseUrl } from '@/contexts/utils/auth.api';

export type UploadFolder = 
  | 'profile-images'
  | 'student-images'
  | 'institute-images'
  | 'institute-user-images'
  | 'subject-images'
  | 'homework-files'
  | 'correction-files'
  | 'payment-receipts'
  | 'id-documents';

interface SignedUrlResponse {
  success: boolean;
  message: string;
  data: {
    uploadUrl: string;
    relativePath: string;
    expiresAt: string | null;
    maxFileSize: number;
    contentType: string;
  };
}

/**
 * Auto-detect folder based on file type
 */
export function detectFolder(file: File): UploadFolder {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  
  // Images
  if (type.startsWith('image/')) {
    if (name.includes('profile')) return 'profile-images';
    if (name.includes('student')) return 'student-images';
    if (name.includes('institute')) return 'institute-images';
    if (name.includes('subject')) return 'subject-images';
    return 'profile-images'; // default for images
  }
  
  // Documents and PDFs
  if (type === 'application/pdf' || type.includes('document')) {
    if (name.includes('homework') || name.includes('assignment')) return 'homework-files';
    if (name.includes('correction') || name.includes('corrected')) return 'correction-files';
    if (name.includes('payment') || name.includes('receipt') || name.includes('slip')) return 'payment-receipts';
    if (name.includes('id') || name.includes('identity') || name.includes('card')) return 'id-documents';
    return 'homework-files'; // default for documents
  }
  
  return 'homework-files'; // fallback
}

/**
 * Upload file using signed URL flow
 * Returns relativePath to send to backend
 */
export async function uploadWithSignedUrl(
  file: File,
  folder: UploadFolder,
  onProgress?: (message: string, progress: number) => void
): Promise<string> {
  const baseUrl = getBaseUrl();
  const token = localStorage.getItem('access_token');

  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    // Step 1: Get signed URL
    onProgress?.('Getting upload URL...', 10);
    
    const contentType = file.type || 'application/octet-stream';
    const requestBody = {
      folder,
      fileName: file.name,
      contentType,
      fileSize: file.size,
      expiresIn: 600
    };

    const signedUrlResponse = await fetch(`${baseUrl}/upload/generate-signed-url`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!signedUrlResponse.ok) {
      const error = await signedUrlResponse.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to get signed URL');
    }

    const signedUrlData: SignedUrlResponse = await signedUrlResponse.json();
    const { uploadUrl, relativePath, maxFileSize } = signedUrlData.data;

    // Step 2: Upload file to signed URL
    onProgress?.('Uploading file...', 50);

    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
        'x-goog-content-length-range': `0,${maxFileSize}`
      },
      body: file
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed with status ${uploadResponse.status}`);
    }

    onProgress?.('Upload complete!', 100);

    // Return relativePath to be sent to backend
    return relativePath;
  } catch (error: any) {
    console.error('Upload failed:', error);
    throw new Error(error.message || 'Failed to upload file');
  }
}

/**
 * Upload with automatic folder detection
 */
export async function uploadFileAuto(
  file: File,
  onProgress?: (message: string, progress: number) => void
): Promise<string> {
  const folder = detectFolder(file);
  return uploadWithSignedUrl(file, folder, onProgress);
}
