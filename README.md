# Noriel & Gloria Wedding Website 💒

A beautiful, responsive wedding website for Noriel and Gloria's special day on December 27, 2025. This elegant site features a modern design with smooth animations, interactive elements, and all the essential information guests need.

## ✨ Features

- **Hero Section** - Stunning image slideshow with wedding details
- **Live Countdown** - Real-time countdown to the wedding day
- **Love Story** - Interactive timeline of the couple's journey
- **Wedding Details** - Ceremony and reception information
- **Venue Maps** - Interactive maps with directions (Google Maps integration)
- **RSVP System** - Google Forms integration for guest responses
- **FAQ Section** - Accordion-style frequently asked questions
- **Mobile Responsive** - Optimized for all devices
- **Smooth Animations** - Beautiful transitions and hover effects

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd wedding-website
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - No build process required - it's a static website!

### Required Setup

#### Google Maps API (for venue directions)
1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the following APIs:
   - Maps JavaScript API
   - Places API
3. Replace `YOUR_GOOGLE_MAPS_API_KEY` in `index.html` (line 18) with your API key

#### Google Forms RSVP (optional)
- The site uses Google Forms for RSVP functionality
- Current form ID: `1FAIpQLSd3trdiSfsl96HroxLKIuuG7pvwy9QT48buRymdlanLjFg2qQ`
- To use your own form, update the iframe src in `index.html` (line 607)

## 📁 Project Structure

```
wedding-website/
├── index.html                 # Main wedding website
├── image-showcase.html        # Additional image showcase page
├── assets/                    # Images and icons
│   ├── icons/                # SVG icons (burger, close, text, etc.)
│   └── images/               # Wedding photos and graphics
│       ├── engagement/       # Engagement photos
│       └── gallery/          # Photo gallery (to be added)
├── css/                      # Stylesheets
│   ├── styles.css           # Main styles
│   └── additional-styles.css # Additional styling
├── js/                       # JavaScript files
│   ├── script.js            # Main functionality
│   ├── countdown.js         # Wedding countdown timer
│   ├── hero-slideshow.js   # Image slideshow
│   ├── maps.js             # Google Maps integration
│   ├── rsvp-form.js        # RSVP form handling
│   └── video-player.js     # Video section controls
├── top 5/                    # Featured wedding photos (hero slideshow)
└── README.md                # This file
```

## 🎨 Design Features

### Color Palette
- **Primary:** `#d4a574` (Warm gold)
- **Secondary:** `#f8f5f1` (Soft cream)
- **Accent:** `#8b7355` (Earthy brown)
- **Typography:** Playfair Display (headings) + Inter (body text)

### Responsive Design
- **Mobile-first approach**
- **Breakpoints:** 768px (tablet), 1024px (desktop)
- **Touch-friendly interactions**
- **Optimized for all screen sizes**

## 🔧 Customization

### Wedding Details
Update the following in `index.html`:
- **Names:** Lines 65 & 67 (Noriel & Gloria)
- **Wedding Date:** Line 77 (December 27, 2025)
- **Location:** Line 81 (San Pablo City, Laguna)
- **Venue Details:** Lines 212-224 (Ceremony & Reception info)

### Photos
- **Hero Slideshow:** Replace images in `top 5/` directory
- **Engagement Photos:** Add to `assets/images/engagement/`
- **Gallery:** Add photo gallery section (structure exists)

### Content Sections
- **Love Story:** Update timeline in lines 177-198
- **Schedule:** Modify wedding day timeline in lines 243-272
- **FAQ:** Customize questions and answers in lines 464-562

## 🌐 Deployment Options

### Free Hosting (Recommended)
- **Netlify** - Drag & drop deployment, automatic HTTPS
- **Vercel** - Excellent performance, automatic deployments
- **GitHub Pages** - Free hosting directly from GitHub
- **Firebase Hosting** - Google's hosting solution

### Premium Hosting
- **Traditional web hosting** (Hostinger, Bluehost, etc.)
- **AWS S3 + CloudFront** for high traffic
- **Vercel/Netlify Pro** for advanced features

## 📱 Mobile Optimization

- **Touch gestures** for photo gallery
- **Responsive navigation** with mobile menu
- **Optimized images** and lazy loading
- **Mobile-friendly forms** and interactions
- **Performance optimized** for mobile networks

## 🔒 Privacy & Security

- **No personal data collection** without consent
- **Google Forms integration** for RSVP (secure)
- **Optional Google Maps API** for venue directions
- **HTTPS ready** for secure browsing

## 🤝 Contributing

This is a personal wedding website, but suggestions are welcome! Feel free to:
- Report any issues or bugs
- Suggest improvements or new features
- Share ideas for additional content

## 📞 Support

For questions about the wedding or technical issues with the website:
- **Email:** [Your email address]
- **Phone:** [Your phone number]
- **Issues:** Create an issue in this repository

## 🎉 Acknowledgments

- **Photography:** [Photographer name if applicable]
- **Design Inspiration:** Modern wedding website trends
- **Development:** Built with HTML5, CSS3, and vanilla JavaScript
- **Icons:** Material Icons by Google
- **Fonts:** Google Fonts (Playfair Display & Inter)

---

**Built with ❤️ for Noriel & Gloria's Wedding**
*December 27, 2025 - San Pablo City, Laguna*
