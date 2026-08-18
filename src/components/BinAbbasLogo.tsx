import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MessageCircle, Phone, CheckCircle2, MapPin, Download, Share2, Check, Sparkles } from "lucide-react";
import { OWNER_NAME, BUSINESS_NAME, ENGLISH_NAME, ADDRESS, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from "../data";

// 3D Master App Logo Plaque Component
function RenderMaster3DLogo({ showPhone = true }: { showPhone?: boolean }) {
  return (
    <svg 
      viewBox="0 0 600 500" 
      className="w-full h-auto drop-shadow-md select-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Soft Luxury Light Emerald & Mint Pearl Radial Background */}
        <radialGradient id="appLogoBgRadial" cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#f3faf6" />
          <stop offset="75%" stopColor="#dff2e7" />
          <stop offset="100%" stopColor="#c5e8d3" />
        </radialGradient>

        {/* Ultra-Luminous 3D Metallic Champagne Gold Gradient */}
        <linearGradient id="appHdGold3D" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="15%" stopColor="#fff1b3" />
          <stop offset="35%" stopColor="#f5d061" />
          <stop offset="60%" stopColor="#c9971e" />
          <stop offset="85%" stopColor="#8a600a" />
          <stop offset="95%" stopColor="#e8bf56" />
          <stop offset="100%" stopColor="#ffe699" />
        </linearGradient>

        {/* 3D Bevel Gold Gradient */}
        <linearGradient id="appHdGoldBevel" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#ffea9f" />
          <stop offset="70%" stopColor="#c59828" />
          <stop offset="100%" stopColor="#734f07" />
        </linearGradient>

        {/* Building Front Face Facet (Pure Pearl White) */}
        <linearGradient id="appHdBldgFront" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#f4fbf7" />
          <stop offset="100%" stopColor="#dcf0e4" />
        </linearGradient>

        {/* Gold 3D Shadow Side */}
        <linearGradient id="appHdGoldSide" x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#b88318" />
          <stop offset="50%" stopColor="#785308" />
          <stop offset="100%" stopColor="#452c02" />
        </linearGradient>

        {/* 3D Embossed Phone Badge Background Gradient */}
        <linearGradient id="phoneBadge3DGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="20%" stopColor="#fff6c8" />
          <stop offset="55%" stopColor="#e5b236" />
          <stop offset="85%" stopColor="#ab7b10" />
          <stop offset="100%" stopColor="#f8d66e" />
        </linearGradient>

        <linearGradient id="phoneBadgeInnerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0a4d30" />
          <stop offset="50%" stopColor="#063822" />
          <stop offset="100%" stopColor="#032415" />
        </linearGradient>

        <linearGradient id="phoneGoldTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#fff3b8" />
          <stop offset="70%" stopColor="#eec34b" />
          <stop offset="100%" stopColor="#bc8a15" />
        </linearGradient>

        {/* Drop Shadows for Crisp 3D Definition */}
        <filter id="appHdDropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#0a4328" floodOpacity="0.22" />
        </filter>
        
        <filter id="appHdTextShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.14" />
        </filter>

        <filter id="phoneBadgeGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#0a3d24" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Outer Card Plaque with 3D Beveled Borders */}
      <rect x="6" y="6" width="588" height="488" rx="28" fill="url(#appLogoBgRadial)" stroke="url(#appHdGold3D)" strokeWidth="2.5" />
      <rect x="14" y="14" width="572" height="472" rx="20" fill="none" stroke="#0e6d42" strokeWidth="1.2" opacity="0.25" strokeDasharray="6 4" />

      {/* 1. Architectural 3D Gold Emblem */}
      <g filter="url(#appHdDropShadow)" transform="translate(300, 118) scale(0.46)">
        {/* Grand Moorish Outer Arch */}
        <path 
          d="M -150 145 V -15 C -150 -105, -90 -175, 0 -205 C 90 -175, 150 -105, 150 -15 V 145 L 120 145 V -15 C 120 -90, 65 -150, 0 -175 C -65 -150, -120 -90, -120 -15 V 145 Z" 
          fill="url(#appHdGold3D)" 
        />

        {/* Arch Inner Golden Bevel Trim */}
        <path 
          d="M -105 145 V -12 C -105 -72, -55 -128, 0 -152 C 55 -128, 105 -72, 105 -12 V 145" 
          fill="none" 
          stroke="url(#appHdGoldBevel)" 
          strokeWidth="4" 
          strokeLinecap="round"
          opacity="0.95" 
        />

        {/* Left Skyscraper Tower */}
        <polygon points="-100,135 -100,-35 -48,-78 -48,135" fill="url(#appHdBldgFront)" />
        <polygon points="-48,-78 -26,-62 -26,135 -48,135" fill="url(#appHdGoldSide)" />
        <g fill="#0b4a2e" opacity="0.85">
          <rect x="-90" y="-10" width="14" height="32" rx="1.5" />
          <rect x="-90" y="36" width="14" height="32" rx="1.5" />
          <rect x="-90" y="82" width="14" height="32" rx="1.5" />
          <rect x="-68" y="-24" width="14" height="32" rx="1.5" />
          <rect x="-68" y="22" width="14" height="32" rx="1.5" />
          <rect x="-68" y="68" width="14" height="32" rx="1.5" />
        </g>

        {/* Center Grand Skyscraper Tower */}
        <polygon points="-22,135 -22,-120 22,-162 25,-158 25,135" fill="url(#appHdBldgFront)" />
        <polygon points="25,-158 54,-135 54,135 25,135" fill="url(#appHdGoldSide)" />
        <g fill="#0b4a2e" opacity="0.88">
          <rect x="-14" y="-85" width="12" height="24" rx="1.5" />
          <rect x="-14" y="-50" width="12" height="24" rx="1.5" />
          <rect x="-14" y="-15" width="12" height="24" rx="1.5" />
          <rect x="-14" y="20" width="12" height="24" rx="1.5" />
          <rect x="-14" y="55" width="12" height="24" rx="1.5" />
          <rect x="-14" y="90" width="12" height="24" rx="1.5" />
          <rect x="4" y="-102" width="12" height="24" rx="1.5" />
          <rect x="4" y="-67" width="12" height="24" rx="1.5" />
          <rect x="4" y="-32" width="12" height="24" rx="1.5" />
          <rect x="4" y="3" width="12" height="24" rx="1.5" />
          <rect x="4" y="38" width="12" height="24" rx="1.5" />
          <rect x="4" y="73" width="12" height="24" rx="1.5" />
        </g>

        {/* Right Tower */}
        <polygon points="60,135 60,-60 105,-34 105,135" fill="url(#appHdGold3D)" />
        <polygon points="105,-34 118,-24 118,135 105,135" fill="url(#appHdGoldSide)" />
        <g stroke="#083823" strokeWidth="3.5" strokeLinecap="round" opacity="0.9">
          <line x1="68" y1="-26" x2="96" y2="-10" />
          <line x1="68" y1="-5" x2="96" y2="11" />
          <line x1="68" y1="16" x2="96" y2="32" />
          <line x1="68" y1="37" x2="96" y2="53" />
          <line x1="68" y1="58" x2="96" y2="74" />
          <line x1="68" y1="79" x2="96" y2="95" />
          <line x1="68" y1="100" x2="96" y2="116" />
        </g>

        {/* Grand Dome */}
        <path d="M -65 145 C -65 75, 65 75, 65 145 Z" fill="url(#appHdGold3D)" />
        <path d="M -50 145 C -50 88, 50 88, 50 145 Z" fill="none" stroke="url(#appHdGoldBevel)" strokeWidth="2.5" opacity="0.85" />
        <path d="M 0 75 V 46" stroke="url(#appHdGold3D)" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="0" cy="42" r="4" fill="#ffffff" />

        {/* Base Platforms */}
        <path d="M -195 158 Q 0 132 195 158" fill="none" stroke="url(#appHdGold3D)" strokeWidth="6" strokeLinecap="round" />
        <path d="M -155 168 Q 0 145 155 168" fill="none" stroke="url(#appHdGoldBevel)" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
      </g>

      {/* 2. ENGLISH BRAND TITLE */}
      <g filter="url(#appHdTextShadow)">
        <text 
          x="300" 
          y="245" 
          textAnchor="middle" 
          fontFamily="'Cinzel', 'Trajan Pro', 'Georgia', serif" 
          fontSize="35" 
          fontWeight="900" 
          letterSpacing="4.5"
          fill="#0a4d30"
        >
          BIN ABBAS
        </text>

        <text 
          x="300" 
          y="276" 
          textAnchor="middle" 
          fontFamily="'Segoe UI', -apple-system, sans-serif" 
          fontSize="16" 
          fontWeight="800" 
          letterSpacing="11"
          fill="#b88318"
        >
          PROPERTIES
        </text>
      </g>

      {/* 3. URDU CALLIGRAPHY: بن عباس پراپرٹیز */}
      <text 
        x="300" 
        y="336" 
        textAnchor="middle" 
        fontFamily="'Noto Sans Arabic', 'Jameel Noori Nastaleeq', serif" 
        fontSize="38" 
        fontWeight="900"
        fill="#073d25"
        direction="rtl"
      >
        بن عباس پراپرٹیز
      </text>

      {/* 4. LOCATION TAGLINE */}
      <text 
        x="300" 
        y="370" 
        textAnchor="middle" 
        fontFamily="'Noto Sans Arabic', sans-serif" 
        fontSize="16" 
        fontWeight="bold"
        fill="#7a5509"
        direction="rtl"
      >
        رائل پام سٹی، گوجرانوالہ
      </text>

      {/* 5. ⭐ 3D PROMINENT EMBOSSED MOBILE NUMBER BADGE (0320.4800071) */}
      {showPhone && (
        <g filter="url(#phoneBadgeGlow)" transform="translate(300, 424)">
          {/* Outer 3D Gold Rim Plaque */}
          <rect 
            x="-185" 
            y="-26" 
            width="370" 
            height="52" 
            rx="26" 
            fill="url(#phoneBadge3DGrad)" 
            stroke="url(#appHdGold3D)" 
            strokeWidth="2" 
          />
          
          {/* Inner Royal Deep Emerald Inset */}
          <rect 
            x="-181" 
            y="-22" 
            width="362" 
            height="44" 
            rx="22" 
            fill="url(#phoneBadgeInnerGrad)" 
            stroke="#c59828" 
            strokeWidth="1.2" 
          />

          {/* 3D Phone Icon */}
          <g transform="translate(-142, 0) scale(0.9)">
            <circle cx="0" cy="0" r="14" fill="url(#appHdGold3D)" />
            <path 
              d="M -5 -6 C -6 -5, -6 -3, -4 0 C -2 3, 0 5, 3 6 C 5 7, 7 6, 8 4 L 6.5 2 C 6 1.5, 5 1.5, 4.5 2 L 3.5 2.8 C 2.5 2.2, 1.8 1.5, 1.2 0.5 L 2 -0.5 C 2.5 -1, 2.5 -2, 2 -2.5 L 0 -4.5 C -0.5 -5, -1.5 -5, -2 -4.5 Z" 
              fill="#042617" 
            />
          </g>

          {/* 3D Embossed Mobile Number: 0320.4800071 */}
          <text 
            x="12" 
            y="9" 
            textAnchor="middle" 
            fontFamily="'Trebuchet MS', 'Arial Black', -apple-system, sans-serif" 
            fontSize="26" 
            fontWeight="900" 
            letterSpacing="2.5"
            fill="url(#phoneGoldTextGrad)"
            stroke="#021a0f"
            strokeWidth="0.8"
          >
            0320.4800071
          </text>
        </g>
      )}

      {/* Bottom Accent Golden Arc */}
      <path d="M 170 478 Q 300 468 430 478" fill="none" stroke="url(#appHdGold3D)" strokeWidth="1.8" opacity="0.85" strokeLinecap="round" />
    </svg>
  );
}

// 3D Square App Icon Component
function RenderAppIconOnly() {
  return (
    <svg 
      viewBox="0 0 512 512" 
      className="w-full h-full object-contain select-none drop-shadow-md"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="iconOnlyCanvasBg" cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#f5fbf7" />
          <stop offset="75%" stopColor="#e0f3e7" />
          <stop offset="100%" stopColor="#c6e9d4" />
        </radialGradient>

        <linearGradient id="iconOnlyGold3D" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="15%" stopColor="#fff1b0" />
          <stop offset="35%" stopColor="#f5ce5e" />
          <stop offset="60%" stopColor="#ca9820" />
          <stop offset="85%" stopColor="#8c6109" />
          <stop offset="95%" stopColor="#e8bf56" />
          <stop offset="100%" stopColor="#ffe696" />
        </linearGradient>

        <linearGradient id="iconOnlyGoldBevel" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#ffea9a" />
          <stop offset="70%" stopColor="#c59828" />
          <stop offset="100%" stopColor="#734e06" />
        </linearGradient>

        <linearGradient id="iconOnlyBldgWhite" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#f6fcf9" />
          <stop offset="100%" stopColor="#e0f2e7" />
        </linearGradient>

        <linearGradient id="iconOnlyGoldSide" x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#b98519" />
          <stop offset="50%" stopColor="#7a5409" />
          <stop offset="100%" stopColor="#462c03" />
        </linearGradient>

        <filter id="iconOnlyShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#0a4328" floodOpacity="0.22" />
        </filter>
      </defs>

      <rect width="512" height="512" fill="url(#iconOnlyCanvasBg)" rx="112" />
      <circle cx="256" cy="256" r="240" fill="none" stroke="url(#iconOnlyGold3D)" strokeWidth="3" opacity="0.85" />
      <circle cx="256" cy="256" r="232" fill="none" stroke="#0e6d42" strokeWidth="1.5" opacity="0.3" strokeDasharray="6 4" />

      <g filter="url(#iconOnlyShadow)">
        {/* 3D Gold Arch & Buildings Emblem */}
        <g transform="translate(256, 175) scale(0.60)">
          <path 
            d="M -150 145 V -15 C -150 -105, -90 -175, 0 -205 C 90 -175, 150 -105, 150 -15 V 145 L 120 145 V -15 C 120 -90, 65 -150, 0 -175 C -65 -150, -120 -90, -120 -15 V 145 Z" 
            fill="url(#iconOnlyGold3D)" 
          />
          <path 
            d="M -105 145 V -12 C -105 -72, -55 -128, 0 -152 C 55 -128, 105 -72, 105 -12 V 145" 
            fill="none" 
            stroke="url(#iconOnlyGoldBevel)" 
            strokeWidth="4" 
            strokeLinecap="round"
            opacity="0.95" 
          />

          <polygon points="-100,135 -100,-35 -48,-78 -48,135" fill="url(#iconOnlyBldgWhite)" />
          <polygon points="-48,-78 -26,-62 -26,135 -48,135" fill="url(#iconOnlyGoldSide)" />
          <g fill="#0b4a2e" opacity="0.9">
            <rect x="-90" y="-10" width="14" height="32" rx="1.5" />
            <rect x="-90" y="36" width="14" height="32" rx="1.5" />
            <rect x="-90" y="82" width="14" height="32" rx="1.5" />
            <rect x="-68" y="-24" width="14" height="32" rx="1.5" />
            <rect x="-68" y="22" width="14" height="32" rx="1.5" />
            <rect x="-68" y="68" width="14" height="32" rx="1.5" />
          </g>

          <polygon points="-22,135 -22,-120 22,-162 25,-158 25,135" fill="url(#iconOnlyBldgWhite)" />
          <polygon points="25,-158 54,-135 54,135 25,135" fill="url(#iconOnlyGoldSide)" />
          <g fill="#0b4a2e" opacity="0.92">
            <rect x="-14" y="-85" width="12" height="24" rx="1.5" />
            <rect x="-14" y="-50" width="12" height="24" rx="1.5" />
            <rect x="-14" y="-15" width="12" height="24" rx="1.5" />
            <rect x="-14" y="20" width="12" height="24" rx="1.5" />
            <rect x="-14" y="55" width="12" height="24" rx="1.5" />
            <rect x="-14" y="90" width="12" height="24" rx="1.5" />
            <rect x="4" y="-102" width="12" height="24" rx="1.5" />
            <rect x="4" y="-67" width="12" height="24" rx="1.5" />
            <rect x="4" y="-32" width="12" height="24" rx="1.5" />
            <rect x="4" y="3" width="12" height="24" rx="1.5" />
            <rect x="4" y="38" width="12" height="24" rx="1.5" />
            <rect x="4" y="73" width="12" height="24" rx="1.5" />
          </g>

          <polygon points="60,135 60,-60 105,-34 105,135" fill="url(#iconOnlyGold3D)" />
          <polygon points="105,-34 118,-24 118,135 105,135" fill="url(#iconOnlyGoldSide)" />
          <g stroke="#083823" strokeWidth="3.5" strokeLinecap="round" opacity="0.9">
            <line x1="68" y1="-26" x2="96" y2="-10" />
            <line x1="68" y1="-5" x2="96" y2="11" />
            <line x1="68" y1="16" x2="96" y2="32" />
            <line x1="68" y1="37" x2="96" y2="53" />
            <line x1="68" y1="58" x2="96" y2="74" />
            <line x1="68" y1="79" x2="96" y2="95" />
            <line x1="68" y1="100" x2="96" y2="116" />
          </g>

          <path d="M -65 145 C -65 75, 65 75, 65 145 Z" fill="url(#iconOnlyGold3D)" />
          <path d="M -50 145 C -50 88, 50 88, 50 145 Z" fill="none" stroke="url(#iconOnlyGoldBevel)" strokeWidth="2.5" opacity="0.85" />
          <path d="M 0 75 V 46" stroke="url(#iconOnlyGold3D)" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="0" cy="42" r="4" fill="#ffffff" />

          <path d="M -195 158 Q 0 132 195 158" fill="none" stroke="url(#iconOnlyGold3D)" strokeWidth="6" strokeLinecap="round" />
          <path d="M -155 168 Q 0 145 155 168" fill="none" stroke="url(#iconOnlyGoldBevel)" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
        </g>

        {/* English Brand Title */}
        <text 
          x="256" 
          y="322" 
          textAnchor="middle" 
          fontFamily="'Cinzel', 'Trajan Pro', 'Georgia', serif" 
          fontSize="34" 
          fontWeight="900" 
          letterSpacing="4"
          fill="#0a482b"
        >
          BIN ABBAS
        </text>

        <text 
          x="256" 
          y="350" 
          textAnchor="middle" 
          fontFamily="'Segoe UI', -apple-system, sans-serif" 
          fontSize="15" 
          fontWeight="800" 
          letterSpacing="9"
          fill="#b88318"
        >
          PROPERTIES
        </text>
      </g>
    </svg>
  );
}

export default function BinAbbasLogo({ 
  className = "w-full max-w-[320px]",
  variant = "full" 
}: { 
  className?: string;
  variant?: "full" | "iconOnly";
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Reliable Universal PNG Logo Downloader (works across Android, iOS, Windows, Mac)
  const handleDownloadPng = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsDownloading(true);

    try {
      // 1. Fetch the high-res PNG file and create blob
      const logoUrl = "/Bin-Abbas-Properties-Logo.png";
      const response = await fetch(logoUrl);
      
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      // 2. Programmatically trigger native download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "Bin-Abbas-Properties-Official-Logo.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 2000);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.warn("[Logo Download] Fallback direct download link:", err);
      // Fallback direct download link
      const fallbackLink = document.createElement("a");
      fallbackLink.href = "/logo.png";
      fallbackLink.download = "Bin-Abbas-Properties-Official-Logo.png";
      fallbackLink.target = "_blank";
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      document.body.removeChild(fallbackLink);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareLogo = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareText = `بن عباس پراپرٹیز - BIN ABBAS PROPERTIES (رائل پام سٹی، گوجرانوالہ)\nآفیشل برانڈ لوگو و رابطہ معلومات:\nفون و واٹس ایپ: ${CONTACT_PHONE_DISPLAY}\n${window.location.origin}/logo.png`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: "بن عباس پراپرٹیز آفیشل لوگو",
          text: shareText,
          url: `${window.location.origin}/logo.png`
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2500);
      }
    } catch (err) {
      await navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  if (variant === "iconOnly") {
    return (
      <div 
        onClick={handleDownloadPng}
        className={`relative flex items-center justify-center select-none cursor-pointer group ${className}`}
        title="آفیشل 3D ایپ آئیکن (PNG) ڈاؤن لوڈ کرنے کے لیے کلک کریں"
      >
        <RenderAppIconOnly />
      </div>
    );
  }

  return (
    <>
      {/* Official 3D App Icon Brand Logo Card with 1-Click PNG Download Action */}
      <motion.div 
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        onClick={() => {
          // Open HD modal and trigger quick download for seamless user experience
          setIsModalOpen(true);
        }}
        className={`relative flex flex-col items-center text-center select-none cursor-pointer transition-all duration-300 group ${className}`} 
        id="bin-abbas-logo-box"
        title="مکمل تھری ڈی ایچ ڈی لوگو دیکھیں یا پی این جی (PNG) فارمیٹ میں ڈاؤن لوڈ کریں"
      >
        {/* Quick Download Indicator Overlay Badge */}
        <div className="w-full flex items-center justify-between px-2 mb-1 z-10">
          <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-900 bg-amber-300/90 hover:bg-amber-400 px-2.5 py-0.5 rounded-full border border-amber-500/40 shadow-xs transition-transform duration-200 group-hover:scale-105">
            <Sparkles size={11} className="text-amber-700" />
            <span>آفیشل 3D برانڈ لوگو</span>
          </span>

          <button
            type="button"
            onClick={handleDownloadPng}
            className="inline-flex items-center gap-1 text-[10.5px] font-black text-white bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-800 hover:brightness-110 active:scale-95 px-2.5 py-0.5 rounded-full border border-emerald-400 shadow-sm transition-all cursor-pointer"
            title="براہِ راست پی این جی (PNG) لوگو ڈاؤن لوڈ کریں"
          >
            <Download size={11} className={isDownloading ? "animate-spin" : "animate-bounce"} />
            <span>ڈاؤن لوڈ PNG</span>
          </button>
        </div>

        {/* The 3D Master SVG Render */}
        <div className="w-full flex items-center justify-center py-0.5 relative">
          <RenderMaster3DLogo showPhone={true} />

          {/* Hover Tap Visual Hint for User */}
          <div className="absolute inset-x-4 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center">
            <span className="bg-slate-950/85 backdrop-blur-xs text-amber-300 text-[10.5px] font-bold px-3 py-1 rounded-full shadow-lg border border-amber-400/40 flex items-center gap-1">
              <Download size={12} />
              <span>کلک کر کے ایچ ڈی (PNG) ڈاؤن لوڈ کریں</span>
            </span>
          </div>
        </div>

        {/* Global Download Success Toast Floating Notification */}
        <AnimatePresence>
          {downloadSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className="absolute -bottom-8 z-30 bg-emerald-900 text-amber-200 px-3.5 py-1.5 rounded-xl border border-amber-400 shadow-xl flex items-center gap-1.5 text-xs font-black whitespace-nowrap"
            >
              <Check size={14} className="text-emerald-300" />
              <span>آفیشل لوگو (PNG) کامیابی سے ڈاؤن لوڈ ہو گیا!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Ultra-HD Full-Screen Modal & Download Suite */}
      <AnimatePresence>
        {isModalOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
            id="logo-hd-modal-root"
            dir="rtl"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
            />

            {/* Modal Plaque Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 25 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-[435px] bg-gradient-to-b from-[#ffffff] via-[#f4faf6] to-[#def2e6] rounded-3xl p-4 sm:p-5 shadow-2xl border-2 border-amber-400 text-center overflow-hidden z-10 my-auto"
              id="logo-hd-modal-body"
            >
              {/* Top Luxury Gold Accent Line */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600"></div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 left-3 p-1.5 rounded-full bg-white/95 text-emerald-950 hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-300 shadow-sm"
                aria-label="بند کریں"
              >
                <X size={18} />
              </button>

              {/* Verified Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-black text-xs shadow-xs mb-1.5">
                <CheckCircle2 size={14} className="text-emerald-700" />
                <span>تصدیق شدہ آفیشل 3D برانڈ لوگو</span>
              </div>

              {/* Logo Presentation in Modal */}
              <div className="p-1 rounded-2xl overflow-hidden my-1 bg-white/60 border border-emerald-200/70 shadow-inner">
                <RenderMaster3DLogo showPhone={true} />
              </div>

              {/* Prominent High-Def PNG Download & Share Action Buttons */}
              <div className="flex flex-col gap-2 mt-3">
                <div className="grid grid-cols-2 gap-2">
                  {/* 1. Primary PNG Download Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={handleDownloadPng}
                    disabled={isDownloading}
                    className="py-2.5 px-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-105 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-1.5 border border-amber-300 transition-all cursor-pointer"
                  >
                    <Download size={16} className={isDownloading ? "animate-spin" : "text-slate-950"} />
                    <span>{isDownloading ? "ڈاؤن لوڈ جاری ہے..." : "لوگو PNG ڈاؤن لوڈ کریں"}</span>
                  </motion.button>

                  {/* 2. Share Logo Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={handleShareLogo}
                    className="py-2.5 px-3 bg-emerald-900 hover:bg-emerald-950 text-amber-200 font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-1.5 border border-emerald-700 transition-all cursor-pointer"
                  >
                    {copiedShare ? (
                      <>
                        <Check size={16} className="text-emerald-300" />
                        <span>لنک کاپی ہو گیا!</span>
                      </>
                    ) : (
                      <>
                        <Share2 size={16} className="text-amber-300" />
                        <span>لوگو شیئر کریں</span>
                      </>
                    )}
                  </motion.button>
                </div>

                {downloadSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-800 text-emerald-100 text-[11px] font-bold py-1 px-2.5 rounded-lg border border-emerald-500 flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 size={13} className="text-emerald-300" />
                    <span>آفیشل لوگو (PNG) کامیابی سے آپ کی ڈیوائس پر ڈاؤن لوڈ ہو گیا ہے!</span>
                  </motion.div>
                )}
              </div>

              {/* Business Info & Tagline */}
              <div className="mt-3 pt-2.5 border-t border-emerald-200/80 space-y-1">
                <h3 className="text-sm sm:text-base font-black text-emerald-950">
                  {BUSINESS_NAME} ({ENGLISH_NAME})
                </h3>
                <p className="text-xs text-slate-700 font-semibold flex items-center justify-center gap-1">
                  <MapPin size={13} className="text-emerald-700" />
                  <span>{ADDRESS}</span>
                </p>
                <p className="text-[11px] text-emerald-800 font-bold">
                  سی ای او و چیف ایگزیکٹو: {OWNER_NAME}
                </p>
              </div>

              {/* Quick Contact Actions (WhatsApp & Call) */}
              <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-emerald-200">
                <a
                  href={`https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent("السلام علیکم! فریاد حسن گورائیہ صاحب، مجھے بن عباس پراپرٹیز سے متعلق معلومات درکار ہیں۔")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-2.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-black text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 active:scale-95 border border-emerald-500 hover:brightness-110 transition-all"
                >
                  <MessageCircle size={14} className="fill-white" />
                  <span>واٹس ایپ رابطہ</span>
                </a>

                <a
                  href={`tel:+${CONTACT_PHONE}`}
                  className="py-2 px-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 active:scale-95 border border-emerald-600 transition-all"
                >
                  <Phone size={14} />
                  <span>براہِ راست کال</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
