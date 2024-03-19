// webpack.config.js
module.exports = {
    // Other webpack configurations
    module: {
      rules: [
        {
          test: /\.svg$/,
          use: ['@svgr/webpack'],
          options: {
            svgoConfig: {
              plugins: [{ removeViewBox: false }],
            },
            throwIfNamespace: false, // Add this option
          },
        },
      ],
    },
  };
  