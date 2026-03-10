import { apiClient } from './client';

// ─── Types ───────────────────────────────────────────────────────

export interface InstituteSettingsResponse {
  id: string;
  name: string;
  shortName?: string;
  code: string;
  email: string;
  phone?: string;
  systemContactEmail?: string;
  systemContactPhoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  district?: string;
  province?: string;
  pinCode?: string;
  type?: string;
  logoUrl?: string | null;
  loadingGifUrl?: string | null;
  primaryColorCode?: string | null;
  secondaryColorCode?: string | null;
  imageUrls?: string[];
  imageUrl?: string | null;
  vision?: string;
  mission?: string;
  websiteUrl?: string;
  facebookPageUrl?: string;
  youtubeChannelUrl?: string;
  isActive: boolean;
  updatedAt: string;
}

export interface InstituteProfileResponse {
  id: string;
  name: string;
  shortName?: string;
  logoUrl?: string | null;
  loadingGifUrl?: string | null;
  primaryColorCode?: string | null;
  secondaryColorCode?: string | null;
  imageUrls?: string[];
  imageUrl?: string | null;
  phone?: string;
  email: string;
  city?: string;
  type?: string;
  websiteUrl?: string;
  facebookPageUrl?: string;
  youtubeChannelUrl?: string;
  vision?: string;
  mission?: string;
}

export interface UpdateInstituteSettingsDto {
  name?: string;
  shortName?: string;
  email?: string;
  phone?: string;
  systemContactEmail?: string;
  systemContactPhoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  district?: string;
  province?: string;
  pinCode?: string;
  type?: string;
  logoUrl?: string | null;
  loadingGifUrl?: string | null;
  primaryColorCode?: string | null;
  secondaryColorCode?: string | null;
  imageUrls?: string[] | null;
  imageUrl?: string | null;
  vision?: string;
  mission?: string;
  websiteUrl?: string;
  facebookPageUrl?: string;
  youtubeChannelUrl?: string;
}

// ─── API ─────────────────────────────────────────────────────────

class InstituteSettingsApi {
  /** Full settings for admin page */
  async getSettings(instituteId: string): Promise<InstituteSettingsResponse> {
    return apiClient.get<InstituteSettingsResponse>(`/institutes/${instituteId}/settings`);
  }

  /** Partial update */
  async updateSettings(instituteId: string, data: UpdateInstituteSettingsDto): Promise<InstituteSettingsResponse> {
    return apiClient.patch<InstituteSettingsResponse>(`/institutes/${instituteId}/settings`, data);
  }

  /** Lightweight profile for all members */
  async getProfile(instituteId: string): Promise<InstituteProfileResponse> {
    return apiClient.get<InstituteProfileResponse>(`/institutes/${instituteId}/profile`);
  }

  // ── Image management ───────────────────────────────────────────

  async deleteLogo(instituteId: string): Promise<InstituteSettingsResponse> {
    return apiClient.delete<InstituteSettingsResponse>(`/institutes/${instituteId}/logo`);
  }

  async deleteLoadingGif(instituteId: string): Promise<InstituteSettingsResponse> {
    return apiClient.delete<InstituteSettingsResponse>(`/institutes/${instituteId}/loading-gif`);
  }

  async deleteCoverImage(instituteId: string): Promise<InstituteSettingsResponse> {
    return apiClient.delete<InstituteSettingsResponse>(`/institutes/${instituteId}/cover-image`);
  }

  async addGalleryImage(instituteId: string, relativePath: string): Promise<InstituteSettingsResponse> {
    return apiClient.post<InstituteSettingsResponse>(`/institutes/${instituteId}/gallery`, { relativePath });
  }

  async removeGalleryImage(instituteId: string, imageIndex: number): Promise<InstituteSettingsResponse> {
    return apiClient.delete<InstituteSettingsResponse>(`/institutes/${instituteId}/gallery/${imageIndex}`);
  }
}

export const instituteSettingsApi = new InstituteSettingsApi();
