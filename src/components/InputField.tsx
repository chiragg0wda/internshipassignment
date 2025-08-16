import React, { useState, useId } from 'react';
import { Eye, EyeOff, X, Loader2 } from 'lucide-react';

export interface InputFieldProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  loading?: boolean;
  variant?: 'filled' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'text' | 'password' | 'email' | 'number';
  clearable?: boolean; // optional clear button support
}

const InputField: React.FC<InputFieldProps> = ({
  value = '',
  onChange,
  label,
  placeholder,
  helperText,
  errorMessage,
  disabled = false,
  invalid = false,
  loading = false,
  variant = 'outlined',
  size = 'md',
  type = 'text',
  clearable = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const id = useId();

  // Sizes mapping
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
  };

  // Variants mapping
  const variantClasses = {
    filled: 'bg-gray-100 dark:bg-gray-700 border-transparent focus:ring-2 focus:ring-blue-500',
    outlined: 'border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500',
    ghost: 'bg-transparent border-transparent focus:ring-2 focus:ring-blue-500',
  };

  const togglePassword = () => setShowPassword(!showPassword);
  const showClearBtn = clearable && !disabled && value.length > 0;

  const handleClear = () => {
    if (!disabled && onChange) {
      const event = {
        target: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium mb-1 dark:text-gray-200">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          id={id}
          value={value}
          onChange={onChange}
          type={type === 'password' && showPassword ? 'text' : type}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={invalid}
          className={`w-full rounded-lg focus:outline-none transition ${sizeClasses[size]} ${variantClasses[variant]} ${
            invalid ? 'border-red-500 focus:ring-red-500' : ''
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} pr-10`}
          aria-describedby={helperText || errorMessage ? `${id}-helper` : undefined}
          aria-disabled={disabled}
        />

        {/* Password toggle */}
        {type === 'password' && !disabled && !loading && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-2 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {/* Clear button */}
        {showClearBtn && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 text-gray-400 hover:text-gray-600"
            aria-label="Clear input"
          >
            <X size={18} />
          </button>
        )}

        {/* Loading spinner */}
        {loading && (
          <Loader2 className="absolute right-2 animate-spin text-gray-400" size={18} aria-label="Loading" />
        )}
      </div>

      {/* Helper vs error text */}
      {helperText && !errorMessage && (
        <p id={`${id}-helper`} className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
      {errorMessage && (
        <p id={`${id}-helper`} className="mt-1 text-xs text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default InputField;
