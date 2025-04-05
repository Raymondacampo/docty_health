export default function SexFilter({ value, onChange }) {
  const options = [
    { label: "Both", value: "both" },
    { label: "Male", value: "M" },
    { label: "Female", value: "F" },
  ];

  return (
    <div className="text-black px-2 flex flex-col gap-2">
      <label className="block text-lg font-medium text-gray-700 mb-1">Sex</label>
      <div className="flex gap-4 flex-col">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="inline-flex items-center gap-2 cursor-pointer relative font-semibold tracking-wide"
          >
            {/* Checkbox wrapper */}
            <span className="relative w-5 h-5 flex items-center justify-center">
              {/* Outer border circle */}
              <span className="w-full h-full rounded-full border-2 border-[#2b2774] bg-white" />

              {/* Inner orange dot */}
              {value === opt.value && (
                <span className="absolute w-[12] h-[12] rounded-full bg-[#2b2774]" />
              )}

              {/* Invisible input */}
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
