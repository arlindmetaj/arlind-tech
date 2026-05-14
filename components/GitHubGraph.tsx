"use client";

import { useEffect, useState } from "react";

export default function GitHubGraph({ username }: { username: string }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Read initial state
    setDark(document.documentElement.classList.contains("dark"));

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // ghchart.rshah.org/{hex-color}/{username}
  // Light: dark green  |  Dark: soft blue that reads well on dark bg
  const color = dark ? "58a6ff" : "216e39";
  const src = `https://ghchart.rshah.org/${color}/${username}`;

  return (
    <img
      src={src}
      alt={`${username}'s GitHub contribution graph`}
      className="w-full"
      style={{ opacity: dark ? 0.9 : 1 }}
    />
  );
}
