# Setup Edge Function - Quick Start Guide

## Prerequisites

Before you begin, make sure you have:

1. **Supabase Account**: Sign up at https://supabase.com
2. **Supabase Project**: Already created with ID `whgkjiirhycnxsyyumdc`
3. **Lovable AI API Key**: Get from https://lovable.dev/settings
4. **Node.js 16+**: For running npm commands
5. **Supabase CLI**: Install with `npm install -g supabase`

---

## Step-by-Step Setup

### Step 1: Verify Supabase Project

```bash
# List your Supabase projects
supabase projects list

# You should see: whgkjiirhycnxsyyumdc
```

### Step 2: Login to Supabase

```bash
supabase login

# This will open a browser window
# Follow the prompts to authenticate
```

### Step 3: Verify Edge Function Exists

Navigate to your project folder and check the edge function:

```bash
cd sky-classifier
ls -la supabase/functions/classify-image/
# You should see: index.ts, deno.json
```

### Step 4: Deploy the Edge Function

```bash
# Navigate to project root
cd sky-classifier

# Deploy the function
supabase functions deploy classify-image --project-id whgkjiirhycnxsyyumdc

# Output should show:
# Function classify-image deployed successfully!
# Endpoint: https://whgkjiirhycnxsyyumdc.supabase.co/functions/v1/classify-image
```

### Step 5: Configure LOVABLE_API_KEY Secret

```bash
# Set the secret (replace with your actual API key)
supabase secrets set LOVABLE_API_KEY="pk_xxx_your_key_here_xxx" --project-id whgkjiirhycnxsyyumdc

# Output: Secret added successfully

# Verify it's set
supabase secrets list --project-id whgkjiirhycnxsyyumdc
# You should see LOVABLE_API_KEY in the list
```

### Step 6: Verify Function Deployment

```bash
# Check logs
supabase functions logs classify-image --project-id whgkjiirhycnxsyyumdc

# Test the function endpoint
curl -X POST "https://whgkjiirhycnxsyyumdc.supabase.co/functions/v1/classify-image" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"imageBase64":"test"}'
```

---

## Troubleshooting

### Problem: "Command not found: supabase"

**Solution**: Install Supabase CLI globally

```bash
npm install -g supabase
# or
npm install --save-dev supabase
npx supabase
```

### Problem: "Authentication failed"

**Solution**: Re-login to Supabase

```bash
supabase logout
supabase login
```

### Problem: "Function not found (404)"

**Solution**: Ensure the function is deployed

```bash
# Check if function exists
supabase functions list --project-id whgkjiirhycnxsyyumdc

# If not listed, deploy it
supabase functions deploy classify-image --project-id whgkjiirhycnxsyyumdc
```

### Problem: "Unauthorized (401)"

**Solution**: Check LOVABLE_API_KEY is set

```bash
# List secrets
supabase secrets list --project-id whgkjiirhycnxsyyumdc

# If LOVABLE_API_KEY is missing, add it
supabase secrets set LOVABLE_API_KEY="your_key_here" --project-id whgkjiirhycnxsyyumdc
```

### Problem: "Rate limit (429)"

**Solution**: Wait a few minutes and try again, or upgrade your Lovable AI plan

---

## Frontend Configuration

Make sure your React app has the correct environment variables:

```bash
# sky-classifier/.env
VITE_SUPABASE_URL=https://whgkjiirhycnxsyyumdc.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PROJECT_ID=whgkjiirhycnxsyyumdc
```

### Restart Frontend Dev Server

```bash
cd sky-classifier
npm run dev

# Should see: Local: http://localhost:5173
```

---

## Test the Integration

### 1. Open Browser Console

Open your app at `http://localhost:5173` and press `F12` to open DevTools

### 2. Go to Console Tab

```javascript
// Test if Supabase is initialized
console.log(window.supabase);

// Should show Supabase client object
```

### 3. Upload an Image

1. Click on the "Upload Image" button
2. Select a satellite image (JPG or PNG)
3. Wait for classification result
4. Check the console for any errors

### 4. Check Network Requests

1. Open **Network** tab in DevTools
2. Upload an image again
3. Look for `classify-image` request
4. Should show `Status: 200 OK`
5. Response should contain JSON with classification scores

---

## Getting Your LOVABLE_API_KEY

1. Go to https://lovable.dev
2. Sign in or create account
3. Go to Settings: https://lovable.dev/settings
4. Find "API Keys" section
5. Copy your API key
6. Use it in the command above

---

## More Information

- **Supabase Docs**: https://supabase.com/docs
- **Edge Functions**: https://supabase.com/docs/guides/functions
- **Troubleshooting**: https://supabase.com/docs/guides/functions/troubleshooting

---

## Support

If you still have issues:

1. Check [EDGE_FUNCTION_FIXES.md](./EDGE_FUNCTION_FIXES.md) for detailed fixes
2. Review the error logs: `supabase functions logs classify-image`
3. Check the browser console (F12)
4. Review Network requests in DevTools
5. Check Supabase project status: https://status.supabase.com
