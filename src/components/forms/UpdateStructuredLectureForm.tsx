import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  X, Save, Video, FileText, Image, Upload, Loader2, Paperclip,
  Link2, HardDrive, CheckCircle2, AlertCircle, Plus, Cloud, ExternalLink, Users,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { structuredLecturesApi, StructuredLecture, UpdateStructuredLectureDto, LectureDocumentInput } from '@/api/structuredLectures.api';
import { getErrorMessage } from '@/api/apiError';
import { uploadWithSignedUrl } from '@/utils/signedUploadHelper';
import { driveAccessApi, uploadToGoogleDrive } from '@/api/driveAccess.api';
import { instituteDriveApi, InstituteDriveStatus } from '@/api/instituteDriveAccess.api';
import { uploadToInstituteDrive } from '@/lib/instituteDriveUpload';

// ─── Local types ──────────────────────────────────────────────────────────────

type DriveDestination = 'institute' | 'personal';

interface DocEntry {
  documentName: string;
  documentUrl: string;
  driveFileId?: string;
  driveWebViewLink?: string;
  source: 'GOOGLE_DRIVE' | 'GOOGLE_DRIVE_INSTITUTE' | 'MANUAL' | string;
}

interface DriveStatusState {
  checked: boolean;
  connected: boolean;
  email?: string;
}

interface UpdateStructuredLectureFormProps {
  lecture: StructuredLecture;
  onClose: () => void;
  onSuccess: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const UpdateStructuredLectureForm = ({ lecture, onClose, onSuccess }: UpdateStructuredLectureFormProps) => {
  const { selectedInstitute, selectedClass, selectedSubject, selectedClassGrade } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // ── Basic fields ──────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    title: lecture.title || '',
    description: lecture.description || '',
    lessonNumber: lecture.lessonNumber || 1,
    lectureNumber: lecture.lectureNumber || 1,
    lectureVideoUrl: lecture.lectureVideoUrl || '',
    lectureLink: lecture.lectureLink || '',
    provider: lecture.provider || '',
    isActive: lecture.isActive ?? true,
  });

  // ── Cover image ───────────────────────────────────────────────────────────
  const [coverMode, setCoverMode] = useState<'upload' | 'url'>(
    lecture.coverImageUrl ? 'url' : 'upload',
  );
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [coverUrlInput, setCoverUrlInput] = useState(lecture.coverImageUrl || '');
  const coverRef = useRef<HTMLInputElement>(null);

  // ── Documents ─────────────────────────────────────────────────────────────
  // Initialise from existing lecture docs
  const [docs, setDocs] = useState<DocEntry[]>(
    lecture.documents?.map(d => ({
      documentName: d.documentName || d.name,
      documentUrl: d.documentUrl || d.url,
      driveFileId: d.driveFileId,
      driveWebViewLink: d.driveWebViewLink,
      source: d.source || 'MANUAL',
    })) ?? [],
  );
  const [docTab, setDocTab] = useState<'drive' | 'manual'>('drive');

  // Drive state
  const [driveStatus, setDriveStatus] = useState<DriveStatusState>({ checked: false, connected: false });
  const [driveUploading, setDriveUploading] = useState(false);
  const [driveUploadProgress, setDriveUploadProgress] = useState('');
  const driveFileRef = useRef<HTMLInputElement>(null);

  // Institute Drive state
  const [driveDestination, setDriveDestination] = useState<DriveDestination>('institute');
  const [instituteDriveStatus, setInstituteDriveStatus] = useState<InstituteDriveStatus | null>(null);
  const [instituteDriveChecked, setInstituteDriveChecked] = useState(false);

  // Manual URL state
  const [manualName, setManualName] = useState('');
  const [manualUrl, setManualUrl] = useState('');

  // ── Cover image handlers ──────────────────────────────────────────────────

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file', description: 'Cover must be an image file.', variant: 'destructive' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Cover image must be under 10 MB.', variant: 'destructive' });
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const clearCover = () => {
    setCoverFile(null);
    setCoverPreview('');
    if (coverRef.current) coverRef.current.value = '';
  };

  // ── Drive handlers ────────────────────────────────────────────────────────

  const checkDriveStatus = async () => {
    try {
      const status = await driveAccessApi.getStatus();
      setDriveStatus({ checked: true, connected: status.isConnected, email: status.googleEmail });
    } catch {
      setDriveStatus({ checked: true, connected: false });
    }
  };

  const checkInstituteDriveStatus = async () => {
    const instId = String(selectedInstitute?.id || lecture.instituteId);
    if (!instId) return;
    try {
      const s = await instituteDriveApi.getStatus(instId);
      setInstituteDriveStatus(s);
      if (s.isConnected) setDriveDestination('institute');
    } catch {
      setInstituteDriveStatus({ isConnected: false });
    } finally {
      setInstituteDriveChecked(true);
    }
  };

  const handleDocTabChange = (tab: 'drive' | 'manual') => {
    setDocTab(tab);
    if (tab === 'drive') {
      if (!driveStatus.checked) checkDriveStatus();
      if (!instituteDriveChecked) checkInstituteDriveStatus();
    }
  };

  const handleConnectDrive = async () => {
    try {
      const returnUrl = window.location.pathname + window.location.search;
      const { authUrl } = await driveAccessApi.getConnectUrl(returnUrl);
      window.location.href = authUrl;
    } catch {
      toast({ title: 'Error', description: 'Could not get Google Drive authorization URL.', variant: 'destructive' });
    }
  };

  const handleDriveFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (driveFileRef.current) driveFileRef.current.value = '';

    const instId = String(selectedInstitute?.id || lecture.instituteId);

    setDriveUploading(true);
    try {
      if (driveDestination === 'institute' && instituteDriveStatus?.isConnected && instId) {
        // ── Institute Drive upload ──
        setDriveUploadProgress('Uploading to institute Drive…');
        const registered = await uploadToInstituteDrive({
          file,
          instituteId: instId,
          purpose: 'LECTURE_DOCUMENT',
          folderParams: {
            grade: selectedClassGrade || lecture.grade,
            className: selectedClass?.name,
            subjectName: selectedSubject?.name,
          },
          referenceType: 'structured_lecture',
          referenceId: lecture._id,
          onProgress: (p) => setDriveUploadProgress(`Uploading… ${p}%`),
        });

        setDocs(prev => [...prev, {
          documentName: registered.fileName,
          documentUrl: registered.viewUrl || registered.driveWebViewLink || `https://drive.google.com/file/d/${registered.driveFileId}/view`,
          driveFileId: registered.driveFileId,
          driveWebViewLink: registered.driveWebViewLink,
          source: 'GOOGLE_DRIVE_INSTITUTE',
        }]);

        toast({ title: 'Uploaded', description: `"${registered.fileName}" saved to institute Drive.` });
      } else {
        // ── Personal Drive upload ──
        setDriveUploadProgress('Getting Drive access token…');
        const { accessToken } = await driveAccessApi.getToken();

        setDriveUploadProgress('Getting upload folder…');
        const { folderId } = await driveAccessApi.getFolder('LECTURE_DOCUMENT');

        setDriveUploadProgress(`Uploading ${file.name}…`);
        const { driveFileId, fileName } = await uploadToGoogleDrive(file, accessToken, folderId);

        setDriveUploadProgress('Registering file…');
        const registered = await driveAccessApi.registerFile({
          driveFileId,
          purpose: 'LECTURE_DOCUMENT',
          referenceType: 'structured_lecture',
          referenceId: lecture._id,
        });

        setDocs(prev => [...prev, {
          documentName: registered.fileName || fileName,
          documentUrl: registered.viewUrl,
          driveFileId: registered.driveFileId,
          driveWebViewLink: registered.viewUrl,
          source: 'GOOGLE_DRIVE',
        }]);

        toast({ title: 'Uploaded', description: `"${registered.fileName}" saved to Google Drive.` });
      }
    } catch (err: any) {
      if (err?.status === 401 || err?.statusCode === 401) {
        setDriveStatus({ checked: true, connected: false });
        toast({ title: 'Drive disconnected', description: 'Please reconnect your Google Drive.', variant: 'destructive' });
      } else {
        toast({ title: 'Upload failed', description: err?.message || 'Unknown error', variant: 'destructive' });
      }
    } finally {
      setDriveUploading(false);
      setDriveUploadProgress('');
    }
  };

  // ── Manual URL handler ────────────────────────────────────────────────────

  const handleAddManualDoc = () => {
    const name = manualName.trim();
    const url = manualUrl.trim();
    if (!name || !url) {
      toast({ title: 'Required', description: 'Enter both a name and a URL.', variant: 'destructive' });
      return;
    }
    try { new URL(url); } catch {
      toast({ title: 'Invalid URL', description: 'Please enter a valid URL.', variant: 'destructive' });
      return;
    }
    setDocs(prev => [...prev, { documentName: name, documentUrl: url, source: 'MANUAL' }]);
    setManualName('');
    setManualUrl('');
  };

  const removeDoc = (idx: number) => setDocs(prev => prev.filter((_, i) => i !== idx));

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }

    setLoading(true);
    try {
      let coverImageUrl: string | undefined = lecture.coverImageUrl || undefined;

      if (coverMode === 'upload' && coverFile) {
        setUploadMsg('Uploading cover image…');
        coverImageUrl = await uploadWithSignedUrl(coverFile, 'subject-images');
      } else if (coverMode === 'url') {
        coverImageUrl = coverUrlInput.trim() || undefined;
      }

      setUploadMsg('Saving lecture…');

      const documents: LectureDocumentInput[] = docs.map(d => ({
        documentName: d.documentName,
        documentUrl: d.documentUrl,
        driveFileId: d.driveFileId,
        driveWebViewLink: d.driveWebViewLink,
        source: d.source,
      }));

      const payload: UpdateStructuredLectureDto = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        lessonNumber: formData.lessonNumber,
        lectureNumber: formData.lectureNumber,
        lectureVideoUrl: formData.lectureVideoUrl.trim() || undefined,
        lectureLink: formData.lectureLink.trim() || undefined,
        coverImageUrl,
        documents,  // always send (even empty array = clears all docs)
        provider: formData.provider.trim() || undefined,
        isActive: formData.isActive,
      };

      await structuredLecturesApi.update(lecture._id, payload);
      toast({ title: 'Success', description: 'Lecture updated successfully.' });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({ title: 'Error', description: getErrorMessage(error, 'Failed to update lecture'), variant: 'destructive' });
    } finally {
      setLoading(false);
      setUploadMsg('');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFieldErrors(prev => ({ ...prev, [field]: '' }));
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const activeCoverPreview = coverMode === 'upload' ? coverPreview : coverUrlInput.trim();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Update Lecture
        </CardTitle>
        <CardDescription>Edit lecture details</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Basic fields ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Lecture title"
                className={fieldErrors.title ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              {fieldErrors.title && <p className="text-xs text-destructive mt-1">{fieldErrors.title}</p>}
            </div>

            <div>
              <Label htmlFor="lessonNumber">Lesson Number</Label>
              <Input
                id="lessonNumber"
                type="number"
                min="1"
                value={formData.lessonNumber}
                onChange={(e) => handleInputChange('lessonNumber', parseInt(e.target.value) || 1)}
              />
            </div>

            <div>
              <Label htmlFor="lectureNumber">Lecture Number</Label>
              <Input
                id="lectureNumber"
                type="number"
                min="1"
                value={formData.lectureNumber}
                onChange={(e) => handleInputChange('lectureNumber', parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Lecture description"
              rows={3}
            />
          </div>

          {/* ── Video / links ── */}
          <div className="space-y-3 border-t pt-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Video className="h-4 w-4 text-muted-foreground" />
              Video Content
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Recording */}
              <div className="rounded-xl border border-border/50 bg-muted/20 p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Video className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <Label htmlFor="lectureVideoUrl" className="text-sm font-medium leading-none">Recording URL</Label>
                    <p className="text-[11px] text-muted-foreground mt-0.5">YouTube, Drive, or storage link — students can Watch inline</p>
                  </div>
                </div>
                <Input
                  id="lectureVideoUrl"
                  value={formData.lectureVideoUrl}
                  onChange={(e) => handleInputChange('lectureVideoUrl', e.target.value)}
                  placeholder="https://youtu.be/… or storage URL"
                  className="text-sm"
                />
                {formData.lectureVideoUrl.trim() && (
                  <a
                    href={formData.lectureVideoUrl.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" /> Preview link
                  </a>
                )}
              </div>

              {/* Meeting */}
              <div className="rounded-xl border border-border/50 bg-muted/20 p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Users className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  <div>
                    <Label htmlFor="lectureLink" className="text-sm font-medium leading-none">Meeting Link</Label>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Zoom, Google Meet, Teams — opens externally for students</p>
                  </div>
                </div>
                <Input
                  id="lectureLink"
                  value={formData.lectureLink}
                  onChange={(e) => handleInputChange('lectureLink', e.target.value)}
                  placeholder="https://zoom.us/j/… or meet.google.com/…"
                  className="text-sm"
                />
                {formData.lectureLink.trim() && (
                  <a
                    href={formData.lectureLink.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" /> Preview link
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* ── Cover image ── */}
          <div className="space-y-3 border-t pt-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Image className="h-4 w-4 text-muted-foreground" />
              Cover Image
            </h3>

            {/* Mode toggle */}
            <div className="flex items-center bg-muted rounded-xl p-1 gap-1 w-fit">
              <button
                type="button"
                onClick={() => setCoverMode('upload')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  coverMode === 'upload' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Upload className="h-3.5 w-3.5" /> Upload File
              </button>
              <button
                type="button"
                onClick={() => setCoverMode('url')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  coverMode === 'url' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Link2 className="h-3.5 w-3.5" /> Enter URL
              </button>
            </div>

            {coverMode === 'upload' ? (
              <div className="flex items-start gap-4">
                {(coverPreview || lecture.coverImageUrl) && (
                  <div className="relative shrink-0">
                    <img
                      src={coverPreview || lecture.coverImageUrl}
                      alt="Cover preview"
                      className="w-24 h-24 object-cover rounded-xl border"
                    />
                    {coverPreview && (
                      <button
                        type="button"
                        onClick={clearCover}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                )}
                <div>
                  <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverFileChange} />
                  <Button type="button" variant="outline" size="sm" onClick={() => coverRef.current?.click()} className="gap-2">
                    <Image className="h-4 w-4" />
                    {lecture.coverImageUrl || coverFile ? 'Replace Image' : 'Choose Image'}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP — max 10 MB (uploaded to S3)</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Input
                  value={coverUrlInput}
                  onChange={(e) => setCoverUrlInput(e.target.value)}
                  placeholder="https://example.com/cover.jpg"
                />
                {coverUrlInput.trim() && (
                  <img
                    src={coverUrlInput.trim()}
                    alt="Cover preview"
                    className="w-32 h-20 object-cover rounded-xl border"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
                <p className="text-xs text-muted-foreground">Direct image URL (must be publicly accessible)</p>
              </div>
            )}
          </div>

          {/* ── Reference documents ── */}
          <div className="space-y-3 border-t pt-4">
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Reference Documents
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Upload to the institute's shared Drive or your personal Drive — files never pass through our servers.
              </p>
            </div>

            {/* Mode toggle */}
            <div className="flex items-center bg-muted rounded-xl p-1 gap-1 w-fit">
              <button
                type="button"
                onClick={() => handleDocTabChange('drive')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  docTab === 'drive' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <HardDrive className="h-3.5 w-3.5" /> Google Drive
              </button>
              <button
                type="button"
                onClick={() => handleDocTabChange('manual')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  docTab === 'manual' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Link2 className="h-3.5 w-3.5" /> Manual URL
              </button>
            </div>

            {/* ── Google Drive tab ── */}
            {docTab === 'drive' && (
              <div className="space-y-3">
                {/* Drive destination selector */}
                {instituteDriveChecked && instituteDriveStatus?.isConnected && (
                  <div className="flex items-center bg-muted rounded-xl p-1 gap-1 w-fit">
                    <button
                      type="button"
                      onClick={() => setDriveDestination('institute')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        driveDestination === 'institute' ? 'bg-blue-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <HardDrive className="h-3 w-3" /> Institute Drive
                    </button>
                    <button
                      type="button"
                      onClick={() => setDriveDestination('personal')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        driveDestination === 'personal' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Cloud className="h-3 w-3" /> Personal Drive
                    </button>
                  </div>
                )}

                {/* Connection status */}
                {driveDestination === 'institute' && instituteDriveStatus?.isConnected ? (
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 rounded-xl px-3 py-2 border border-blue-200 dark:border-blue-800">
                    <HardDrive className="h-4 w-4 shrink-0" />
                    <span>Institute Drive <strong>{instituteDriveStatus.googleEmail}</strong></span>
                  </div>
                ) : driveDestination === 'personal' || !instituteDriveStatus?.isConnected ? (
                  <>
                    {!driveStatus.checked ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Checking Drive connection…
                      </div>
                    ) : driveStatus.connected ? (
                      <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl px-3 py-2 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>Connected as <strong>{driveStatus.email}</strong></span>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
                        <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Google Drive not connected</p>
                          <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">Connect once to upload lecture documents to your Google Drive.</p>
                        </div>
                        <Button type="button" size="sm" variant="outline" onClick={handleConnectDrive} className="shrink-0 gap-1.5 text-xs border-amber-300">
                          <Cloud className="h-3.5 w-3.5" /> Connect
                        </Button>
                      </div>
                    )}
                  </>
                ) : null}

                {/* Upload button */}
                {((driveDestination === 'institute' && instituteDriveStatus?.isConnected) ||
                  (driveDestination === 'personal' && driveStatus.connected)) && (
                  <div>
                    <input
                      ref={driveFileRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,image/*"
                      className="hidden"
                      onChange={handleDriveFileSelect}
                      disabled={driveUploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => driveFileRef.current?.click()}
                      disabled={driveUploading}
                      className="gap-2"
                    >
                      {driveUploading ? (
                        <><Loader2 className="h-4 w-4 animate-spin" />{driveUploadProgress || 'Uploading…'}</>
                      ) : (
                        <><Paperclip className="h-4 w-4" />Upload to {driveDestination === 'institute' ? 'Institute' : 'Google'} Drive</>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">PDF, Word, PowerPoint, Excel, images</p>
                  </div>
                )}
              </div>
            )}

            {/* ── Manual URL tab ── */}
            {docTab === 'manual' && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="Document name"
                    className="text-sm w-44 shrink-0"
                  />
                  <Input
                    value={manualUrl}
                    onChange={(e) => setManualUrl(e.target.value)}
                    placeholder="https://… (document URL)"
                    className="text-sm flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddManualDoc())}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddManualDoc}
                    className="shrink-0 gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Any accessible URL — Google Drive share link, Dropbox, direct file link, etc.
                </p>
              </div>
            )}

            {/* ── Shared document list ── */}
            {docs.length > 0 ? (
              <ul className="space-y-1 mt-1">
                {docs.map((doc, i) => (
                  <li key={i} className="flex items-center gap-2 bg-muted/60 rounded-xl px-3 py-2 text-sm">
                    <div className={`shrink-0 ${doc.source === 'GOOGLE_DRIVE_INSTITUTE' ? 'text-blue-600' : doc.source === 'GOOGLE_DRIVE' ? 'text-blue-500' : 'text-muted-foreground'}`}>
                      {doc.source === 'GOOGLE_DRIVE_INSTITUTE' || doc.source === 'GOOGLE_DRIVE' ? <HardDrive className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
                    </div>
                    <a
                      href={doc.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 truncate text-foreground hover:text-primary hover:underline"
                    >
                      {doc.documentName}
                    </a>
                    <span className={`text-[10px] shrink-0 px-1.5 py-0.5 rounded-full ${
                      doc.source === 'GOOGLE_DRIVE_INSTITUTE' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'text-muted-foreground bg-muted'
                    }`}>
                      {doc.source === 'GOOGLE_DRIVE_INSTITUTE' ? 'Institute' : doc.source === 'GOOGLE_DRIVE' ? 'Personal' : 'Manual'}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeDoc(i)}
                      className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground italic">No documents attached. Add via Google Drive or manual URL above.</p>
            )}
          </div>

          {/* ── Provider & Active ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
            <div>
              <Label htmlFor="provider">Provider / Instructor</Label>
              <Input
                id="provider"
                value={formData.provider}
                onChange={(e) => handleInputChange('provider', e.target.value)}
                placeholder="e.g. Dr. Jane Smith"
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(v) => handleInputChange('isActive', v)}
              />
              <Label htmlFor="isActive">Active (visible to students)</Label>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            {uploadMsg && (
              <span className="text-sm text-muted-foreground flex items-center gap-2 mr-auto">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {uploadMsg}
              </span>
            )}
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {loading ? 'Saving…' : 'Update Lecture'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdateStructuredLectureForm;
