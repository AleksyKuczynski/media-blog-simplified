// frontend/src/app/[lang]/[rubric]/[slug]/_components/engagement/api/triggerEngagementFlow.ts
/**
 * Directus Flow Trigger
 * 
 * Triggers Directus flows for engagement actions (view, like, unlike, share)
 * Fire-and-forget pattern - doesn't wait for completion
 */

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN;
const DIRECTUS_FLOW_VIEWS = process.env.DIRECTUS_FLOW_INCREMENT_VIEWS;
const DIRECTUS_FLOW_INCREMENT_LIKES = process.env.DIRECTUS_FLOW_INCREMENT_LIKES;
const DIRECTUS_FLOW_DECREMENT_LIKES = process.env.DIRECTUS_FLOW_DECREMENT_LIKES;
const DIRECTUS_FLOW_SHARES = process.env.DIRECTUS_FLOW_INCREMENT_SHARES;

/**
 * Trigger Directus Flow for engagement action
 * Fire-and-forget - doesn't wait for completion
 */
export async function triggerEngagementFlow(
  slug: string,
  action: 'view' | 'like' | 'unlike' | 'share'
): Promise<boolean> {
  try {
    let flowId: string | undefined;
    
    switch (action) {
      case 'view':
        flowId = DIRECTUS_FLOW_VIEWS;
        break;
      case 'like':
        flowId = DIRECTUS_FLOW_INCREMENT_LIKES;
        break;
      case 'unlike':
        flowId = DIRECTUS_FLOW_DECREMENT_LIKES;
        break;
      case 'share':
        flowId = DIRECTUS_FLOW_SHARES;
        break;
    }

    if (!flowId) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`Flow ID not configured for action: ${action}`);
      }
      return false;
    }

    const flowUrl = `${DIRECTUS_URL}/flows/trigger/${flowId}`;
    const payload = { slug };

    // Fire-and-forget: Don't await the response
    fetch(flowUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DIRECTUS_API_TOKEN}`,
      },
      body: JSON.stringify(payload),
    }).catch(() => {
      // Silent failure - logged server-side if needed
    });

    return true;
    
  } catch (error) {
    return false;
  }
}