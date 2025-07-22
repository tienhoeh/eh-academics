# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static HTML website for eh-academics, a Singapore-based school placement consultancy service. The site is a single-page application with a contact form that helps families find appropriate international schools in Singapore.

## Project Structure

- `index.html` - Main landing page with hero section, pain points, process steps, testimonials, and consultation form
- `thank-you.html` - Form submission confirmation page
- `style.css` - Complete stylesheet with CSS custom properties, responsive design, and component styles
- `script.js` - JavaScript for mobile navigation toggle functionality
- `images/` - Static assets including logos, student photos, and background images

## Key Architecture

### Form Handling
The consultation form uses Netlify Forms for processing:
- Form has `data-netlify="true"` and `netlify-honeypot="bot-field"` attributes
- Action redirects to `/thank-you.html`
- Hidden form-name field for Netlify processing
- Honeypot field for spam protection

### CSS Architecture
- CSS custom properties (CSS variables) defined in `:root` for consistent theming
- Mobile-first responsive design with breakpoints at 768px and 992px
- Component-based styling with clear section organization
- Flexbox and CSS Grid for layouts

### Analytics Integration
- Google Tag Manager (GTM-T33335GR)
- Google Analytics (AW-17044395241) - configured twice (appears to be duplicate)
- WhatsApp floating contact button

## Development Notes

### No Build Process
This is a static site with no build tools, package managers, or dependencies beyond:
- External CDNs: Font Awesome 6.4.0, Google Fonts (Poppins)
- All code is vanilla HTML, CSS, and JavaScript

### Styling Conventions
- CSS custom properties for consistent theming (colors, fonts, spacing)
- BEM-like naming conventions for components
- Extensive use of Flexbox and Grid for responsive layouts
- Mobile navigation uses JavaScript toggle functionality

### Content Structure
- Single-page layout with distinct sections: hero, pain points, process, testimonials, CTA
- Bilingual testimonials (English and Chinese)
- Contact form with validation and accessibility features

## Common Tasks

Since this is a static site, common development tasks include:

### Testing Changes
- Open `index.html` directly in browser
- Test responsive breakpoints at 768px and 992px
- Verify form submission redirects to thank-you page
- Test mobile navigation functionality

### Deployment
- Site appears configured for Netlify hosting
- Static files can be served from any web server
- No build or compilation step required

### Content Updates
- Text content is directly in HTML files
- Images stored in `images/` directory
- CSS variables in `:root` for theme modifications
- Form fields and validation in HTML attributes