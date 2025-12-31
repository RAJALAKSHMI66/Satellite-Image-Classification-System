# Fixing "Classification Error - Failed to Send Request to Edge Function"

This guide will help you troubleshoot and fix the edge function error in the satellite classification system.

## Error Analysis

The error "failed to send a request to edge function" typically occurs when:

1. **Supabase environment variables are missing or incorrect**
2. **Edge function is not deployed properly**
3. **LOVABLE_API_KEY secret is not configured**
4. **CORS headers are not properly set**
5. **Network/connectivity issues**
6. **Edge function has runtime errors**

---

## Quick Fix (5 minutes)

### Step 1: Verify Supabase Connection

Check if your `.env` file has the correct Supabase credentials:

```bash
# In sky-classifier/.env
VITE_SUPABASE_URL=https://whgkjiirhycnxsyyumdc.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PROJECT_ID=whgkjiirhycnxsyyumdc
```

### Step 2: Install Supabase CLI

```bash
npm install -g supabase
```

### Step 3: Authenticate with Supabase

```bash
supabase login
# This will open a browser window to authenticate
```

### Step 4: Deploy the Edge Function

```bash
cd sky-classifier
supabase functions deploy classify-image --project-id whgkjiirhycnxsyyumdc
```

### Step 5: Set Required Secrets

```bash
# Set the LOVABLE_API_KEY secret
supabase secrets set LOVABLE_API_KEY="your_lovable_api_key" --project-id whgkjiirhycnxsyyumdc
```

If you don't have a LOVABLE_API_KEY, get one from: https://lovable.dev

---

## Detailed Troubleshooting

### Issue 1: "Invalid or missing Supabase credentials"

**Solution:**

```bash
# Verify your Supabase client is initialized correctly
# In sky-classifier/src/integrations/supabase/client.ts

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase environment variables');
  console.log('VITE_SUPABASE_URL:', SUPABASE_URL);
  console.log('VITE_SUPABASE_KEY exists:', !!SUPABASE_KEY);
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
```

### Issue 2: "Edge function not found (404 error)"

**Solution:**

The function needs to be deployed to Supabase:

```bash
# Navigate to sky-classifier directory
cd sky-classifier

# Deploy the function
supabase functions deploy classify-image --project-id whgkjiirhycnxsyyumdc

# Verify deployment
supabase functions list --project-id whgkjiirhycnxsyyumdc
```

You should see output like:

```
classify-image  https://whgkjiirhycnxsyyumdc.supabase.co/functions/v1/classify-image
```

### Issue 3: "LOVABLE_API_KEY not configured (402 error)"

**Solution:**

Set the API key as a Supabase secret:

```bash
# Get your LOVABLE_API_KEY from https://lovable.dev/settings
supabase secrets set LOVABLE_API_KEY="pk_test_xxx_yyy_zzz" --project-id whgkjiirhycnxsyyumdc

# Verify it's set
supabase secrets list --project-id whgkjiirhycnxsyyumdc
```

### Issue 4: "CORS error (Origin is not allowed)"

**Solution:**

The edge function already has CORS headers configured. If you still get CORS errors:

1. **Check browser console for exact error**
2. **Verify the request headers in Network tab**
3. **Make sure the function returns proper CORS headers**

Updated function with better CORS:

```typescript
// sky-classifier/supabase/functions/classify-image/index.ts

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Handle preflight
if (req.method === "OPTIONS") {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}
```

### Issue 5: "Network timeout (edge function takes too long)"

**Solution:**

The request might be timing out. Try:

```bash
# Increase the request timeout in your frontend
// sky-classifier/src/pages/Dashboard.tsx

const { data, error } = await supabase.functions.invoke('classify-image', {
  body: { imageBase64: image },
  timeout: 120 * 1000, // 2 minutes timeout
});
```

### Issue 6: "Response is undefined or empty"

**Solution:**

The function might be erroring silently. Add better error handling:

```typescript
// sky-classifier/src/pages/Dashboard.tsx

const handleClassification = async (image: string) => {
  try {
    console.log("Starting classification...");

    const { data, error } = await supabase.functions.invoke("classify-image", {
      body: { imageBase64: image },
    });

    console.log("Response:", { data, error });

    if (error) {
      console.error("Supabase error:", error);
      toast({
        title: "Error",
        description: `Supabase error: ${error.message}`,
        variant: "destructive",
      });
      return;
    }

    if (!data) {
      console.error("No data returned from function");
      toast({
        title: "Error",
        description: "No response from classification function",
        variant: "destructive",
      });
      return;
    }

    if (data.error) {
      console.error("Function returned error:", data.error);
      toast({
        title: "Classification Error",
        description: data.error,
        variant: "destructive",
      });
      return;
    }

    // Process successful response
    console.log("Classification successful:", data.classification);
  } catch (err) {
    console.error("Unexpected error:", err);
    toast({
      title: "Error",
      description: "Unexpected error during classification",
      variant: "destructive",
    });
  }
};
```

---

## Alternative Solution: Use Flask Backend Instead

If Supabase edge functions are problematic, you can use your Flask backend:

```typescript
// sky-classifier/src/pages/Dashboard.tsx

const handleClassification = async (image: string) => {
  try {
    setIsProcessing(true);

    // Use Flask backend instead of Supabase edge function
    const response = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageBase64: image,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Process response
    const predictionArray = [
      data.confidence_scores.forest,
      data.confidence_scores.urban,
      data.confidence_scores.water,
      data.confidence_scores.agricultural,
      data.confidence_scores.desert,
    ];

    setPrediction(predictionArray);
    setIsClassified(true);
  } catch (err) {
    console.error("Classification error:", err);
    toast({
      title: "Error",
      description: "Failed to classify image",
      variant: "destructive",
    });
  } finally {
    setIsProcessing(false);
  }
};
```

---

## Testing the Edge Function

### Local Testing with curl

```bash
# Get your Supabase URL and key
PROJECT_ID="whgkjiirhycnxsyyumdc"
SUPABASE_URL="https://${PROJECT_ID}.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Test with a simple request
curl -X POST "${SUPABASE_URL}/functions/v1/classify-image" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"imageBase64":"test"}'
```

### Testing in Browser Console

```javascript
// In browser console (F12)
const supabase = window.supabase; // If globally available

supabase.functions
  .invoke("classify-image", {
    body: { imageBase64: "test" },
  })
  .then((result) => {
    console.log("Result:", result);
  })
  .catch((err) => {
    console.error("Error:", err);
  });
```

---

## Checklist for Deployment

- [ ] Supabase CLI installed (`npm install -g supabase`)
- [ ] Logged in to Supabase (`supabase login`)
- [ ] `.env` file has correct VITE*SUPABASE*\* variables
- [ ] Edge function deployed (`supabase functions deploy`)
- [ ] LOVABLE_API_KEY set in secrets (`supabase secrets set`)
- [ ] Function returns proper CORS headers
- [ ] Frontend correctly handles responses
- [ ] Backend API is running (if using Flask alternative)

---

## Common Error Messages and Fixes

| Error                                | Cause                                        | Fix                                            |
| ------------------------------------ | -------------------------------------------- | ---------------------------------------------- |
| `functions.invoke is not a function` | Old Supabase version                         | Update: `npm update @supabase/supabase-js`     |
| `404 Not Found`                      | Function not deployed                        | Run `supabase functions deploy`                |
| `401 Unauthorized`                   | Invalid credentials                          | Check `.env` file, redeploy with correct key   |
| `402 Payment Required`               | LOVABLE_API_KEY missing or credits exhausted | Set API key and ensure credits                 |
| `429 Too Many Requests`              | Rate limited                                 | Wait and retry, or upgrade plan                |
| `500 Internal Server Error`          | Function error                               | Check function logs: `supabase functions logs` |
| `CORS error`                         | Origin not allowed                           | Already configured, check CORS headers         |

---

## Monitoring and Debugging

### View Function Logs

```bash
# Real-time logs
supabase functions logs classify-image --project-id whgkjiirhycnxsyyumdc

# From the Dashboard
# Go to Supabase Console > Edge Functions > classify-image > Logs
```

### Enable Debug Mode

```typescript
// sky-classifier/src/pages/Dashboard.tsx

// Add verbose logging
const handleClassification = async (image: string) => {
  console.log("=== Starting Classification ===");
  console.time("Classification");

  try {
    const { data, error } = await supabase.functions.invoke("classify-image", {
      body: { imageBase64: image },
    });

    console.log("Raw Response:", {
      data,
      error,
      timestamp: new Date().toISOString(),
    });
    console.timeEnd("Classification");

    // ... rest of code
  } catch (err) {
    console.error("Error Details:", {
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
    });
  }
};
```

---

## Still Having Issues?

1. **Check Supabase Status**: https://status.supabase.com
2. **Review Function Code**: `sky-classifier/supabase/functions/classify-image/index.ts`
3. **Check Console Errors**: Open browser DevTools (F12) and look for errors in Console tab
4. **Review Network Requests**: Check Network tab to see the actual request/response
5. **Check Supabase Logs**: `supabase functions logs classify-image`

---

**Need more help?**

- Supabase Docs: https://supabase.com/docs
- Edge Functions: https://supabase.com/docs/guides/functions
- Troubleshooting: https://supabase.com/docs/guides/functions/troubleshooting
