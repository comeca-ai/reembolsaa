import React from "react";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS } from "@/lib/mocks/mockData";

const ROLE_STYLES = {
  admin: "border-primary/30 text-primary bg-primary/8",
  approver: "border-warning/30 text-warning bg-warning/8",
  employee: "border-border text-muted-foreground bg-secondary",
};

export default function RoleBadge({ role }) {
  const style = ROLE_STYLES[role] ?? ROLE_STYLES.employee;
  return (
    <Badge variant="outline" className={`text-[11px] font-medium px-2 py-0.5 ${style}`}>
      {ROLE_LABELS[role] ?? role}
    </Badge>
  );
}