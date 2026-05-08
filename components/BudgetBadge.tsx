export default function BudgetBadge({
  status,
}: {
  status: "within" | "slightly_over" | "over";
}) {
  const config = {
    within: { icon: "✓", label: "Within", color: "text-sage" },
    slightly_over: { icon: "~", label: "Tight", color: "text-goldenrod" },
    over: { icon: "↑", label: "Over", color: "text-sunset" },
  }[status];

  return (
    <span className={`font-display text-[20px] leading-none tracking-tight ${config.color}`}>
      <span className="font-mono text-[14px] mr-1.5">{config.icon}</span>
      {config.label}
    </span>
  );
}
