module.exports = function override(config) {
    return {
      ...config,
      ignoreWarnings: [
        {
          module: /node_modules\/html5-qrcode/,
        },
      ],
    }
  }