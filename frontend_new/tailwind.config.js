module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,vue}'
  ],
  theme: {
    extend: {
      colors: {
        customPurple: 'rgb(142,151,253)', // This is a solid color
      },
      backgroundImage: {
        gradientPurple: 'linear-gradient(to bottom right, rgb(153, 196, 253), rgb(146, 165, 253))', // This is a gradient
      },
    },
  },
  plugins: [],
};
