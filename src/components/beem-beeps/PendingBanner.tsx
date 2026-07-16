import Caption from "./Caption";

/**
 * "Pending Banner" section: the two pending-transaction screens plus the banner
 * hierarchy diagram, each with its own caption. Laid out in a centred row that
 * wraps on narrow screens.
 */

const ITEMS: { src: string; alt: string; caption: React.ReactNode; width: number; phone: boolean }[] = [
  { src: "/beem beeps/pending-requests.png", alt: "Pending Requests", caption: "Pending Requests", width: 184, phone: true },
  { src: "/beem beeps/beep-recipient.png", alt: "Beem Beep Recipient", caption: <><span style={{ fontWeight: 500 }}>Beem Beep</span> Recipient</>, width: 184, phone: true },
  { src: "/beem beeps/banner-hierarchy.png", alt: "Banner Hierarchy", caption: "Banner Hierarchy", width: 320, phone: false },
];

export default function PendingBanner() {
  return (
    <div style={{ width: "100%", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start", gap: 48 }}>
      {ITEMS.map((item) => (
        <div key={item.src} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: item.width, maxWidth: "100%" }}>
          <Caption>{item.caption}</Caption>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.src} alt={item.alt} loading="lazy" style={{ display: "block", width: "100%", borderRadius: 16, border: item.phone ? "1px solid var(--color-surface-secondary)" : undefined, boxShadow: item.phone ? "var(--phone-shadow)" : undefined }} />
        </div>
      ))}
    </div>
  );
}
