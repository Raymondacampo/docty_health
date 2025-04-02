export default function TakesDatesFilter({ value, onChange }) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Takes Dates</label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="any">Any</option>
          <option value="app">Via App</option>
          <option value="virtual">Virtually</option>
          <option value="in_person">In Person</option>
        </select>
      </div>
    );
  }