import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Upload, CloudUpload, File, X, CheckCircle2, Loader2, ExternalLink,
  HardDrive, Cloud, Link2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { uploadWithSignedUrl, type UploadFolder } from '@/utils/signedUploadHelper';
import {
  checkDriveConnection,
  getDriveConnectUrl,
  DriveConnectionStatus,
} from '@/services/driveService';
import { getValidDriveToken } from '@/lib/driveTokenCache';
import type { DriveUploadPurpose } from '@/services/driveService';
import { useNavigate } from 'react-router-dom';

// ============================================
// Types
// ============================================

export interface UploadResult {
  method: 'upload' | 'google-drive';
  /** For cloud storage uploads - the relative path */
  relativePath?: string;
  /** For Google Drive - the file ID */
  driveFileId?: string;
  /** Access token used for Drive */
  accessToken?: string;
  /** Original file name */
  fileName: string;
  /** MIME type */
  mimeType: string;
  /** File size */
  fileSize: number;
}

export interface FileUploadZoneProps {
  /** Upload folder for cloud storage */
  folder: UploadFolder;
  /** Drive upload purpose (if Drive tab is shown) */
  drivePurpose?: DriveUploadPurpose;
  /** Drive reference type for registration */
  driveReferenceType?: string;
  /** Drive reference ID for registration */
  driveReferenceId?: string;
  /** Whether to show Google Drive tab */
  showDriveTab?: boolean;
  /** Called when upload completes */
  onUploadComplete: (result: UploadResult) => void;
  /** Called when file is cleared */
  onClear?: () => void;
  /** Max file size in bytes */
  maxFileSize?: number;
  /** Accepted file types */
  acceptedTypes?: string;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Label for the upload area */
  label?: string;
  /** Sub-label */
  subLabel?: string;
}

// Helper: Extract Google Drive file ID from various URL formats
function extractDriveFileId(input: string): string | null {
  const trimmed = input.trim();
  // Already a raw file ID (no slashes, no dots in domain)
  if (/^[a-zA-Z0-9_-]{10,}$/.test(trimmed)) return trimmed;
  // /d/{id}/ pattern
  const match1 = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match1) return match1[1];
  // ?id={id} pattern
  const match2 = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match2) return match2[1];
  // open?id={id}
  const match3 = trimmed.match(/open\?id=([a-zA-Z0-9_-]+)/);
  if (match3) return match3[1];
  return null;
}

// ============================================
// Component
// ============================================

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  folder,
  drivePurpose = 'GENERAL',
  driveReferenceType,
  driveReferenceId,
  showDriveTab = true,
  onUploadComplete,
  onClear,
  maxFileSize = 20 * 1024 * 1024,
  acceptedTypes = '.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip',
  disabled = false,
  label,
  subLabel,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [uploadMethod, setUploadMethod] = useState<'upload' | 'google-drive'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedResult, setUploadedResult] = useState<UploadResult | null>(null);

  // Drive state
  const [driveStatus, setDriveStatus] = useState<DriveConnectionStatus | null>(null);
  const [checkingDrive, setCheckingDrive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [driveChecked, setDriveChecked] = useState(false);

  // Drive file upload
  const [driveSelectedFile, setDriveSelectedFile] = useState<File | null>(null);
  const [isDriveUploading, setIsDriveUploading] = useState(false);
  const [driveUploadMessage, setDriveUploadMessage] = useState('');
  const [driveUploadProgress, setDriveUploadProgress] = useState(0);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  // Check Drive connection when Drive tab is selected
  const checkDriveConnectionStatus = useCallback(async () => {
    if (driveChecked) return;
    setCheckingDrive(true);
    try {
      const status = await checkDriveConnection();
      setDriveStatus(status);
    } catch {
      setDriveStatus({ isConnected: false });
    } finally {
      setCheckingDrive(false);
      setDriveChecked(true);
    }
  }, [driveChecked]);

  const handleDriveTabSelect = useCallback(() => {
    setUploadMethod('google-drive');
    checkDriveConnectionStatus();
  }, [checkDriveConnectionStatus]);

  const handleConnect = useCallback(async () => {
    setConnecting(true);
    try {
      const { authUrl } = await getDriveConnectUrl(window.location.pathname);
      window.location.href = authUrl;
    } catch {
      toast({
        title: 'Connect Google Drive',
        description: 'Please connect Google Drive from your Profile > Apps tab.',
      });
      navigate('/profile?tab=apps');
      setConnecting(false);
    }
  }, [navigate, toast]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > maxFileSize) {
      toast({
        title: 'File too large',
        description: `Please select a file smaller than ${formatFileSize(maxFileSize)}`,
        variant: 'destructive',
      });
      return;
    }
    setSelectedFile(file);
    setUploadedResult(null);
  }, [maxFileSize, toast]);

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setDriveSelectedFile(null);
    setUploadedResult(null);
    onClear?.();
  }, [onClear]);

  // Upload via cloud storage (signed URL)
  const uploadViaCloudStorage = useCallback(async (file: File) => {
    setIsUploading(true);
    try {
      const relativePath = await uploadWithSignedUrl(file, folder, (message, progress) => {
        setUploadMessage(message);
        setUploadProgress(progress);
      });

      const result: UploadResult = {
        method: 'upload',
        relativePath,
        fileName: file.name,
        mimeType: file.type || 'application/octet-stream',
        fileSize: file.size,
      };
      setUploadedResult(result);
      onUploadComplete(result);
      toast({ title: 'Upload complete', description: `${file.name} uploaded successfully` });
    } catch (error: any) {
      toast({ title: 'Upload Failed', description: error.message || 'Failed to upload', variant: 'destructive' });
    } finally {
      setIsUploading(false);
      setUploadMessage('');
      setUploadProgress(0);
    }
  }, [folder, onUploadComplete, toast]);

  // Handle Drive file selection
  const handleDriveFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > maxFileSize) {
      toast({
        title: 'File too large',
        description: `Please select a file smaller than ${formatFileSize(maxFileSize)}`,
        variant: 'destructive',
      });
      return;
    }
    setDriveSelectedFile(file);
    setUploadedResult(null);
  }, [maxFileSize, toast]);

  // Upload file to Google Drive via backend-managed token flow
  const handleDriveUpload = useCallback(async () => {
    if (!driveSelectedFile) return;
    setIsDriveUploading(true);
    setDriveUploadProgress(0);
    try {
      const { uploadAndRegisterFile } = await import('@/lib/driveUpload');
      // Get the access token so we can pass it to the submission API
      const tokenData = await getValidDriveToken();
      const result = await uploadAndRegisterFile({
        file: driveSelectedFile,
        purpose: drivePurpose,
        referenceType: driveReferenceType,
        referenceId: driveReferenceId,
        onProgress: (percent) => {
          setDriveUploadProgress(percent);
          if (percent < 10) setDriveUploadMessage('Getting token...');
          else if (percent < 85) setDriveUploadMessage('Uploading to Drive...');
          else setDriveUploadMessage('Registering...');
        },
      });

      const uploadResult: UploadResult = {
        method: 'google-drive',
        driveFileId: result.driveFileId,
        accessToken: tokenData.accessToken,
        fileName: result.fileName || driveSelectedFile.name,
        mimeType: result.mimeType || driveSelectedFile.type || 'application/octet-stream',
        fileSize: driveSelectedFile.size,
      };
      setUploadedResult(uploadResult);
      onUploadComplete(uploadResult);
      toast({ title: 'Upload complete', description: `${driveSelectedFile.name} uploaded to Google Drive` });
    } catch (error: any) {
      console.error('Drive upload error:', error);
      if (error.status === 401 || error.message?.includes('401')) {
        toast({
          title: 'Drive Session Expired',
          description: 'Please reconnect your Google Drive from Profile > Apps.',
          variant: 'destructive',
        });
        setDriveChecked(false);
      } else if (error.message?.includes('403')) {
        toast({
          title: 'Permission Denied',
          description: 'Google Drive permission error. Try reconnecting your Drive account.',
          variant: 'destructive',
        });
        setDriveChecked(false);
      } else {
        toast({
          title: 'Upload Failed',
          description: error.message || 'Failed to upload to Google Drive.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsDriveUploading(false);
      setDriveUploadMessage('');
      setDriveUploadProgress(0);
    }
  }, [driveSelectedFile, drivePurpose, driveReferenceType, driveReferenceId, onUploadComplete, toast]);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;
    await uploadViaCloudStorage(selectedFile);
  }, [selectedFile, uploadViaCloudStorage]);

  const isConnected = driveStatus?.isConnected === true;

  // If already uploaded/linked, show result
  if (uploadedResult) {
    return (
      <div className="flex items-center gap-2 p-2 rounded-lg bg-accent/50 border border-primary/20">
        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-[10px] sm:text-xs truncate">{uploadedResult.fileName}</p>
          <p className="text-[9px] text-muted-foreground">
            {uploadedResult.fileSize > 0 ? `${formatFileSize(uploadedResult.fileSize)} • ` : ''}
            {uploadedResult.method === 'google-drive' ? 'Google Drive' : 'Cloud Storage'}
          </p>
        </div>
        {uploadedResult.driveFileId && (
          <Button
            type="button" variant="ghost" size="sm"
            onClick={() => window.open(`https://drive.google.com/file/d/${uploadedResult.driveFileId}/view`, '_blank')}
            className="h-6 w-6 p-0 shrink-0"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        )}
        <Button
          type="button" variant="ghost" size="sm"
          onClick={clearFile}
          disabled={disabled}
          className="h-6 w-6 p-0 hover:text-destructive shrink-0"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Method selector tabs */}
      {showDriveTab && (
        <div className="flex gap-1 p-0.5 bg-muted rounded-lg">
          <button
            type="button"
            onClick={() => setUploadMethod('upload')}
            className={cn(
              'flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-md text-[10px] sm:text-xs font-medium transition-colors',
              uploadMethod === 'upload' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <HardDrive className="h-3 w-3" /> Upload
          </button>
          <button
            type="button"
            onClick={handleDriveTabSelect}
            className={cn(
              'flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-md text-[10px] sm:text-xs font-medium transition-colors',
              uploadMethod === 'google-drive' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Cloud className="h-3 w-3" /> Drive
          </button>
        </div>
      )}

      {/* Drive connection check */}
      {uploadMethod === 'google-drive' && checkingDrive && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-xs text-muted-foreground ml-2">Checking connection...</span>
        </div>
      )}

      {/* Drive not connected */}
      {uploadMethod === 'google-drive' && !checkingDrive && !isConnected && (
        <Card className="border-dashed">
          <CardContent className="py-4 text-center">
            <Cloud className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
            <p className="text-xs text-muted-foreground mb-2">Connect Google Drive to link files.</p>
            <Button type="button" size="sm" onClick={handleConnect} disabled={disabled || connecting} className="text-xs">
              {connecting ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Cloud className="h-3 w-3 mr-1" />}
              Connect Google Drive
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Cloud Storage: File picker + upload */}
      {uploadMethod === 'upload' && (
        <>
          {!selectedFile ? (
            <div>
              <input
                type="file"
                id="file-upload-zone-upload"
                onChange={handleFileSelect}
                accept={acceptedTypes}
                className="hidden"
                disabled={disabled || isUploading}
              />
              <label
                htmlFor="file-upload-zone-upload"
                className={cn(
                  'flex flex-col items-center justify-center w-full py-4 sm:py-5 border-2 border-dashed rounded-lg transition-all cursor-pointer',
                  disabled || isUploading
                    ? 'border-muted bg-muted/50 cursor-not-allowed'
                    : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 active:scale-[0.99]'
                )}
              >
                <Upload className="h-5 w-5 mb-1 text-muted-foreground" />
                <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                  {label || 'Tap to select file'}
                </p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground/70 mt-0.5">
                  {subLabel || `PDF, DOC, JPG, PNG (max ${formatFileSize(maxFileSize)})`}
                </p>
              </label>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-accent/50 border border-primary/20">
                <File className="h-3.5 w-3.5 text-primary shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[10px] sm:text-xs truncate">{selectedFile.name}</p>
                  <p className="text-[9px] text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                </div>
                <Button
                  type="button" variant="ghost" size="sm"
                  onClick={clearFile}
                  disabled={isUploading}
                  className="h-6 w-6 p-0 hover:text-destructive shrink-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <Button
                type="button"
                onClick={handleUpload}
                disabled={isUploading || disabled}
                className="w-full h-8 text-xs"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    {uploadMessage || 'Uploading...'}
                    {uploadProgress > 0 && <span className="ml-1">({uploadProgress}%)</span>}
                  </>
                ) : (
                  <><Upload className="h-3 w-3 mr-1" /> Upload File</>
                )}
              </Button>
            </div>
          )}
        </>
      )}

      {/* Google Drive: File picker + upload to Drive */}
      {uploadMethod === 'google-drive' && !checkingDrive && isConnected && (
        <div className="space-y-2">
          {!driveSelectedFile ? (
            <div>
              <input
                type="file"
                id="file-upload-zone-drive"
                onChange={handleDriveFileSelect}
                accept={acceptedTypes}
                className="hidden"
                disabled={disabled || isDriveUploading}
              />
              <label
                htmlFor="file-upload-zone-drive"
                className={cn(
                  'flex flex-col items-center justify-center w-full py-4 sm:py-5 border-2 border-dashed rounded-lg transition-all cursor-pointer',
                  disabled || isDriveUploading
                    ? 'border-muted bg-muted/50 cursor-not-allowed'
                    : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 active:scale-[0.99]'
                )}
              >
                <Cloud className="h-5 w-5 mb-1 text-muted-foreground" />
                <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                  {label || 'Tap to select file for Google Drive'}
                </p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground/70 mt-0.5">
                  {subLabel || `PDF, DOC, JPG, PNG (max ${formatFileSize(maxFileSize)})`}
                </p>
              </label>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-accent/50 border border-primary/20">
                <File className="h-3.5 w-3.5 text-primary shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[10px] sm:text-xs truncate">{driveSelectedFile.name}</p>
                  <p className="text-[9px] text-muted-foreground">{formatFileSize(driveSelectedFile.size)}</p>
                </div>
                <Button
                  type="button" variant="ghost" size="sm"
                  onClick={() => setDriveSelectedFile(null)}
                  disabled={isDriveUploading}
                  className="h-6 w-6 p-0 hover:text-destructive shrink-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <Button
                type="button"
                onClick={handleDriveUpload}
                disabled={isDriveUploading || disabled}
                className="w-full h-8 text-xs"
              >
                {isDriveUploading ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    {driveUploadMessage || 'Uploading...'}
                    {driveUploadProgress > 0 && <span className="ml-1">({driveUploadProgress}%)</span>}
                  </>
                ) : (
                  <><CloudUpload className="h-3 w-3 mr-1" /> Upload to Drive</>
                )}
              </Button>
            </div>
          )}

          {/* Drive connected status */}
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3 w-3 text-green-600" />
            <span className="text-[10px] text-muted-foreground">
              Connected as {driveStatus?.googleEmail || 'Google Account'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;
