import React from "react";

const COLORS = [
  "bg-primary/15 text-primary",
  "bg-warning/15 text-warning",
  "bg-chart-4/15 text-chart-4",
  "bg-chart-5/15 text-chart-5",
  "bg-destructive/15 text-destructive",
];

function hashIndex(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xfffff;
  return h % COLORS.length;
}

export default function UserAvatar({ avatar, name, size = "md" }) {
  const color = COLORS[hashIndex(avatar || name || "U")];
  const sizeClass = size === "sm" ? "w-7 h-7 text-[11px]" : "w-9 h-9 text-xs";

  return (
    <div className={`${sizeClass} rounded-full ${color} flex items-center justify-center font-mono font-semibold shrink-0`}>
      {(avatar || name?.slice(0, 2) || "?").toUpperCase()}
    </div>
  );
}