// components/SelectInput.tsx
import React from "react";

type SelectInputProps = {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
};

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  id,
  value,
  onChange,
  options,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block mb-2 text-sm font-medium text-gray-900"
    >
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default SelectInput;
