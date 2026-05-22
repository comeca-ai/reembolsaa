import React from "react";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS, ROLE_BADGE_STYLES, DEFAULT_ROLE } from "@/lib/roles";

export default function RoleBadge({ role }) {
  const style = ROLE_BADGE_STYLES[role] ?? ROLE_BADGE_STYLES[DEFAULT_ROLE];
  return (
    <Badge variant="outline" className={`text-[11px] font-medium px-2 py-0.5 ${style}`}>
      {ROLE_LABELS[role] ?? role}
    </Badge>
  );
}
