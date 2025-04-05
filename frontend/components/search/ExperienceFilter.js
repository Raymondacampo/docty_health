export default function ExperienceFilter({ value, onChange }) {
  const options = [
    { label: "Any", value: "any" },
    { label: "5+ years", value: "5" },
    { label: "10+ years", value: "10" },
    { label: "15+ years", value: "15" },
    { label: "20+ years", value: "20" },
  ];

  return (
    <div className="text-black px-2 flex flex-col gap-2">
      <label className="block text-lg font-medium text-gray-700 mb-1">
        Years of Experience
      </label>
      <div className="flex gap-4 flex-col">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="inline-flex items-center gap-2 cursor-pointer relative font-semibold tracking-wide"
          >
            <span className="relative w-5 h-5 flex items-center justify-center">
              <span className="w-full h-full rounded-full border-2 border-[#2b2774] bg-white" />
              {value === opt.value && (
                <span className="absolute w-[10px] h-[10px] rounded-full bg-[#2b2774]" />
              )}
              <input
                type="checkbox"
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </span>
            <span className="text-sm text-gray-700">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
