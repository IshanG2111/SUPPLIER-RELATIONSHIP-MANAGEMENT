export function Card({ children, className = '', glass = true }) {
  const baseClass = glass
    ? 'rounded-xl border border-white/20 dark:border-[#1e293b]/60 bg-white/70 dark:bg-[#090f1e]/75 backdrop-blur-md shadow-soft dark:shadow-[0_8px_32px_rgba(0,0,0,0.37)]'
    : 'rounded-xl border border-slate-200 bg-white shadow-soft dark:border-[#1e293b] dark:bg-[#090f1e] dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)]';
  return <section className={`${baseClass} ${className}`}>{children}</section>;
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-100/70 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-[#1e293b]/50">
      <div>
        <h2 className="text-base font-semibold text-slate-950 dark:text-white">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
