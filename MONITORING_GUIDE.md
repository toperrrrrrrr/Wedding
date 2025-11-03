# 🖥️ **Website Monitoring Guide**

## **How to Monitor Your Wedding Website**

Your website now has comprehensive monitoring tools built-in. Here's how to use them:

---

## **🎯 Quick Start**

1. **Open your website:** `http://localhost:8000`
2. **Open Browser Console:** Press `F12` or right-click → "Inspect" → "Console" tab
3. **Watch the live logs** as you navigate the site

---

## **📊 What You'll See in Console**

### **1. Component Health Reports** (Now Optimized!)
```
[10:45:23] ℹ️ Maps: HEALTHY
[10:45:23] ℹ️ Gallery: PRESENT
[10:45:23] ℹ️ Video: PRESENT
[10:45:23] ℹ️ Rsvp: LOADED
[10:45:23] ℹ️ Navigation: HEALTHY
[10:45:23] ℹ️ Slideshow: HEALTHY
```

*Only shows when status changes or errors occur*

### **2. Detailed Component Status**
- 🗺️ **Maps**: Shows if Google Maps loaded, elements found, API key status
- 🖼️ **Gallery**: Checks for image gallery sections and links
- 🎥 **Video**: Verifies video player elements and types
- 📝 **RSVP**: Confirms Google Forms integration
- 🧭 **Navigation**: Validates menu and links
- 🎠 **Slideshow**: Checks hero image slideshow

---

## **🔧 Debug Tools Available**

### **Visual Debug Panel**
- **Shortcut:** Press `Ctrl + Shift + D` to toggle a floating debug panel
- Shows real-time status of all major components
- Click "Close" to hide it

### **Manual Health Checks**
In browser console, type:
```javascript
websiteMonitor.runHealthChecks()
```
This runs a complete health check and prints detailed status.

### **Component-Specific Checks**
```javascript
websiteMonitor.checkMaps()      // Check Google Maps status
websiteMonitor.checkGallery()   // Check image gallery
websiteMonitor.checkVideo()     // Check video player
websiteMonitor.checkRSVP()      // Check RSVP form
```

---

## **🎨 Color-Coded Status Indicators**

- ✅ **Green/Healthy**: Component working perfectly
- ⏳ **Yellow/Loading**: Component initializing
- ❌ **Red/Error**: Component has issues
- ❓ **Gray/Unknown**: Status not yet determined

---

## **⚡ Console Optimizations Made**

### **Reduced Noise:**
- ❌ **Before**: Video validation checks every 2 seconds
- ✅ **After**: Only logs on actual status changes

- ❌ **Before**: Intersection observer spam (100+ logs)
- ✅ **After**: Silent operation with change-only reporting

- ❌ **Before**: Volume changes logged every second
- ✅ **After**: Silent volume adjustments

- ❌ **Before**: Full health reports every 30 seconds
- ✅ **After**: Only when status changes (60s intervals)

### **Smart Error Handling:**
- 🚨 **First 3 errors**: Full details logged
- ⚠️ **After 3 errors**: Warning about multiple issues
- 🔇 **Beyond that**: Suppressed to prevent spam

### **Performance Improvements:**
- **60s intervals** instead of 30s for periodic checks
- **Change detection** prevents redundant logging
- **Log levels** for different verbosity needs

---

## **🔍 Troubleshooting Steps**

### **If Maps Aren't Working:**
1. Check console for: `Google Maps initialized successfully`
2. Look for: `Maps are now visible on the page!`
3. Verify: `venueMapsInit` function exists

### **If Gallery Isn't Loading:**
1. Check for: `Gallery: PRESENT` in health report
2. Look for image loading errors in console
3. Verify image paths in `assets/images/gallery/`

### **If Video Has Issues:**
1. Check for: `Video: PRESENT` status
2. Look for iframe vs video element conflicts
3. Verify Vimeo embed URL is correct

---

## **📈 Real-Time Monitoring**

- **Automatic Checks:** Every 30 seconds
- **Error Detection:** All JavaScript errors logged
- **Performance Tracking:** Component load times monitored

---

## **🆘 Getting Help**

If you see issues, share these details:
1. **Console errors** (red text in console)
2. **Health report status** (from `websiteMonitor.runHealthChecks()`)
3. **What you're seeing on the page** vs. what you expect

---

## **🚀 Advanced Debugging**

### **Console Commands:**
```javascript
// Get detailed component info
console.log(websiteMonitor.components)

// Check specific element
document.getElementById('ceremony-map')

// Test directions function
getDirections('Test Address')

// Check API key
console.log(window.googleMapsApiKey)
```

### **Network Tab:**
- Check if Google Maps API loads (maps.googleapis.com)
- Verify image loading (assets/images/)
- Monitor Google Forms iframe loading

---

**🎉 Your website is now fully instrumented for debugging!**

*Last updated: November 3, 2025*
