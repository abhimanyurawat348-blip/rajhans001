export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      // Added browser list for better prefixing support
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'not dead',
        'not ie <= 11'
      ]
    },
  },
};