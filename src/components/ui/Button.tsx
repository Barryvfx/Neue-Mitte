import { cn } from '@/lib/cn'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2',
          {
            'bg-nm-blue text-white hover:bg-nm-blue-light active:bg-nm-blue-dark shadow-sm hover:shadow-md focus-visible:outline-nm-blue':
              variant === 'primary',
            'bg-nm-sky text-white hover:bg-nm-sky-light shadow-sm hover:shadow-md focus-visible:outline-nm-sky':
              variant === 'secondary',
            'border-2 border-nm-blue/30 text-nm-blue hover:bg-nm-blue/5 hover:border-nm-blue dark:border-nm-sky/40 dark:text-nm-sky dark:hover:bg-nm-sky/10 dark:hover:border-nm-sky':
              variant === 'outline',
            'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800':
              variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700 shadow-sm':
              variant === 'danger',
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-5 py-2.5 text-sm': size === 'md',
            'px-7 py-3.5 text-base': size === 'lg',
            'opacity-60 cursor-not-allowed': disabled || loading,
          },
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
