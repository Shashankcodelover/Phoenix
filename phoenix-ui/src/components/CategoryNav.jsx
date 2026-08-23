'use client';

export default function CategoryNav({ categories = [], activeCategory, onSelectCategory, accentColor = 'indigo' }) {
  const getAccentClass = (catId) => {
    const isActive = activeCategory === catId;
    if (!isActive) return 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border-transparent';

    switch (accentColor) {
      case 'sky':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-md shadow-sky-500/15';
      case 'emerald':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/15';
      case 'indigo':
      default:
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-md shadow-indigo-500/15';
    }
  };

  return (
    <div className="sticky top-18 z-40 mb-8 p-1.5 rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/50">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-1 font-mono text-xs">
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap border flex items-center gap-1.5 ${getAccentClass('all')}`}
        >
          <span>✨</span> All Modules
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap border flex items-center gap-2 ${getAccentClass(cat.id)}`}
          >
            <span>{cat.icon}</span>
            <span>{cat.title}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-white/80 font-mono">
              {cat.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
