import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  icon,
  ...props 
}) => {
  const baseStyles = "flex items-center justify-center gap-3 px-8 py-4 text-sm font-medium tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border";
  
  const variants = {
    // Primary: Black on White (Light Mode) / White on Black (Dark Mode)
    // Actually, following BFL style: In Dark mode -> White Button. In Light mode -> Black Button.
    primary: "bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-black dark:border-white dark:hover:bg-neutral-200 rounded-sm shadow-lg",
    
    // Secondary: White on Black (Light Mode) / Black on White (Dark Mode)
    secondary: "bg-white text-black border-neutral-300 hover:border-black hover:bg-neutral-50 dark:bg-black dark:text-white dark:border-neutral-800 dark:hover:border-white dark:hover:bg-neutral-900 rounded-sm",
    
    // Danger
    danger: "bg-white text-red-600 border-red-200 hover:bg-red-50 dark:bg-black dark:text-red-500 dark:border-red-900/50 dark:hover:border-red-500 dark:hover:bg-red-950/30 rounded-sm",
    
    // Ghost
    ghost: "bg-transparent text-neutral-500 border-transparent hover:text-black dark:hover:text-white rounded-sm",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </button>
  );
};