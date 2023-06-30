'use client'

import React, { InputHTMLAttributes, ChangeEvent } from 'react';
import cn from 'classnames';

import s from './Input.module.css';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

interface Props extends Omit<InputHTMLAttributes<any>, 'onChange'> {
  className?: string;
  onChange?: (value: string) => void;
  label?: string
}

const Input = (props: Props) => {
  const { className, children, onChange, label, ...rest } = props;

  const rootClassName = cn(s.tailwind, {}, className);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
    return null;
  };

  return (
    <div>
      <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-white focus:ring-indigo-600">{label}</label>
      <input
        className={classNames("block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white dark:bg-black dark:text-white mb-4 indent-2", className)}
        onChange={handleOnChange}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        {...rest}
      />
    </div>

  );
};

export default Input;
