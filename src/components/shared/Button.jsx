function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
}) {
  const baseStyles = 'font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'text-white active:scale-95 shadow-md',
    secondary: 'text-white active:scale-95',
    ghost: 'bg-transparent active:scale-95',
    option: 'text-warm-700 active:scale-95',
    selected: 'cursor-default',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  const getInlineStyles = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: '#ff91af', boxShadow: '0 4px 6px -1px rgba(255, 145, 175, 0.3)' };
      case 'secondary':
        return { backgroundColor: '#fbcce7', color: '#ff91af' };
      case 'ghost':
        return { color: '#ff91af' };
      case 'option':
        return { backgroundColor: '#FBFAF2', border: '2px solid #fbcce7' };
      case 'selected':
        return { backgroundColor: '#fbcce7', color: '#ff91af', border: '2px solid #ff91af' };
      default:
        return {};
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      style={getInlineStyles()}
    >
      {children}
    </button>
  );
}

export default Button;
