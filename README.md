# Clarify UI animations

Hosted CSS for the animated section visuals on clarify.io (Webflow). Two files, one per component.
CSS only: the scripts (tabs, in-view, count-up) live in Webflow. Images live in Webflow Assets.

| Component | Link tag (Head) |
|---|---|
| Built to extend cards | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Ish-Development/clarify-ui-animations@4/clarify-built-to-extend.min.css">` |
| Tabs (What Clarify does, How it works) | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Ish-Development/clarify-ui-animations@4/clarify-tabs.min.css">` |

`@4` follows the latest 4.x release. Pin an exact version (`@4.0.0`) to freeze it. The readable sources sit next to
the minified files (`clarify-built-to-extend.css`, `clarify-tabs.css`).

## Rules

- **Naming (Lumos):** Built to extend = `cv_*`, tabs = `tv_*`. Path-named elements (`cv_msg_avatar`,
  `tv_glass_panel`), `is-*` combo classes for variants and states, `data-cv*` / `data-tv*` hooks.
- **Built to extend:** a parent div owns the size (`.cv_component`, an inline-size container; 1 Figma px =
  `--u` = `100cqw / 451`). Every image is absolutely positioned in its wrapper, decorative (`alt=""`).
- **Images:** each one gets a clear file name (`phone-lockscreen@3x.webp`, `chat-avatar@3x.webp`) so it can be
  uploaded to Webflow Assets and served from there. None are hosted here.
- **New CSS** for either component goes into its file here, never into a page embed.

## Versions

- `@4`: two files (Built to extend `cv_*`, tabs `tv_*`), CSS only, minified.
- `@3`: one file for everything (`clarify-tabs.min.css` + `.min.js`, `cv_*`). Frozen.
- `@2`, `@1`: older naming. Frozen.
