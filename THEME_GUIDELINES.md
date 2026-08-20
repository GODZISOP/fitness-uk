# 🎨 World Fitness Zone - Official Design System & Theme Guidelines

> **MANDATORY INSTRUCTION FOR AGENTS & DEVELOPERS:**
> Always read this document before creating, modifying, or styling any component, section, or page in this repository. All designs across the entire website MUST strictly adhere to this theme. Do not invent arbitrary dark themes or mismatched color palettes unless explicitly instructed.

---

## 1. 🎯 Core Color Palette

| Token / Variable | Hex Value | Role & Usage |
| :--- | :--- | :--- |
| `--color-primary` | `#155EEF` | **Electric Royal Blue** — Primary brand color, links, primary badges, accents |
| `--color-deep-navy` | `#071A2B` | **Deep Navy** — Headings, main text emphasis, dark card backgrounds, hero titles |
| `--color-action-yellow` | `#FFC928` | **Action Gold / Yellow** — Primary CTAs, high-visibility buttons, highlight badges |
| `--color-soft-blue` | `#EAF2FF` | **Soft Blue** — Section backgrounds, pill tags, subtle borders, card hover tints |
| `--color-white` | `#FFFFFF` | **Pure White** — Primary page background, card surfaces |
| `--color-off-white` | `#F7F9FC` | **Off-White** — Secondary section backgrounds, subtle alternation |
| `--color-charcoal` | `#172033` | **Charcoal Body** — Default readable body paragraph text |

---

## 2. 🔤 Typography & Font Rules

- **Display & Headings (`h1`, `h2`, `h3`, `h4`, `h5`, `h6`)**:
  - Font: `var(--font-outfit), sans-serif`
  - Font Weight: `800` to `900`
  - Letter Spacing: `-0.02em` to `-0.03em`
  - Signature Headline Pattern:
    - `.title-filled`: `color: var(--color-deep-navy);`
    - `.title-outline`: `color: transparent; -webkit-text-stroke: 2px var(--color-deep-navy);`
- **Body & Subtitles (`p`, `span`, `a`, `li`)**:
  - Font: `var(--font-inter), sans-serif`
  - Font Weight: `400` to `600`
  - Line Height: `1.5` to `1.7`
  - Color: `var(--color-charcoal)` or `#4B5563`

---

## 3. 🔘 Button Styles & Interactive Elements

### 3.1 Primary Action Button (Yellow CTA)
```css
.btn-primary, .nav-cta {
  background-color: var(--color-action-yellow); /* #FFC928 */
  color: var(--color-deep-navy); /* #071A2B */
  font-weight: 700;
  font-size: 0.95rem;
  padding: 0.85rem 1.8rem;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}
.btn-primary:hover, .nav-cta:hover {
  background-color: #ffd64f;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 201, 40, 0.35);
}
```

### 3.2 Secondary Button (Soft Blue / Navy)
```css
.btn-secondary {
  background-color: var(--color-soft-blue); /* #EAF2FF */
  color: var(--color-primary); /* #155EEF */
  font-weight: 700;
  font-size: 0.95rem;
  padding: 0.85rem 1.8rem;
  border-radius: 50px;
  border: 1px solid rgba(21, 94, 239, 0.2);
  transition: all 0.2s ease;
}
.btn-secondary:hover {
  background-color: var(--color-primary);
  color: #FFFFFF;
  transform: translateY(-2px);
}
```

### 3.3 Pill Tags & Badges
```css
.pill-badge {
  display: inline-block;
  background-color: var(--color-soft-blue);
  color: var(--color-primary);
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.45rem 1.2rem;
  border-radius: 50px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
```

---

## 4. 🗂️ Card Styles & Containers

- **Light Card**:
  - Background: `#FFFFFF`
  - Border: `1px solid rgba(7, 26, 43, 0.08)`
  - Border Radius: `24px` to `28px`
  - Shadow: `0 10px 30px rgba(7, 26, 43, 0.06)`
- **Blue Card / Accent Card**:
  - Background: `linear-gradient(135deg, #155EEF 0%, #0d47a1 100%)`
  - Text: `#FFFFFF`
  - Border Radius: `24px` to `28px`
- **Yellow Card**:
  - Background: `var(--color-action-yellow)`
  - Text: `var(--color-deep-navy)`
  - Border Radius: `24px` to `28px`

---

## 5. 🏃 Character & Hero Image Guidelines

- Use high-resolution transparent athletic PNGs (e.g. `src/app/image copy 10.png` or `src/app/image.png`).
- Character should feature athletic gym posture with subtle glow (`rgba(21, 94, 239, 0.15)` or `rgba(255, 201, 40, 0.15)`) and realistic contact shadows.
- Avoid placing dark silhouette boxes or mismatched dark backgrounds over light sections.

---

## 6. 🌐 Page & Section Consistency Checklist

- [x] Navbar uses clean transparent/white sticky styling with brand logo.
- [x] Backgrounds use `#FFFFFF`, `#F7F9FC`, or soft blue `#EAF2FF`.
- [x] Headings are rendered in `Outfit` with Deep Navy `#071A2B`.
- [x] Action CTAs use Action Yellow `#FFC928` or Royal Blue `#155EEF`.
- [x] Footer uses the dark navy `#071A2B` apex footer design.
