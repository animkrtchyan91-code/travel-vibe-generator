export default function BudgetBadge({
  status,
}: {
  status: "within" | "slightly_over" | "over";
}) {
  const config = {
    within: { icon: "✓", label: "Within", color: "text-sage" },
    slightly_over: { icon: "⚠", label: "Slightly over", color: "text-goldenrod" },
    over: { icon: "✗", label: "Over", color: "text-sunset" },
  }[status];

  return (
    <span className={`font-condensed text-[13px] font-medium uppercase tracking-[0.05em] ${config.color}`}>
      {config.icon} {config.label}
    </span>
  );
}
