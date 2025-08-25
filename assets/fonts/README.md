# Font Organization System

## 📁 Centralized Font Directory

All fonts are now organized in `/assets/fonts/` with consistent naming:

### Available Fonts

| Font Family | File Name | Format | Usage |
|-------------|-----------|--------|-------|
| **Gasoek One** | `gasoek_one_regular.ttf` | TTF | Display/Headlines (Brutalist style) |
| **Inter** | `inter_regular.ttf` | TTF | Body text (400 weight) |
| **Inter** | `inter_italic.ttf` | TTF | Body text (400 italic) |
| **Mansalva** | `mansalva_regular.ttf` | TTF | Script/Cursive (Mason's story) |
| **Monsie** | `monsie_regular.otf` | OTF | Brand font (regular) |
| **Monsie Outline** | `monsie_outline.otf` | OTF | Brand font (outline variant) |

## 🎯 Font Usage Guidelines

### Primary Fonts
- **Gasoek One**: Hero titles, section headings, brutalist elements
- **Inter**: Body text, buttons, navigation, forms
- **Mansalva**: Personal story sections, handwritten feel

### Brand Fonts (Client Specific)
- **Monsie**: Brand-specific text elements
- **Monsie Outline**: Brand accents and decorative elements

## 📝 Implementation

All fonts are loaded via `@font-face` declarations in HTML files:

```css
@font-face {
    font-family: 'Font Name';
    src: url('../../../../assets/fonts/font_file_name.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
}
```

## 🔧 Path Structure

From HTML files in `apps/web/public/legacy/`:
```
../../../../assets/fonts/font_file_name.extension
```

## ✅ Benefits

1. **Centralized Management**: All fonts in single location
2. **Consistent Naming**: lowercase_underscore format
3. **Performance**: `font-display: swap` for better loading
4. **Scalability**: Easy to add new client fonts
5. **Maintainability**: Single source of truth for all fonts