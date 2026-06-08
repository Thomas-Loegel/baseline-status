---
"@thomas-loegel/baseline-status": minor
---

Redesign the widget layout and make it responsive:

- The feature name is now shown as the primary title, with the Baseline status as secondary text underneath.
- The status badge and "Newly available" chip are grouped together, and the expand/collapse chevron now sits next to the title.
- Larger default typography and icon sizes (32px) for better readability.
- The browser support row now wraps below the title on narrow containers, using a container query — the widget adapts to its own width rather than the viewport.
- Removed the status icon (checkmark / warning / error circle) — it was redundant with the badge and color already conveying the status.
- Removed the `--bs-status-icon-size`, `--bs-browser-icon-size` and `--bs-support-icon-size` CSS custom properties: letting consumers resize icons broke the responsive layout. Icons now use a fixed size.
