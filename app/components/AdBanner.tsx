"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  desktopKey: string;
  mobileKey: string;
}

export default function AdBanner({ desktopKey, mobileKey }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    const isMobile = window.innerWidth <= 640;
    const key = isMobile ? mobileKey : desktopKey;
    const width = isMobile ? 320 : 468;
    const height = isMobile ? 50 : 60;

    (window as any).atOptions = {
      key,
      format: "iframe",
      width,
      height,
      params: {},
    };

    const script = document.createElement("script");
    script.src = `https://www.highperformanceformat.com/${key}/invoke.js`;
    script.async = true;

    adRef.current.innerHTML = "";
    adRef.current.appendChild(script);

    return () => {
      if (adRef.current) adRef.current.innerHTML = "";
    };
  }, [desktopKey, mobileKey]);

  return (
    <div className="bg-gray-100 w-full flex justify-center py-4" ref={adRef} />
  );
}
