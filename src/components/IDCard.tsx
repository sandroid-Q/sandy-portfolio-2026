import Image from "next/image";

const BROWN = "#4E3A34";
const CARD_OUTER = "#DCD8D6";
const SLEEVE = "#F3F2F0";
const PHOTO_BG = "#E5E0D7";

function Lanyard({ ext = 0 }: { ext?: number }) {
  const h = 235 + ext;
  // Strap straight section ends at 118+ext, curve bottom at 126+ext
  const sy = 118 + ext;
  const cy = 122.418 + ext;
  const by = 126 + ext;

  return (
    <div style={{ display: "flex", justifyContent: "center", width: 276 }}>
      <svg width={64} height={h} viewBox={`0 0 64 ${h}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Strap body — extended by ext */}
        <path d={`M0 0H64V${sy}C64 ${cy} 60.4183 ${by} 56 ${by}H8C3.58172 ${by} 0 ${cy} 0 ${sy}V0Z`} fill="#4E3A34"/>
        {/* Clip mechanism — translated down by ext */}
        <g transform={`translate(0,${ext})`}>
          <path d="M22.2002 130.7H41.7998C45.5001 130.7 48.5 133.7 48.5 137.4V227C48.5 230.7 45.5001 233.7 41.7998 233.7H22.2002C18.4999 233.7 15.5 230.7 15.5 227V137.4C15.5 133.7 18.4999 130.7 22.2002 130.7Z" fill="#4E3A34" fillOpacity="0.1"/>
          <path d="M22.2002 130.7H41.7998C45.5001 130.7 48.5 133.7 48.5 137.4V227C48.5 230.7 45.5001 233.7 41.7998 233.7H22.2002C18.4999 233.7 15.5 230.7 15.5 227V137.4C15.5 133.7 18.4999 130.7 22.2002 130.7Z" stroke="#4E3A34"/>
          <rect x="17.3999" y="167.8" width="28.8" height="28.8" rx="14.4" fill="#4E3A34"/>
          <circle cx="31.8" cy="182.2" r="10.8" fill="#837571"/>
          <circle cx="31.8001" cy="182.2" r="7.2" fill="#4E3A34"/>
          <circle cx="31.8001" cy="143.2" r="6.7" fill="#B8B0AE" stroke="#4E3A34"/>
          <circle cx="31.7997" cy="182.2" r="3.6" fill="#B8B0AE"/>
          <circle cx="31.7997" cy="143.2" r="3.1" fill="#E5E0D7" stroke="#4E3A34"/>
          <path d="M32 109.7C35.0376 109.7 37.5 112.162 37.5 115.2V139.2C37.5 142.238 35.0376 144.7 32 144.7C28.9624 144.7 26.5 142.238 26.5 139.2V115.2C26.5 112.162 28.9624 109.7 32 109.7Z" fill="#837571" stroke="#4E3A34"/>
        </g>
      </svg>
    </div>
  );
}

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 9,
  fontWeight: 300,
  letterSpacing: "0.04em",
  color: BROWN,
  textTransform: "uppercase",
};

const VALUE_STYLE: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: BROWN,
  textTransform: "uppercase",
};

const FIELDS = [
  { label: "ROLE",     value: "SENIOR PRODUCT DESIGNER" },
  { label: "COMPANY",  value: "BEEM · AP+"              },
  { label: "LOCATION", value: "SYDNEY, AUS"             },
];

function ClipTabOverlay({ ext = 0 }: { ext?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 130.7 + ext,
        left: 106,
        zIndex: 2,
        pointerEvents: "none",
      }}
    >
      <svg width={64} height={104.3} viewBox="0 0 64 104.3" fill="none">
        <g transform="translate(0, -130.7)">
          <path
            d="M22.2002 130.7H41.7998C45.5001 130.7 48.5 133.7 48.5 137.4V227C48.5 230.7 45.5001 233.7 41.7998 233.7H22.2002C18.4999 233.7 15.5 230.7 15.5 227V137.4C15.5 133.7 18.4999 130.7 22.2002 130.7Z"
            fill="#4E3A34" fillOpacity="0.06"
          />
          <path
            d="M22.2002 130.7H41.7998C45.5001 130.7 48.5 133.7 48.5 137.4V227C48.5 230.7 45.5001 233.7 41.7998 233.7H22.2002C18.4999 233.7 15.5 230.7 15.5 227V137.4C15.5 133.7 18.4999 130.7 22.2002 130.7Z"
            stroke="#4E3A34"
          />
        </g>
      </svg>
    </div>
  );
}

export default function IDCard({ strapExtension = 0 }: { strapExtension?: number }) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 276,
        fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
      }}
    >
      <Lanyard ext={strapExtension} />

      {/* Card — overlaps lanyard bottom by 22 px so straps appear to feed through the hole */}
      <div
        style={{
          position: "relative",
          width: 275,
          height: 458,
          marginTop: -22,
          zIndex: 1,
        }}
      >
        {/* Outer card shell — darker beige frame */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: CARD_OUTER,
            borderRadius: 22.5,
            border: `2px solid ${BROWN}`,
          }}
        />

        {/* Sleeve — lighter panel overlaid on the card body */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 37.2,
            transform: "translateX(-50%)",
            width: 258.92,
            height: 412.77,
            backgroundColor: SLEEVE,
            borderRadius: 18.76,
            border: `2px solid ${BROWN}`,
          }}
        />

        {/* Lanyard hole */}
        <div
          style={{
            position: "absolute",
            left: 110.7,
            top: 13.13,
            width: 54.04,
            height: 13.51,
            backgroundColor: SLEEVE,
            borderRadius: 999,
            border: "1px solid #000",
          }}
        />

        {/* ── Header row ─────────────────────────────── */}
        <span style={{ position: "absolute", left: 23.43, top: 43.8, ...LABEL_STYLE }}>
          DESIGN PORTFOLIO
        </span>
        <span style={{ position: "absolute", left: 235.43, top: 43.8, width: 16, textAlign: "right", display: "block", ...LABEL_STYLE }}>
          001
        </span>

        {/* Divider */}
        <div
          style={{
            position: "absolute",
            left: 8.43,
            right: 8.43,
            top: 62.8,
            height: 1,
            backgroundColor: BROWN,
          }}
        />

        {/* ── Photo ──────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            left: 70.43,
            top: 84.8,
            width: 135.59,
            height: 165,
            backgroundColor: PHOTO_BG,
            overflow: "hidden",
            border: `2px solid ${BROWN}`,
          }}
        >
          <Image
            src="/ID-pic.png"
            alt="Sandy Qi"
            fill
            priority
            sizes="136px"
            style={{ objectFit: "cover", objectPosition: "center top" }}
          />
        </div>

        {/* ── Name ───────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            left: 70.43,
            top: 255.8,
            width: 141,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: BROWN,
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          SANDY QI
        </div>

        {/* ── Info fields ────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            left: 29.43,
            top: 307,
            width: 216,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {FIELDS.map(({ label, value }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={LABEL_STYLE}>{label}</span>
              <span style={VALUE_STYLE}>{value}</span>
            </div>
          ))}
        </div>

        {/* ── Graffiti overlays ──────────────────────── */}
        {[
          { src: "/graffiti%20svgs/graffiti-neckers-cube.svg", left: 208.43, top: 38,    width: 23.61, height: 24.88 },
          { src: "/graffiti%20svgs/graffiti-sparkles.svg",     left: 50.69,  top: 91.26, width: 13,    height: 31    },
          { src: "/graffiti%20svgs/graffiti-flowers.svg",      left: 216.43, top: 158.8, width: 37,    height: 52    },
          { src: "/graffiti%20svgs/graffiti-s.svg",            left: 46.39,  top: 255.84,width: 45,    height: 57    },
        ].map(({ src, left, top, width, height }) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt=""
            style={{ position: "absolute", left, top, width, height, pointerEvents: "none" }}
          />
        ))}
      </div>

      <ClipTabOverlay ext={strapExtension} />
    </div>
  );
}
