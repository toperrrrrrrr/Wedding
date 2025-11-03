# Wedding Website TODO List & Issues to Fix

## 🚨 **Critical Issues (Must Fix)**

### 1. **Google Maps Functionality**
- **Status:** ✅ **COMPLETED** - Interactive maps fully implemented
- **Issue:** Maps needed to be interactive and displayed within venue cards
- **Impact:** Venue maps now show interactive Google Maps
- **Fix Applied:** 
  - Removed background images from map containers
  - Implemented interactive Google Maps with custom markers
  - Added "Get Directions" buttons below each map
  - Maps work with placeholder API key (shows watermark but fully functional)
- **Current State:** Interactive maps display in venue cards with working zoom, pan, and directions

### 2. **Image Gallery Missing Images**
- **Status:** ❌ Critical - Gallery broken
- **Issue:** `image-showcase.html` references 100+ images (`P2P0xxxx.jpg`) that don't exist
- **Impact:** Image gallery page completely broken
- **Fix Required:** Update image paths to use actual available images or create placeholder system

### 3. **Broken Image Paths**
- **Status:** ❌ Critical - Venue maps broken
- **Issue:** Venue sections reference `buncayo.jpg` and `coco.jpg` but they're now in `assets/images/couple/`
- **Impact:** Venue map backgrounds not displaying
- **Fix Required:** Update image paths in `index.html` venues section

## 🔧 **Missing Features (From notes.txt)**

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
- **Status:** ⏳ Pending
- **Issue:** Current dress code is generic "formal attire"
- **Required:** Earth tones color palette specification
- **Fix Required:** Update FAQ and details sections with earth tone dress code

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

## 📋 **Next Steps**
1. Fix critical map functionality
2. Resolve image gallery issues
3. Update broken image paths
4. Implement dress code specification
5. Add actual gallery images
6. Test all functionality

**Last Updated:** November 3, 2025
