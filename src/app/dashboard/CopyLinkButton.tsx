"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button 
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 transition-colors border-r" 
      title="Copy Link"
    >
      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
      <span className="hidden sm:inline">{copied ? "Copied" : "Copy link"}</span>
    </button>
  );
}
