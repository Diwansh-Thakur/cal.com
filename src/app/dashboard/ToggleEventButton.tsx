"use client";

import { useState, useTransition } from "react";
import { toggleEventTypeActive } from "./actions";

export function ToggleEventButton({ id, initialActive }: { id: string; initialActive: boolean }) {
  const [isActive, setIsActive] = useState(initialActive);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const nextState = !isActive;
    setIsActive(nextState);
    startTransition(() => {
      toggleEventTypeActive(id, nextState);
    });
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isActive}
      onClick={handleToggle}
      disabled={isPending}
      className={`w-9 h-5 rounded-full relative mr-2 cursor-pointer hidden md:block transition-colors ${
        isActive ? "bg-black" : "bg-gray-300"
      }`}
    >
      <div 
        className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${
          isActive ? "translate-x-4.5 right-auto left-0.5" : "translate-x-0 right-auto left-0.5"
        }`} 
      />
    </button>
  );
}
