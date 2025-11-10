# Wedding Website TODO List & Issues to Fix

## 🔧 **Missing Features (From notes.txt)**

### 3. **Add Invitation PDF Link**
- **Status:** ✅ **COMPLETED**
- **Issue:** Need clickable link to view invitation PDF
- **Current:** Added "View Invitation" button with PDF icon in hero section and navigation
- **Location:** Hero buttons and nav menu
- **Result:** Users can now view and download `Nori & Glo Invitation.pdf`

### 4. **Add Proposal Video**
- **Status:** ⏳ Pending
- **Issue:** Video section exists but may need different video
- **Current:** Vimeo embed with ID `1123191790`
- **Fix Required:** Verify if this is the correct proposal video or update with proper video

### 5. **Implement Photo Gallery**
- **Status:** ⏳ Pending
- **Issue:** Gallery structure exists but images missing
- **Current:** `image-showcase.html` has framework but no working images
- **Fix Required:** Add actual wedding photos or create functional gallery

### 6. **Update Dress Code**
- **Status:** ✅ **COMPLETED - Dedicated Section Created**
- **Issue:** Current dress code was generic "formal attire"
- **Required:** Earth tones color palette specification with DressCode.svg
- **Fix Applied:** Created a dedicated, beautiful Dress Code section with:
  - **DressCode.svg prominently displayed** (custom artwork as centerpiece)
  - New standalone section between Schedule and Venues
  - Specific attire for God Parents (Ninong/Ninang) in styled cards
  - Specific attire for Guests (Gentlemen/Ladies) in styled cards
  - Interactive earth tone color palette (6 colors with hover effects)
  - Navigation link added to main menu
  - Footer links updated
  - Custom CSS file created (`css/dress-code.css`)
  - Fully responsive mobile design
  - Beautiful gradient background and card animations

## ⚠️ **Medium Priority Issues**

### 7. **Google Maps API Key**
- **Status:** ⏳ Pending
- **Issue:** API key placeholder `YOUR_GOOGLE_MAPS_API_KEY` needs real key
- **Impact:** Maps won't work without proper API key
- **Fix Required:** Obtain Google Maps API key and update configuration

### 8. **Video Player JavaScript**
- **Status:** ❓ Needs Review
- **Issue:** `js/video-player.js` exists but may be incomplete
- **Fix Required:** Review and test video player functionality

### 9. **Image Optimization**
- **Status:** ⏳ Pending
- **Issue:** Large images may impact load times
- **Fix Required:** Optimize images for web (compression, sizing)

## 📝 **Content & Documentation**

### 10. **Update README**
- **Status:** ✅ Recently Updated
- **Issue:** Documentation reflects new folder structure
- **Status:** Already completed in reorganization

### 11. **Clean Up notes.txt**
- **Status:** ⏳ Pending
- **Issue:** File contains completed items and duplicates
- **Fix Required:** Remove completed items, organize remaining tasks

## 🎨 **Design & UX Improvements**

### 12. **Mobile Responsiveness**
- **Status:** ❓ Needs Testing
- **Issue:** Ensure all new elements work on mobile
- **Fix Required:** Test and fix mobile layout issues

### 13. **Loading Performance**
- **Status:** ⏳ Pending
- **Issue:** Large images and multiple assets may slow loading
- **Fix Required:** Implement lazy loading and optimize assets

## 🔍 **Testing & Validation**

### 14. **Cross-Browser Testing**
- **Status:** ⏳ Pending
- **Issue:** Ensure compatibility across browsers
- **Fix Required:** Test on Chrome, Firefox, Safari, Edge

### 15. **Link Validation**
- **Status:** ⏳ Pending
- **Issue:** Check all internal/external links work
- **Fix Required:** Validate navigation and external links

## 📊 **Priority Matrix**

**🔴 High Priority (Fix Immediately):**
1. Maps functionality
2. Image gallery images
3. Broken image paths

**🟡 Medium Priority (Fix Soon):**
4. Proposal video verification
5. Dress code update
6. Gallery implementation

**🟢 Low Priority (Nice to Have):**
7. Performance optimization
8. Additional testing
9. Documentation cleanup

---

## 📋 **Next Steps - Priority Order**

### Immediate Fixes Needed:
1. ✅ **Maps display correctly** - Using iframe embeds (working)
2. 🔧 **Clean up maps.js** - Remove unused JavaScript (causing console errors)
3. 🔧 **Fix video-player.js errors** - querySelector errors on line 552
4. 🔧 **Update monitor-website.js** - Maps monitoring looking for wrong elements
5. 🔴 **Fix image gallery** - Missing 100+ images
6. 🟡 **Update dress code** - Add earth tones specification
7. 🟡 **Mobile testing** - Ensure all features work on mobile
8. 🟢 **Performance optimization** - Image compression, lazy loading

### Console Errors to Fix:
1. **video-player.js:552** - `Cannot read properties of null (reading 'querySelector')`
   - Occurs in `updatePlayButton` function
   - Related to video controls that don't exist for iframe
   
2. **maps.js:72** - Map containers not found
   - Looking for `ceremony-map` and `reception-map` divs
   - These don't exist anymore (using iframes now)
   - Solution: Remove or disable maps.js

3. **monitor-website.js** - Maps showing as ERROR
   - Checking for old map div elements
   - Need to update to check for iframe elements instead

**Last Updated:** November 3, 2025
