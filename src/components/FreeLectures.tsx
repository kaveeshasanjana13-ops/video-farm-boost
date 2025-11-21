import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAttendanceUrl } from '@/contexts/utils/auth.api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Video, FileText, User, Calendar, ExternalLink, Download, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { format } from 'date-fns';
import VideoPreviewDialog from '@/components/VideoPreviewDialog';
import { enhancedCachedClient } from '@/api/enhancedCachedClient';
import { CACHE_TTL } from '@/config/cacheTTL';
import { useInstituteRole } from '@/hooks/useInstituteRole';

interface Attachment {
  documentName: string;
  documentUrl: string;
}

interface Lecture {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  grade: number;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  attachments: Attachment[] | null;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Helper function to extract YouTube video ID from URL
const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  const regexes = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    /(?:youtube\.com\/watch\?v=)([^"&?\/\s]{11})/,
    /(?:youtu\.be\/)([^"&?\/\s]{11})/
  ];
  
  for (const regex of regexes) {
    const match = url.match(regex);
    if (match) return match[1];
  }
  
  return null;
};


const FreeLectures = () => {
  const { selectedInstitute, selectedClass, selectedSubject, selectedClassGrade, user } = useAuth();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedLectures, setExpandedLectures] = useState<Record<string, boolean>>({});
  const [videoPreview, setVideoPreview] = useState<{ open: boolean; url: string; title: string }>({ 
    open: false, 
    url: '', 
    title: '' 
  });

  // Track current context to prevent unnecessary reloads
  const contextKey = `${selectedSubject?.id}-${selectedClassGrade}`;
  const [lastLoadedContext, setLastLoadedContext] = useState<string>('');

  // Auto-load free lectures when subject is selected
  useEffect(() => {
    if (selectedSubject && (selectedClassGrade !== null && selectedClassGrade !== undefined) && contextKey !== lastLoadedContext) {
      setLastLoadedContext(contextKey);
      fetchFreeLectures(false); // Auto-load from cache
    }
  }, [contextKey]);

  const handleLoadLectures = () => {
    if (selectedSubject && (selectedClassGrade !== null && selectedClassGrade !== undefined)) {
      fetchFreeLectures();
    }
  };

  const fetchFreeLectures = async (forceRefresh = false) => {
    if (!selectedSubject || selectedClassGrade === null || selectedClassGrade === undefined) return;

    setLoading(true);
    setError(null);

    try {
      const baseUrl = 'https://laas-backend-02-923357517997.europe-west1.run.app';
      const endpoint = `/api/structured-lectures/subject/${selectedSubject.id}/grade/${selectedClassGrade || selectedClass?.grade || 10}`;
      
      // Get JWT token from localStorage
      const token = localStorage.getItem('access_token');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'GET',
        headers
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          setLectures([]);
          setError(null);
          return;
        }
        if (response.status === 401) {
          setError('Authentication required. Please log in again.');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: Lecture[] = await response.json();
      setLectures(data);
    } catch (err: any) {
      console.error('Error fetching free lectures:', err);
      
      if (err.message?.includes('404')) {
        setLectures([]);
        setError(null);
        return;
      }
      
      setError('Error loading free lectures. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLecture = (videoUrl: string, title: string) => {
    if (videoUrl) {
      setVideoPreview({ open: true, url: videoUrl, title });
    }
  };

  const handleDownloadDocument = (documentUrl: string) => {
    const baseUrl = 'https://storage.googleapis.com/suraksha-lms';
    const fullUrl = documentUrl.startsWith('http') ? documentUrl : `${baseUrl}${documentUrl}`;
    window.open(fullUrl, '_blank');
  };

  const toggleLectureExpansion = (lectureId: string) => {
    setExpandedLectures(prev => ({
      ...prev,
      [lectureId]: !prev[lectureId]
    }));
  };

  if (!selectedSubject || selectedClassGrade === null || selectedClassGrade === undefined) {
    return (
      <div className="p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select a subject to view free lectures.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Free Lectures</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {selectedInstitute?.name} • {selectedClass?.name} • {selectedSubject.name}
          </p>
        </div>
        
        {/* Load Lectures Button */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex justify-center">
            <Button 
              onClick={handleLoadLectures}
              disabled={loading}
              size="sm"
            >
              {loading ? (
                <>
                  <Video className="h-4 w-4 mr-2 animate-pulse" />
                  Loading Lectures...
                </>
              ) : (
                <>
                  <Video className="h-4 w-4 mr-2" />
                  Load Free Lectures
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Subject Info Summary */}
      {lectures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Subject Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{lectures.length}</div>
                <div className="text-sm text-muted-foreground">Total Lectures</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{lectures.filter(l => l.isActive).length}</div>
                <div className="text-sm text-muted-foreground">Active Lectures</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{selectedClassGrade}</div>
                <div className="text-sm text-muted-foreground">Grade Level</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lessons and Lectures */}
      {lectures.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>There are no free lectures for this subject!</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {lectures.map((lecture, index) => {
            const youtubeId = getYouTubeVideoId(lecture.videoUrl || '');
            const isExpanded = expandedLectures[lecture.id];
            const baseUrl = 'https://storage.googleapis.com/suraksha-lms';
            const thumbnailUrl = lecture.thumbnailUrl ? 
              (lecture.thumbnailUrl.startsWith('http') ? lecture.thumbnailUrl : `${baseUrl}${lecture.thumbnailUrl}`) : 
              null;
            
            return (
              <Card key={lecture.id} className="overflow-hidden">
                {/* Cover Image */}
                {thumbnailUrl && (
                  <div className="relative w-full h-48 md:h-56 lg:h-48 bg-muted">
                    <img
                      src={thumbnailUrl}
                      alt={lecture.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Mobile View (< 768px) */}
                <div className="md:hidden p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="shrink-0 mt-1">
                      {index + 1}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm line-clamp-2">{lecture.title}</h4>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(lecture.createdAt), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                  
                  {lecture.videoUrl && (
                    <Button
                      onClick={() => handleJoinLecture(lecture.videoUrl!, lecture.title)}
                      disabled={!lecture.isActive}
                      className="w-full"
                      size="sm"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Watch Lecture
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => toggleLectureExpansion(lecture.id)}
                    className="w-full"
                    size="sm"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-2" />
                        View Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-2" />
                        View More
                      </>
                    )}
                  </Button>

                  {/* Expanded Content on Mobile */}
                  {isExpanded && (
                    <div className="space-y-3 pt-2">
                      <p className="text-sm text-muted-foreground">{lecture.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant={lecture.isActive ? "default" : "secondary"} className="text-xs">
                          {lecture.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>

                      {/* YouTube Embed */}
                      {youtubeId && (
                        <>
                          <Separator />
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium flex items-center gap-2">
                              <Play className="h-3 w-3" />
                              Lecture Video
                            </h5>
                            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                              <iframe
                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                                src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                                title={lecture.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {/* Documents */}
                      {lecture.attachments && lecture.attachments.length > 0 && (
                        <>
                          <Separator />
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium flex items-center gap-2">
                              <FileText className="h-3 w-3" />
                              Documents ({lecture.attachments.length})
                            </h5>
                            <div className="grid gap-2">
                              {lecture.attachments.map((doc, docIndex) => (
                                <div
                                  key={docIndex}
                                  className="flex items-center justify-between p-2 border rounded bg-muted/50"
                                >
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <FileText className="h-3 w-3 shrink-0" />
                                    <span className="text-xs truncate">{doc.documentName}</span>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDownloadDocument(doc.documentUrl)}
                                    className="shrink-0 ml-2"
                                  >
                                    View
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Tablet View (768px - 1023px) */}
                <div className="hidden md:block lg:hidden p-5 space-y-4">
                  {/* Lecture Header */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Badge variant="outline" className="shrink-0">
                          {index + 1}
                        </Badge>
                        <h4 className="font-semibold text-base truncate">{lecture.title}</h4>
                      </div>
                      <Badge variant={lecture.isActive ? "default" : "secondary"} className="shrink-0">
                        {lecture.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3">{lecture.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(lecture.createdAt), 'MMM dd, yyyy')}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {lecture.videoUrl && (
                        <Button
                          onClick={() => handleJoinLecture(lecture.videoUrl!, lecture.title)}
                          disabled={!lecture.isActive}
                          className="flex-1"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Watch Lecture
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        onClick={() => toggleLectureExpansion(lecture.id)}
                        className="flex-1"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-2" />
                            View Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-2" />
                            View More
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Content on Tablet */}
                  {isExpanded && (
                    <>
                      {/* YouTube Embed */}
                      {youtubeId && (
                        <>
                          <Separator />
                          <div className="space-y-3">
                            <h5 className="font-medium flex items-center gap-2">
                              <Play className="h-4 w-4" />
                              Lecture Video
                            </h5>
                            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                              <iframe
                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                                src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                                title={lecture.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {/* Documents */}
                      {lecture.attachments && lecture.attachments.length > 0 && (
                        <>
                          <Separator />
                          <div className="space-y-3">
                            <h5 className="font-medium flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Documents ({lecture.attachments.length})
                            </h5>
                            <div className="grid grid-cols-1 gap-2">
                              {lecture.attachments.map((doc, docIndex) => (
                                <div
                                  key={docIndex}
                                  className="flex items-center justify-between p-3 border rounded bg-muted/50"
                                >
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <FileText className="h-4 w-4 shrink-0" />
                                    <span className="text-sm truncate block">{doc.documentName}</span>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDownloadDocument(doc.documentUrl)}
                                    className="shrink-0 ml-3"
                                  >
                                    <Download className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>

                {/* Desktop View (>= 1024px) */}
                <div className="hidden lg:block p-4 space-y-4">
                  {/* Lecture Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {index + 1}
                        </Badge>
                        <h4 className="font-semibold">{lecture.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{lecture.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(lecture.createdAt), 'MMM dd, yyyy')}
                        </div>
                        <Badge variant={lecture.isActive ? "default" : "secondary"}>
                          {lecture.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    {lecture.videoUrl && (
                      <Button
                        onClick={() => handleJoinLecture(lecture.videoUrl!, lecture.title)}
                        disabled={!lecture.isActive}
                        className="shrink-0 ml-4"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Watch Lecture
                      </Button>
                    )}
                  </div>

                  {/* YouTube Embed */}
                  {youtubeId && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <h5 className="font-medium flex items-center gap-2">
                          <Play className="h-4 w-4" />
                          Lecture Video
                        </h5>
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                          <iframe
                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                            src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                            title={lecture.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Documents */}
                  {lecture.attachments && lecture.attachments.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <h5 className="font-medium flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Documents ({lecture.attachments.length})
                        </h5>
                        <div className="grid gap-2">
                          {lecture.attachments.map((doc, docIndex) => (
                            <div
                              key={docIndex}
                              className="flex items-center justify-between p-2 border rounded bg-muted/50"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span className="text-sm">{doc.documentName}</span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadDocument(doc.documentUrl)}
                              >
                                View
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <VideoPreviewDialog
        open={videoPreview.open}
        onOpenChange={(open) => setVideoPreview({ ...videoPreview, open })}
        url={videoPreview.url}
        title={videoPreview.title}
      />
    </div>
  );
};

export default FreeLectures;