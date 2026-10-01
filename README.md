# Clarify UI animations

Stylesheet, script and images for the animated section visuals on clarify.io (Webflow).
Implementation guide: https://clarify-ui-animations-handoff.vercel.app

## Load (once per site)

Head:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Ish-Development/clarify-ui-animations@2/clarify-tabs.min.css">
```

Footer (before `</body>`):

```html
<script src="https://cdn.jsdelivr.net/gh/Ish-Development/clarify-ui-animations@2/clarify-tabs.min.js" defer></script>
```

`@2` follows the latest 2.x release (Lumos naming: cv_*, is-*, data-cv). Pin an exact version (`@2.0.0`) to freeze it. `@1` = old cv-* naming, frozen.

## Images

- `assets/phone-lockscreen@3x.webp` (Built to extend, card 1)
- `assets/chat-avatar@3x.webp` (Built to extend, card 2)

`https://cdn.jsdelivr.net/gh/Ish-Development/clarify-ui-animations@2/assets/<file>`
