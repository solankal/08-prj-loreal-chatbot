# L'Oréal Chatbot Branding Guidelines

## Overview
This chatbot has been updated with official L'Oréal brand identity elements based on:
- **Monotype L'Oréal Brand Review** – Typography and design specifications
- **FutureBrand L'Oréal Case Study** – Visual identity and corporate guidelines

---

## Brand Identity Elements Implemented

### 🎨 Color Palette
The design uses L'Oréal's iconic, vibrant brand colors:

| Color | Hex Code | Usage |
|-------|----------|-------|
| **L'Oréal Red** | `#E60012` | Primary accent, buttons, logo, borders, footer links |
| **Black** | `#000000` | Logo text, dark text |
| **White** | `#FFFFFF` | Background, message bubbles |
| **Light Gray** | `#F5F5F5` | Chat window background |
| **Dark Gray** | `#333333` | Body text, secondary elements |

### 📝 Typography

#### Font Stack
- **Primary Sans-Serif**: `Poppins` (400, 600, 700 weights)
  - Used for body text and UI elements
  - Clean, modern, and accessible
  
- **Display Font**: `Playfair Display` (700 weight)
  - Used for the L'Oréal logo and main heading
  - Elegant serif, reflects sophistication
  - Based on L'Oréal's refined visual identity

#### Font Applications
- **L'Oréal Logo**: Playfair Display, 18px, Bold, Red
- **Main Title ("Beauty Assistant")**: Playfair Display, 48px, Bold, Black
- **Tagline**: Poppins, 16px, Regular, Dark Gray (Italic)
- **Body Text**: Poppins, 16px, Regular
- **Interactive Elements**: Poppins, with weight variations

### 🎯 Design Features

#### Header
- **L'Oréal Logo**: Prominently displayed in brand red
- **Tagline**: "Create the beauty that moves the world" – L'Oréal's official corporate purpose (launched 2021)
- **Red Bottom Border**: 3px solid border emphasizing brand identity

#### Chat Interface
- **User Messages**: Red background (`#E60012`), white text – aligns with brand energy
- **AI Messages**: White background with red left border – creates visual hierarchy
- **Send Button**: Red background with hover effect (transitions to dark gray)
- **Input Field**: Subtle gray border with red focus state (including shadow effect)
- **Rounded Corners**: 4px border-radius for modern, polished look

#### Footer
- **Footer Links**: Red color with hover transitions
- **Company Attribution**: Updated to "L'Oréal" for brand consistency

---

## Design Philosophy

### L'Oréal's Brand Vision (from FutureBrand)
> *"Create the beauty that moves the world"*

The updated design reflects L'Oréal's brand values:
- ✨ **Bold & Sophisticated**: Vibrant red paired with elegant serif typography
- 💎 **Elegant but Energetic**: Refined design with passionate color choices
- 🌍 **Unified & Professional**: Consistent visual language across all elements
- ♿ **Accessible & Modern**: Clean typography and high contrast for readability

---

## CSS Variables (for easy customization)

The design uses CSS custom properties for maintainability:

```css
:root {
  --loreal-red: #E60012;
  --loreal-black: #000000;
  --loreal-white: #FFFFFF;
  --loreal-gray: #F5F5F5;
  --loreal-dark-gray: #333333;
}
```

To adjust any color, simply update these values.

---

## Files Updated
- **index.html**: Added L'Oréal logo, updated title, added tagline
- **style.css**: Implemented full L'Oréal color palette, typography hierarchy, and design refinements

---

## Resources Referenced
- [Monotype L'Oréal Brand Review](https://hello.monotype.com/rs/800-DWE-978/images/BrandReview_LOREAL.pdf)
- [FutureBrand L'Oréal Case Study](https://www.futurebrand.com/our-work/loreal)
