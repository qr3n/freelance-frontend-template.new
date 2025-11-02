import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
			'./src/**/*.{ts,tsx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
				zinc: {
					900: '#131313'
				},
				emerald: {
					50: '#f0fef2',
					100: '#dcfce1',
					200: '#bbf7c7',
					300: '#86efaa',
					400: '#4ade80',
					500: '#41E95A', // Base color
					600: '#16a34a',
					700: '#15803d',
					800: '#166534',
					900: '#14532d',
					950: '#052e16'
				},

				// Lime Green (#B1F262)
				lime: {
					50: '#f7fee7',
					100: '#ecfccb',
					200: '#d9f99d',
					300: '#bef264',
					400: '#B1F262', // Base color
					500: '#84cc16',
					600: '#65a30d',
					700: '#4d7c0f',
					800: '#365314',
					900: '#1a2e05',
					950: '#0f1419'
				},

				// Golden Yellow (#F2D062)
				golden: {
					50: '#fefce8',
					100: '#fef9c3',
					200: '#fef08a',
					300: '#fde047',
					400: '#F2D062', // Base color
					500: '#eab308',
					600: '#ca8a04',
					700: '#a16207',
					800: '#854d0e',
					900: '#713f12',
					950: '#422006'
				},

				// Sage Green (#6E885E)
				sage: {
					50: '#f6f7f4',
					100: '#e8ebe3',
					200: '#d2d8c8',
					300: '#b5c0a5',
					400: '#94a382',
					500: '#6E885E', // Base color
					600: '#5a7049',
					700: '#48593a',
					800: '#3c4a31',
					900: '#343f2b',
					950: '#1a2215'
				},

				// Forest Green (#5E8874)
				forest: {
					50: '#f4f7f6',
					100: '#e3ece8',
					200: '#c8dbd2',
					300: '#a5c2b3',
					400: '#7fa590',
					500: '#5E8874', // Base color
					600: '#4a6d5d',
					700: '#3d584c',
					800: '#34493f',
					900: '#2d3e36',
					950: '#18221c'
				},

				// Taupe Brown (#88745E)
				taupe: {
					50: '#f7f5f3',
					100: '#ebe6e0',
					200: '#d8cfc2',
					300: '#c1b19f',
					400: '#a69280',
					500: '#88745E', // Base color
					600: '#6f5d4a',
					700: '#5c4c3e',
					800: '#4e4136',
					900: '#443830',
					950: '#251f19'
				}
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
  plugins: [require("tailwindcss-animate"), require('tailwind-scrollbar')],
} satisfies Config;
