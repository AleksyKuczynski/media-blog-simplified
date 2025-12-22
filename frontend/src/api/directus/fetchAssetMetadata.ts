// frontend/src/api/directus/fetchAssetMetadata.ts

import { DIRECTUS_URL } from './directusConstants';

export interface Asset {
  id: string;
  filename_disk: string;
  filename_download: string;
  title?: string;
  description?: string;
  tags?: string[];
  type: string;
  filesize: number;
  width: number | null;
  height: number | null;
  uploaded_on: string;
}

export async function fetchAssetMetadata(assetId: string): Promise<Asset | null> {
  try {
    const fields = [
      'id',
      'filename_disk',
      'filename_download',
      'title',           // ADDED for alt text (bilingual)
      'description',     // ADDED for caption (bilingual)
      'tags',            // ADDED for photographer
      'type',
      'filesize',
      'width',
      'height',
      'uploaded_on'
    ].join(',');

    const url = `${DIRECTUS_URL}/files/${assetId}?fields=${fields}`;
    
    const response = await fetch(url, {
      next: {
        revalidate: 86400, // Cache for 24 hours
        tags: ['assets', `asset-${assetId}`]
      }
    });

    if (!response.ok) {
      console.error(`Failed to fetch asset metadata for ${assetId}. Status: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.data as Asset;
  } catch (error) {
    console.error(`Error fetching asset metadata for ${assetId}:`, error);
    return null;
  }
}