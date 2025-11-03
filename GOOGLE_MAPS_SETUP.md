# How to Get Google Maps API Key for Your Wedding Website

## Quick Setup (5-10 minutes)

### Step 1: Go to Google Cloud Console
Visit: https://console.cloud.google.com/google/maps-apis

### Step 2: Create a Project
1. Click "Select a project" at the top
2. Click "NEW PROJECT"
3. Name it: "Wedding Website"
4. Click "CREATE"

### Step 3: Enable Maps JavaScript API
1. In the search bar, type "Maps JavaScript API"
2. Click on "Maps JavaScript API"
3. Click "ENABLE"

### Step 4: Create API Key
1. Go to "Credentials" (left sidebar)
2. Click "+ CREATE CREDENTIALS"
3. Select "API key"
4. Copy your new API key (looks like: `AIzaSyD1234567890abcdefghijklmnop`)

### Step 5: Secure Your API Key (Recommended)
1. Click "RESTRICT KEY" 
2. Under "Application restrictions", select "HTTP referrers (web sites)"
3. Add your website URLs:
   - `http://localhost:8000/*` (for testing)
   - `https://yourdomain.com/*` (your actual website)
4. Under "API restrictions", select "Restrict key"
5. Check only "Maps JavaScript API"
6. Click "SAVE"

### Step 6: Add Key to Your Website
Open `index.html` and replace `YOUR_GOOGLE_MAPS_API_KEY` in TWO places:

**Line 18:**
```javascript
window.googleMapsApiKey = 'YOUR_ACTUAL_API_KEY_HERE';
```

**Line 26:**
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY_HERE&libraries=places&callback=venueMapsInit" async defer></script>
```

### Step 7: Refresh Your Website
Clear your browser cache (Ctrl+Shift+R) and reload the page!

## Pricing
- **FREE**: Up to 28,000 map loads per month
- Your wedding website will use maybe 100-500 loads total
- **You won't be charged** unless you exceed the free tier

## Important Notes
- Keep your API key secure
- Don't commit it to public GitHub repositories
- Add billing restrictions in Google Cloud Console to prevent unexpected charges

## If You Don't Want to Set This Up
The fallback static maps work perfectly fine! They:
- ✅ Show venue names and addresses
- ✅ Have working "Get Directions" buttons
- ✅ Look clean and professional
- ✅ Work on all devices
- ✅ No API key needed

The interactive maps add:
- Zoom and pan controls
- Street view
- Satellite view
- Interactive markers
- But they're **optional** - your site works great without them!

