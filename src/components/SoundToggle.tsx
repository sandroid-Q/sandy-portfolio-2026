"use client";

import { useState, useRef } from "react";

const BROWN = "#4E3A34";
const DEFAULT_COLOR = "#72503C";
const RED = "#DE211D";

const SPEAKER_BODY = "M15.5 15.75V15.7425M15.5 28.2575C16.5252 29.2094 19.0149 31.3368 21.9165 32.4892C22.7438 32.8178 23.5931 32.2331 23.6672 31.3461C23.8126 29.6051 24 26.4898 24 22C24 17.5102 23.8126 14.3949 23.6672 12.6539C23.5931 11.7669 22.7438 11.1822 21.9165 11.5108C19.0149 12.6632 16.5252 14.7905 15.5 15.7425C15.1776 16.0419 15 16.225 15 16.225C15 16.225 13.6071 16.5655 12.4043 16.9786C11.8256 17.1773 11.4105 17.67 11.3076 18.2732C11.1667 19.0992 11 20.412 11 22C11 23.5879 11.1667 24.9008 11.3076 25.7268C11.4105 26.3299 11.8256 26.8227 12.4043 27.0214C13.6071 27.4345 15 27.775 15 27.775C15 27.775 15.1776 27.9581 15.5 28.2575ZM15.5 28.25V28.2575";
const SPEAKER_FACE = "M15.5 15.7424V15.7499C15.5 15.7499 15 18.5986 15 21.9999C15 25.4013 15.5 28.2499 15.5 28.2499V28.2574";

interface SoundToggleProps {
  muted: boolean;
  onClick: () => void;
}

export default function SoundToggle({ muted, onClick }: SoundToggleProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const wasTouched = useRef(false);

  const color = pressed ? RED : hovered ? BROWN : DEFAULT_COLOR;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => {
        if (wasTouched.current) { wasTouched.current = false; return; }
        setHovered(true);
      }}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => { wasTouched.current = true; setPressed(true); }}
      onTouchEnd={() => { setPressed(false); }}
      aria-label={muted ? "Unmute" : "Mute"}
      style={{
        width: 44,
        height: 44,
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        outline: "none",
        background: "none",
        WebkitTapHighlightColor: "transparent",
        transform: hovered ? "rotate(-15deg)" : "rotate(0deg)",
        transition: "transform 0.35s ease",
      }}
    >
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path d={SPEAKER_BODY} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.12s" }} />
        <path d={SPEAKER_FACE} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.12s" }} />
        {muted ? (
          <>
            <path d="M33 24.7502L27.5 19.2502" stroke={color} strokeWidth="1.5" strokeLinecap="round" style={{ transition: "stroke 0.12s" }} />
            <path d="M27.5 24.7502L33 19.2502" stroke={color} strokeWidth="1.5" strokeLinecap="round" style={{ transition: "stroke 0.12s" }} />
          </>
        ) : (
          <>
            <path d="M30.5 16C33.8333 19.3137 33.8333 24.6863 30.5 28" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.12s" }} />
            <path d="M28 18C30 20.2092 30 23.7908 28 26" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.12s" }} />
          </>
        )}
      </svg>
    </button>
  );
}
