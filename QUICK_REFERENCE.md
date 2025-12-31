# Quick Reference Card - Satellite Classification System

## 🚀 Fastest Fix (Copy & Paste)

```bash
# 1. Install Supabase CLI
npm install -g supabase

# 2. Login
supabase login

# 3. Navigate to project
cd sky-classifier

# 4. Deploy function
supabase functions deploy classify-image --project-id whgkjiirhycnxsyyumdc

# 5. Set API key (get from https://lovable.dev/settings)
supabase secrets set LOVABLE_API_KEY="pk_xxx_your_key_xxx" --project-id whgkjiirhycnxsyyumdc

# 6. Start frontend
npm run dev

# 7. Verify deployment
supabase functions list --project-id whgkjiirhycnxsyyumdc
```

Done! Open http://localhost:5173 and upload a satellite image.

---

## 🔍 Troubleshooting Quick Lookup

### Error: "Classification error failed to send request"

**Check 1:** Is the function deployed?

```bash
supabase functions list --project-id whgkjiirhycnxsyyumdc
```

Should show `classify-image`. If not, deploy it.

**Check 2:** Is the API key set?

```bash
supabase secrets list --project-id whgkjiirhycnxsyyumdc
```

Should show `LOVABLE_API_KEY`. If not, set it.

**Check 3:** Check browser console (F12)
Look for error messages and timestamps.

**Check 4:** View edge function logs

```bash
supabase functions logs classify-image --project-id whgkjiirhycnxsyyumdc
```

### Error: "404 Not Found"

Edge function not deployed.

```bash
supabase functions deploy classify-image --project-id whgkjiirhycnxsyyumdc
```

### Error: "401 Unauthorized"

API key not configured.

```bash
supabase secrets set LOVABLE_API_KEY="your_key" --project-id whgkjiirhycnxsyyumdc
```

### Error: "429 Too Many Requests"

Rate limited. Wait a few minutes or upgrade API plan at https://lovable.dev

### Error: "Module not found: supabase"

Install packages:

```bash
cd sky-classifier
npm install
```

### No Classification Results

Check:

1. Browser console for errors (F12)
2. Network tab (F12) for classify-image request status
3. Edge function logs
4. .env file has correct SUPABASE\_\* variables

---

## 📋 Verification Checklist

- [ ] Supabase CLI installed: `supabase --version`
- [ ] Supabase logged in: `supabase projects list`
- [ ] Function deployed: `supabase functions list`
- [ ] API key set: `supabase secrets list`
- [ ] .env has SUPABASE variables
- [ ] Frontend starts: `npm run dev` works
- [ ] Can upload image without errors
- [ ] Classification completes in <2 minutes
- [ ] Browser console shows [INFO] logs

---

## 📚 Documentation

| File                                             | Purpose                          |
| ------------------------------------------------ | -------------------------------- |
| [README.md](README.md)                           | Project overview                 |
| [GUIDE.md](GUIDE.md)                             | Detailed setup & usage           |
| [SETUP_EDGE_FUNCTION.md](SETUP_EDGE_FUNCTION.md) | Step-by-step edge function setup |
| [EDGE_FUNCTION_FIXES.md](EDGE_FUNCTION_FIXES.md) | Comprehensive troubleshooting    |
| [FIX_SUMMARY.md](FIX_SUMMARY.md)                 | Complete fix documentation       |

---

## 🔑 Important Credentials

| Item            | Where to Find                   |
| --------------- | ------------------------------- |
| LOVABLE_API_KEY | https://lovable.dev/settings    |
| SUPABASE_URL    | .env file or Supabase dashboard |
| SUPABASE_KEY    | .env file or Supabase dashboard |
| Project ID      | whgkjiirhycnxsyyumdc            |

---

## 🧪 Quick Test

```bash
# 1. Upload an image in the dashboard

# 2. Open browser console (F12)

# 3. You should see logs like:
# [timestamp] INFO: Received classification request
# [timestamp] INFO: Image received, validating API key
# [timestamp] INFO: Calling Lovable AI API
# [timestamp] INFO: Final classification normalized

# 4. Check Network tab for classify-image request - should be Status 200
```

---

## 🆘 Still Stuck?

1. Check [EDGE_FUNCTION_FIXES.md](EDGE_FUNCTION_FIXES.md) for your specific error
2. View edge function logs: `supabase functions logs classify-image`
3. Check browser console (F12) and Network tab
4. Ensure LOVABLE_API_KEY is set and valid
5. Make sure function is deployed
6. Try refreshing browser and retrying

---

## 💡 Tips

- **Faster debugging**: Keep `supabase functions logs` running in a terminal while testing
- **Test data**: Use sample satellite images from the `data/temp/EuroSAT` folder
- **Fallback**: If edge function fails, system uses local pixel-based classification
- **Alternative**: Can use Flask backend instead: `python api/flask_api.py`

---

## 📞 Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Edge Functions**: https://supabase.com/docs/guides/functions
- **Lovable AI**: https://lovable.dev
- **Project Repo**: https://github.com/RAJALAKSHMI66/Satellite-Image-Classification-System

---

**Last Updated**: January 19, 2026
**Status**: ✅ All systems operational with comprehensive error handling
