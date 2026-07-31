---
name: Nexa Modern Retail
colors:
  surface: '#faf8ff'
  surface-dim: '#d9d9e4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3fe'
  surface-container: '#ededf8'
  surface-container-high: '#e7e7f2'
  surface-container-highest: '#e2e2ec'
  on-surface: '#191b23'
  on-surface-variant: '#434654'
  inverse-surface: '#2e3038'
  inverse-on-surface: '#f0f0fb'
  outline: '#737685'
  outline-variant: '#c3c6d7'
  surface-tint: '#1b55d0'
  primary: '#003594'
  on-primary: '#ffffff'
  primary-container: '#004ac6'
  on-primary-container: '#b8c8ff'
  inverse-primary: '#b4c5ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#d7dff9'
  on-secondary-container: '#5a6278'
  tertiary: '#6e2700'
  on-tertiary: '#ffffff'
  tertiary-container: '#943700'
  on-tertiary-container: '#ffba9d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dae2fc'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3e465b'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#faf8ff'
  on-background: '#191b23'
  surface-variant: '#e2e2ec'
  success: '#004ac6'
typography:
  h1-desktop:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h1-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  h2:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  h4:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.02em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  2xl: 80px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  max-width: 1280px
---

## Brand & Style
The Nexa Store design system embodies a **Modern Corporate** aesthetic that balances premium retail cues with functional utility. It is designed for high-end consumers who value security, clarity, and a seamless digital experience.

The brand personality is professional yet approachable, characterized by a structured layout, generous whitespace, and a high-fidelity color palette. The visual style leans into a clean, systematic approach where hierarchy is established through precise typography and subtle tonal changes rather than aggressive decorative elements. The goal is to evoke a sense of reliability and modern sophistication.

## Colors
The palette is built on a foundation of "Fidelity" blues and cool neutrals. 

- **Primary**: A deep, authoritative blue (#004ac6) used for key actions and branding.
- **Surface Tones**: A sophisticated range of off-whites and cool greys (#faf8ff to #ededf9) creates a layered environment without the harshness of pure white.
- **Functional Colors**: Tertiary oranges are utilized for cautionary states (like moderate password strength), while standard error reds handle validation failures.
- **Contrast**: Text primarily utilizes a dark navy-black (#191b23) for maximum legibility, with a secondary variant (#434655) for supporting information.

## Typography
The system relies exclusively on **Inter**, a versatile neo-grotesque typeface that excels in UI clarity. 

Typography is used to create a clear information scent:
- **Headlines**: Bold weights (700) and tight letter-spacing for large display text; semi-bold (600) for section titles.
- **Body**: Generous line heights (1.6) are applied to `body-md` and `body-lg` to ensure long-form text is easy to scan.
- **Labels & Buttons**: `body-sm` and `caption` sizes are used for metadata and form labels, often utilizing semi-bold weights to maintain hierarchy at smaller scales.

## Layout & Spacing
The system uses a **Fixed Grid** philosophy for desktop and a **Fluid** model for mobile.

- **Desktop**: Content is centered within a 1280px container with 40px outer margins. The sidebar is fixed at 256px (w-64), while the main content area occupies the remaining space with a maximum width of 2xl (approx 672px) for form readability.
- **Mobile**: Margins compress to 16px. A sticky bottom navigation bar replaces the sidebar for primary app-wide actions.
- **Spacing Scale**: A 4px base unit (unit) is used. Vertical rhythm is maintained using `xl` (48px) for section gaps and `lg` (24px) for internal container padding.

## Elevation & Depth
Depth is expressed through **Tonal Layering** and **Low-Contrast Outlines** rather than heavy shadows.

- **Background**: The base level is `surface` (#faf8ff).
- **Cards/Containers**: Elements sitting "on" the surface use `surface-container-lowest` (pure white) with a very subtle `shadow-sm` and a fine 1px border (#c3c6d7/30).
- **Navigation/Sidebars**: These use `surface-container-low` to provide a subtle visual anchor to the screen edges.
- **Interaction**: Subtle scale transforms (active:scale-95) and transitions provide tactile feedback without breaking the flat aesthetic.

## Shapes
The shape language is **Rounded**, communicating a modern and friendly approachable feel.

- **Base Radius**: 0.5rem (8px) is the standard for buttons, input fields, and small cards.
- **Large Radius**: 0.75rem (12px) to 1rem (16px) is used for primary content sections and large containers.
- **Full Radius**: Reserved for avatars, tags, and status indicator bars.
- **Borders**: Inputs and structural dividers use a 1.5px or 1px stroke weight to maintain a crisp, high-end feel.

## Components
- **Buttons**:
    - *Primary*: Solid #004ac6 background with white text, 8px radius, and semi-bold typography.
    - *Secondary/Ghost*: Text-only with #434655 color, moving to primary color on hover.
- **Input Fields**:
    - Use `surface-bright` backgrounds with a 1.5px `outline-variant` border. On focus, they transition to a 2px primary border with a subtle ring.
    - Password fields include right-aligned icon toggles for visibility.
- **Strength Indicators**: Horizontal bars using a three-tier color logic: Error (Red), Tertiary (Orange), and Primary (Blue).
- **Navigation**:
    - *Sidebar*: Uses vertical list items with 16px padding and `secondary-container` for the active state.
    - *Breadcrumbs*: Small `caption` text with chevron icons to show hierarchy.
- **Cards**: Pure white background, 12px radius, light border, and 48px internal padding for a "spacious" feel.