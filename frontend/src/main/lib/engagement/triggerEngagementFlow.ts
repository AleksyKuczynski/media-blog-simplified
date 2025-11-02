// frontend/src/main/lib/engagement/triggerEngagementFlow.ts

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN;

// Separate flows for each action
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
    let flowName: string;
    
    switch (action) {
      case 'view':
        flowId = DIRECTUS_FLOW_VIEWS;
        flowName = 'Increment Views';
        break;
      case 'like':
        flowId = DIRECTUS_FLOW_INCREMENT_LIKES;
        flowName = 'Increment Likes';
        break;
      case 'unlike':
        flowId = DIRECTUS_FLOW_DECREMENT_LIKES;
        flowName = 'Decrement Likes';
        break;
      case 'share':
        flowId = DIRECTUS_FLOW_SHARES;
        flowName = 'Increment Shares';
        break;
    }

    if (!flowId) {
      console.error(`❌ ${flowName} Flow ID not configured`);
      return false;
    }

    const flowUrl = `${DIRECTUS_URL}/flows/trigger/${flowId}`;
    const payload = { slug };

    console.log(`🚀 Triggering ${flowName} Flow (fire-and-forget)`);

    // Fire-and-forget: Don't await the response
    fetch(flowUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DIRECTUS_API_TOKEN}`,
      },
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (response.ok) {
          console.log(`✅ ${flowName} Flow triggered successfully`);
        } else {
          console.error(`❌ ${flowName} Flow failed: ${response.status}`);
        }
      })
      .catch(error => {
        console.error(`❌ Error triggering ${flowName} Flow:`, error);
      });

    return true;
    
  } catch (error) {
    console.error(`❌ Error triggering ${action} Flow:`, error);
    return false;
  }
}