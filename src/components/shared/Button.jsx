function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
}) {
  const baseStyles = 'font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-pink-500 text-white hover:bg-pink-600 active:scale-95',
    secondary: 'bg-white text-pink-500 border-2 border-pink-500 hover:bg-pink-50 active:scale-95',
    ghost: 'bg-transparent text-pink-500 hover:bg-pink-100 active:scale-95',
    option: 'bg-white text-gray-700 border-2 border-pink-200 hover:border-pink-400 hover:bg-pink-50 active:scale-95',
    selected: 'bg-pink-100 text-pink-700 border-2 border-pink-500 cursor-default',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
