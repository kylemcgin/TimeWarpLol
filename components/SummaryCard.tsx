interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
}

export default function SummaryCard({ title, value, subtitle, icon }: SummaryCardProps) {
  return (
    <div className="card glow">
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{icon}</div>
      </div>
      <h3 className="text-sm text-gray-400 uppercase tracking-wide mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gradient mb-1">{value}</p>
      <p className="text-sm text-gray-300">{subtitle}</p>
    </div>
  );
}
