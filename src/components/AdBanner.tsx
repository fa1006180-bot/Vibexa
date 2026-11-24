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
    invokeScript.setAttribute("data-cfasync", "false");
    invokeScript.src = scriptSrc.startsWith("//") ? `https:${scriptSrc}` : scriptSrc;
    invokeScript.async = true;

    container.appendChild(configScript);
    container.appendChild(invokeScript);

    return () => {
      container.innerHTML = "";
    };
  }, [adKey, scriptSrc, width, height]);

  if (!adKey || adKey === "YOUR_ADSTERRA_KEY" || !scriptSrc) {
    return (
      <div className="w-full flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-700 bg-neutral-900/60 py-4 px-3 my-4 text-center">
        <span className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
          Sponsored
        </span>
        <p className="text-xs text-neutral-400">
          Ad Space ({width}×{height}) 
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center rounded-2xl bg-neutral-900/90 border border-neutral-800 py-4 px-3 my-4 shadow-2xl overflow-hidden">
      <span className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2">
        Advertisement
      </span>
      <div
        ref={adContainerRef}
        style={{ width, height }}
        className="flex items-center justify-center max-w-full overflow-hidden rounded-lg"
      />
    </div>
  );
}