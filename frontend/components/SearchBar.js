import { useState, useEffect } from "react";
import { publicApiClient } from "@/utils/api";

export default function SearchBar({
  value,
  onChange,
  round = "rounded-[5px] border border-black",
  endpoint,
  placeholder,
  dataKey = "name",
}) {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await publicApiClient.get(endpoint);
        const data = response.data;
        setItems(data);
        setFilteredItems(data);
      } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [endpoint]);

  useEffect(() => {
    if (!isOpen && value && !items.some((item) => item[dataKey] === value)) {
      onChange("");
      setFilteredItems(items);
    }
  }, [isOpen, value, onChange, items, dataKey]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    const filtered = items.filter((item) =>
      item[dataKey].toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredItems(filtered);
    setIsOpen(true);
  };

  const handleOptionClick = (itemValue) => {
    onChange(itemValue);
    setIsOpen(false);
  };

  return (
    <div className="w-full h-full relative text-black">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 100)}
        className={`px-4 text-sm py-3 w-full h-full focus:outline-none ${round}`}
        disabled={loading}
      />
      {isOpen && !loading && filteredItems.length > 0 && (
        <ul className="text-black text-sm absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredItems.map((item) => (
            <li
              key={item.id}
              onMouseDown={() => handleOptionClick(item[dataKey])}
              className="px-2 py-3 hover:bg-gray-100 cursor-pointer"
            >
              {item[dataKey]}
            </li>
          ))}
        </ul>
      )}
      {isOpen && !loading && filteredItems.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2 text-gray-500">
          No items found
        </div>
      )}
    </div>
  );
}