# Clarify UI animations

Hosted CSS for the animated visuals on clarify.io (Webflow). Three files, one per component.
CSS only: the scripts (tabs, in-view, count-up, hero video sync) live in Webflow. Images and videos live in Webflow
Assets / Vimeo.

| Component | Link tag (Head) |
|---|---|
| Built to extend cards | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Ish-Development/clarify-ui-animations@4/clarify-built-to-extend.min.css">` |
| Tabs (What Clarify does, How it works) | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Ish-Development/clarify-ui-animations@4/clarify-tabs.min.css">` |
| Hero alert cards (4 verticals + Home), since 4.1.0 | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Ish-Development/clarify-ui-animations@4/clarify-hero.min.css">` |
| Big number roll, since 4.4.0 | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Ish-Development/clarify-ui-animations@4/clarify-number.min.css">` + before `</body>`: `<script src="https://cdn.jsdelivr.net/gh/Ish-Development/clarify-ui-animations@4/clarify-number.min.js" defer></script>` |

`@4` follows the latest 4.x release. Pin an exact version (`@4.0.0`) to freeze it. The readable sources sit next to
the minified files (`clarify-built-to-extend.css`, `clarify-tabs.css`, `clarify-hero.css`).

## Rules

- **Naming (Lumos):** Built to extend = `cv_*`, tabs = `tv_*`, hero = `hv_*`. Path-named elements (`cv_msg_avatar`,
  `tv_glass_panel`), `is-*` combo classes for variants and states, `data-cv*` / `data-tv*` hooks.
- **Built to extend:** a parent div owns the size (`.cv_component`, an inline-size container; 1 Figma px =
  `--u` = `100cqw / 451`). Every image is absolutely positioned in its wrapper, decorative (`alt=""`).
- **Images:** each one gets a clear file name (`phone-lockscreen@3x.webp`, `chat-avatar@3x.webp`) so it can be
  uploaded to Webflow Assets and served from there. None are hosted here.
- **New CSS** for either component goes into its file here, never into a page embed.

## Versions

- `@4`: one file per component (Built to extend `cv_*`, tabs `tv_*`, hero `hv_*` since 4.1.0), CSS only, minified.
  4.4.0: the big number digit roll is its own component, `clarify-number.min.css` + `clarify-number.min.js` (`nv_*`).
  (It sat in the Built to extend file as `cv_number` in 4.3.x, before anyone used it.)
  4.5.0: the digits roll all the way to the cell's lines (the script measures the padding); tabs use the site's font variables (the mono is "Geistmono" in Webflow).
  4.5.1: tab visuals back to their original speed (4.5.0 had made them 2× slower by mistake).
  4.5.3: big number trimmed to its digits (`--nv-trim: 0.13em`), so the gap to the lines = the cell's padding.
  4.5.4: tabs: the middle chart note tag is centred on its line, so a long label ("Degasser on") clears its neighbours.
  4.5.5: Built to extend: the phone notifications and chat use Geist (the site font) instead of the system / SF Pro font.
  4.5.2: How it works · Act header, 16 between the title row and the phase chips (was 12), as in Figma.
- `@3`: one file for everything (`clarify-tabs.min.css` + `.min.js`, `cv_*`). Frozen.
- `@2`, `@1`: older naming. Frozen.
