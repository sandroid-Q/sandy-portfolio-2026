// Corner radius for content images/videos that scales down with the viewport
// so media isn't over-rounded on small screens. Returns a CSS `clamp()` that
// reaches the desktop value `base` on wide screens and floors around a third of
// it on mobile. Phone screenshots/mockups keep their own fixed radius.
export function scaleRadius(base: number, refWidth = 1280): string {
  const min = Math.max(6, Math.round(base * 0.32));
  const vw = ((base / refWidth) * 100).toFixed(3);
  return `clamp(${min}px, ${vw}vw, ${base}px)`;
}
