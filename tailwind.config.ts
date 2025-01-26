import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)'
  		},
  		screens: {
  			'xs-h': {
  				raw: '(min-height: 480px)'
  			},
  			'sm-h': {
  				raw: '(min-height: 640px)'
  			},
  			'md-h': {
  				raw: '(min-height: 768px)'
  			},
  			'lg-h': {
  				raw: '(min-height: 1024px)'
  			},
  			'xl-h': {
  				raw: '(min-height: 1280px)'
  			},
  			'2xl-h': {
  				raw: '(min-height: 1536px)'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
