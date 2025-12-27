/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBlue: '#2B47FC',
        lightBlue: '#8898FF',
        babyBlue: '#8898FF33',
        bgGreen: '#00B495',
        bgRed: '#E4797F',
        incomeGreen: '#25A969',
        expensesRed: '#F95B51',
        iconsGrey: '#AAAAAA',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-blue': 'linear-gradient(180deg, rgba(136, 152, 255, 1) 0%, rgba(43, 71, 252, 1) 100%)',
        'gradient-blue-reverse': 'linear-gradient(90deg, rgba(136, 152, 255, 1) 0%, rgba(43, 71, 252, 1) 100%)',
      },
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      maxWidth: {
        'mobile': '600px',
        'tablet': '900px',
        'desktop': '1200px',
      }
    },
  },
  plugins: [],
}
