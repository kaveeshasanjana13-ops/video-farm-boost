import { getBaseUrl } from '@/contexts/utils/auth.api';

export interface SignedUrlResponse {
  success: boolean;
  message: string;
  uploadUrl: string;
  publicUrl: string;
  relativePath: string;
  expiresAt: string | null;
  maxFileSize?: number;
}

export const getSignedUrl = async (
  folder: string,
  fileName: string,
  contentType: string,
  fileSize: number
): Promise<SignedUrlResponse> => {
  const token = localStorage.getItem('access_token');
  const params = new URLSearchParams({
    folder,
    fileName,
    contentType,
    fileSize: fileSize.toString(),
    expiresIn: '600'
  });

  console.log('📤 Requesting signed URL:', {
    url: `${getBaseUrl()}/upload/generate-signed-url?${params}`,
    folder,
    fileName,
    contentType,
    fileSize
  });

  const response = await fetch(`${getBaseUrl()}/upload/generate-signed-url?${params}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      folder,
      fileName,
      contentType,
      fileSize,
      expiresIn: 600
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Signed URL error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorText
    });
    throw new Error(`Failed to get signed URL: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  console.log('✅ Signed URL response:', result);
  return result.data;
};

export const uploadToSignedUrl = async (
  uploadUrl: string,
  file: Blob,
  contentType: string,
  maxFileSize: number
): Promise<void> => {
  console.log('📤 Uploading to signed URL:', { contentType, size: file.size, maxFileSize });
  
  try {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
        'x-goog-content-length-range': `0,${maxFileSize}`
      },
      body: file,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('❌ Upload error:', {
        status: response.status,
        error: errorText
      });
      throw new Error(`Upload failed with status ${response.status}. Please contact support.`);
    }
    
    console.log('✅ File uploaded successfully');
  } catch (error) {
    console.error('❌ Upload failed:', error);
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Unable to upload file. This may be due to server configuration (CORS). Please contact your system administrator.');
    }
    throw error;
  }
};

export const verifyAndPublish = async (relativePath: string): Promise<void> => {
  const token = localStorage.getItem('access_token');
  
  console.log('📤 Verifying and publishing:', { relativePath });
  
  const response = await fetch(`${getBaseUrl()}/upload/verify-and-publish`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ relativePath }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Verify/publish error:', {
      status: response.status,
      error: errorText
    });
    throw new Error(`Failed to verify and publish: ${response.status}`);
  }
  
  console.log('✅ File verified and published');
};

// Auto-detect folder based on file type and context
export const detectFolder = (file: File, context?: 'homework' | 'payment' | 'correction' | 'profile' | 'institute' | 'subject' | 'student' | 'id-document' | 'institute-user'): string => {
  const mimeType = file.type;
  const isImage = mimeType.startsWith('image/');
  const isPdf = mimeType === 'application/pdf';
  
  if (context === 'homework') return 'homework-files';
  if (context === 'correction') return 'correction-files';
  if (context === 'payment') return 'payment-receipts';
  if (context === 'id-document') return 'id-documents';
  if (context === 'profile') return 'profile-images';
  if (context === 'institute') return 'institute-images';
  if (context === 'subject') return 'subject-images';
  if (context === 'student') return 'student-images';
  if (context === 'institute-user') return 'institute-user-images';
  
  // Default fallback based on file type
  if (isImage) return 'profile-images';
  if (isPdf) return 'homework-files';
  return 'homework-files';
};

// Complete upload workflow: get signed URL → upload → return relativePath
export const uploadFileSimple = async (
  file: File,
  folder: string,
  onProgress?: (message: string, progress: number) => void
): Promise<string> => {
  try {
    // Step 1: Get signed URL
    onProgress?.('Getting upload URL...', 0);
    const contentType = file.type || 'application/octet-stream';
    const signedUrlData = await getSignedUrl(folder, file.name, contentType, file.size);
    
    // Step 2: Upload to signed URL
    onProgress?.('Uploading file...', 50);
    await uploadToSignedUrl(signedUrlData.uploadUrl, file, contentType, signedUrlData.maxFileSize || file.size);
    
    // Step 3: Return relativePath
    onProgress?.('Upload complete!', 100);
    return signedUrlData.relativePath;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};
