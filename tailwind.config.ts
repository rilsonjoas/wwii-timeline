import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				primary: ['Inter', 'sans-serif'],
				display: ['Crimson Pro', 'serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// WWII Timeline custom colors
				military: {
					olive: 'hsl(var(--military-olive))',
					'olive-light': 'hsl(var(--olive-light))',
				},
				sepia: {
					dark: 'hsl(var(--sepia-dark))',
					medium: 'hsl(var(--sepia-medium))',
					light: 'hsl(var(--sepia-light))',
				},
				amber: {
					highlight: 'hsl(var(--amber-highlight))',
					glow: 'hsl(var(--amber-glow))',
				},
				vintage: {
					paper: 'hsl(var(--vintage-paper))',
				},
				metal: {
					dark: 'hsl(var(--metal-dark))',
					light: 'hsl(var(--metal-light))',
				}
			},
			backgroundImage: {
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-timeline': 'var(--gradient-timeline)',
				'gradient-accent': 'var(--gradient-accent)',
			},
			boxShadow: {
				'vintage': 'var(--shadow-vintage)',
				'glow': 'var(--shadow-glow)',
				'deep': 'var(--shadow-deep)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'timeline-pulse': {
					'0%, 100%': {
						boxShadow: '0 0 0 0 rgba(251, 191, 36, 0.4)'
					},
					'50%': {
						boxShadow: '0 0 0 10px rgba(251, 191, 36, 0)'
					}
				},
				'time-travel': {
					'0%': {
						transform: 'scale(1) rotate(0deg)',
						filter: 'brightness(1)'
					},
					'50%': {
						transform: 'scale(1.05) rotate(1deg)',
						filter: 'brightness(1.1)'
					},
					'100%': {
						transform: 'scale(1) rotate(0deg)',
						filter: 'brightness(1)'
					}
				},
				'floating': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-4px)'
					}
				},
				'shimmer': {
					'0%': {
						backgroundPosition: '-200% center'
					},
					'100%': {
						backgroundPosition: '200% center'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'timeline-pulse': 'timeline-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'time-travel': 'time-travel 3s ease-in-out infinite',
				'floating': 'floating 3s ease-in-out infinite',
				'shimmer': 'shimmer 2s linear infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
