export default function SexFilter({ value, onChange }) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="both">Both</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
      </div>
    );
  }