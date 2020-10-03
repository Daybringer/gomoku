module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: [],
  theme: {
    extend: {
      colors: {
        "gomoku-blue": "#00b3fe",
        "gomoku-blue-dark": "#008FCC",
        "gomoku-pink": "#ff2079",
        "gomoku-yellow": "#defe47",
        "gomoku-tyrq": "#01ffc3",
        "gomoku-grey": "#8f8f8f",
        "gomoku-black": "#363636",
      },
      height: {
        50: "50%",
        60: "60%",
        80: "80%",
        90: "90%",
      },
      width: {
        10: "10%",
        50: "50%",
        60: "60%",
        80: "80%",
        90: "90%",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "4xl": "2rem",
      },
      minHeight: {
        "50vh": "50vh",
      },
      screens: {
        "2xl": "1680px",
      },
      boxShadow: {
        "outline-white": "0 0 0 3px rgba(247,250,252,0.3)",
      },
    },
  },
  variants: {},
  plugins: [],
};
