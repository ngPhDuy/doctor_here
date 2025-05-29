import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

type TextInputProps = {
  label: string;
  id: string;
  type?: string;
  value: string;
  disabled?: boolean;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const TextInput: React.FC<TextInputProps> = ({
  label,
  id,
  type = "text",
  value,
  disabled = false,
  required = false,
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
      disabled={disabled}
      required={required}
      onChange={onChange}
      className={
        `block w-full p-2 text-sm text-blueText border border-gray-300 rounded-lg ` +
        (disabled ? "bg-gray-200 cursor-not-allowed" : "bg-white")
      }
    />
  </div>
);

// Password Input
type PasswordInputProps = {
  label: string;
  id: string;
  value: string;
  disabled?: boolean;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  id,
  value,
  disabled = false,
  required = false,
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="block mb-1 text-sm font-medium text-blueText"
      >
        {label}
      </label>
      <input
        type={showPassword ? "text" : "password"}
        id={id}
        value={value}
        disabled={disabled}
        required={required}
        onChange={onChange}
        className={
          `block w-full p-2 text-sm text-blueText border border-gray-300 rounded-lg ` +
          (disabled ? "bg-gray-200 cursor-not-allowed" : "bg-gray-50")
        }
      />
      <button
        type="button"
        className="absolute right-2 top-9 text-gray-500"
        onClick={() => setShowPassword(!showPassword)}
        disabled={disabled}
      >
        {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
      </button>
    </div>
  );
};

// TextArea Input
type TextAreaInputProps = {
  label: string;
  id: string;
  value: string;
  disabled?: boolean;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export const TextAreaInput: React.FC<TextAreaInputProps> = ({
  label,
  id,
  value,
  disabled = false,
  required = false,
  onChange,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block mb-2 text-sm font-medium text-blueText"
    >
      {label}
    </label>
    <textarea
      id={id}
      value={value}
      disabled={disabled}
      required={required}
      onChange={onChange}
      className={
        `block w-full p-2 text-sm text-blueText border border-gray-300 rounded-lg ` +
        (disabled ? "bg-gray-200 cursor-not-allowed" : "")
      }
      rows={2}
    />
  </div>
);

// Checkbox Input
type CheckboxInputProps = {
  label: string;
  id: string;
  checked: boolean;
  disabled?: boolean;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const CheckboxInput: React.FC<CheckboxInputProps> = ({
  label,
  id,
  checked,
  disabled = false,
  required = false,
  onChange,
}) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      disabled={disabled}
      required={required}
      onChange={onChange}
      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
    />
    <label htmlFor={id} className="ml-2 text-sm font-medium text-blueText">
      {label}
    </label>
  </div>
);

// Radio Group Input
type RadioOption = {
  value: string;
  label: string;
};

type RadioGroupInputProps = {
  label: string;
  name: string;
  selectedValue: string;
  disabled?: boolean;
  required?: boolean;
  onChange: (value: string) => void;
  options: RadioOption[];
};

export const RadioGroupInput: React.FC<RadioGroupInputProps> = ({
  label,
  name,
  selectedValue,
  disabled = false,
  required = false,
  onChange,
  options,
}) => (
  <div>
    <p className="mb-2 text-sm font-medium text-blueText">{label}</p>
    {options.map((option) => (
      <label key={option.value} className="inline-flex items-center mr-4">
        <input
          type="radio"
          name={name}
          value={option.value}
          checked={selectedValue === option.value}
          disabled={disabled}
          required={required}
          onChange={() => onChange(option.value)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm">{option.label}</span>
      </label>
    ))}
  </div>
);

// Select Input
type SelectInputProps = {
  label: string;
  id: string;
  value: string;
  disabled?: boolean;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
};

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  id,
  value,
  disabled = false,
  onChange,
  required = false,
  options,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block mb-2 text-sm font-medium text-blueText"
    >
      {label}
    </label>
    <select
      id={id}
      value={value}
      disabled={disabled}
      required={required}
      onChange={onChange}
      className={
        `block w-full p-2 text-sm text-blueText border border-gray-300 rounded-lg ` +
        (disabled ? "bg-gray-200 cursor-not-allowed" : "")
      }
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

// File Input
type FileInputProps = {
  label: string;
  id: string;
  disabled?: boolean;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const FileInput: React.FC<FileInputProps> = ({
  label,
  id,
  disabled = false,
  required = false,
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
      type="file"
      id={id}
      disabled={disabled}
      required={required}
      onChange={onChange}
      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
    />
  </div>
);
