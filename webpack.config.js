module.exports = {
    devtool: false,
    module: {
      rules: [
        // other rules...
        {
          test: /\.js$/,
          use: ['source-map-loader'],
          enforce: 'pre',
          exclude: /node_modules\/(?!@turf\/jsts)/, // Ignore the warning for this package
        },
      ],
    },
    ignoreWarnings: [
      {
        module: /@turf\/jsts/,
        message: /Failed to parse source map/,
      },
    ],
  };
  