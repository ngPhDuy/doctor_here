import React from "react";

type TextInputProps = {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const TextInput: React.FC<TextInputProps> = ({
  label,
  id,
  type = "text",
  value,
  onChange,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block mb-2 text-sm font-medium text-blueText"
    >
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      className="block w-full p-2.5 text-sm text-blueText bg-gray-50 border border-gray-300 rounded-lg"
    />
  </div>
);

export default TextInput;
