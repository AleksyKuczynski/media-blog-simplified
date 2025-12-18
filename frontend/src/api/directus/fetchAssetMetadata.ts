// src/api/directus/fetchAssetMetadata.ts
import { DIRECTUS_URL } from "./directusConstants";
import { Asset } from "./directusInterfaces";

export async function fetchAssetMetadata(assetId: string): Promise<Asset | null> {
  try {
    const url = `${DIRECTUS_URL}/files/${assetId}`;
    const response = await fetch(url);
    
    if (!response.ok) return null;
    
    const { data } = await response.json();
    
    return {
      id: data.id,
      width: data.width || 1200,
      height: data.height || 800,
      type: data.type || 'image/jpeg',
      filename: data.filename_download,
      title: data.title || data.filename_download
    };
  } catch (error) {
    return null;
  }
}