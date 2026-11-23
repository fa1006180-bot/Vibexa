"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  adKey?: string;
  scriptSrc?: string;
  width?: number;
  height?: number;
}

export default function AdBanner({
  adKey = "YOUR_ADSTERRA_KEY",
  scriptSrc = "",
  width = 320,
  height = 50,
}: AdBannerProps) {
  const adContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = adContainerRef.current;
    if (!container || !adKey || adKey === "YOUR_ADSTERRA_KEY" || !scriptSrc) return;

    container.innerHTML = "";

    const configScript = document.createElement("script");
    configScript.type = "text/javascript";
    configScript.innerHTML = `
      atOptions = {
        'key' : '${adKey}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;

    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = scriptSrc.startsWith("//") ? `https:${scriptSrc}` : scriptSrc;
    invokeScript.async = true;

    container.appendChild(configScript);
    container.appendChild(invokeScript);

    return () => {
      container.innerHTML = "";
    };
  }, [adKey, scriptSrc, width, height]);

  // যতক্ষণ না আসল Ad Key বসাচ্ছেন, ততক্ষণ জায়গাটি প্রিভিউ হিসেবে দেখাবে
  if (!adKey || adKey === "YOUR_ADSTERRA_KEY" || !scriptSrc) {
    return (
      <div className="w-full flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-700 bg-neutral-900/60 py-4 px-3 my-4 text-center">
        <span className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
          Sponsored
        </span>
        <p className="text-xs text-neutral-400">
          Ad Space ({width}×{height}) — এখানে আপনার বিজ্ঞাপন দেখাবে
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center rounded-xl bg-neutral-950/60 border border-neutral-800/70 py-3 px-2 my-4 overflow-hidden">
      <span className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1.5">
        Advertisement
      </span>
      <div
        ref={adContainerRef}
        style={{ minWidth: width, minHeight: height }}
        className="flex items-center justify-center max-w-full overflow-x-auto"
      />
    </div>
  );
}