const path = require('path');

module.exports = {
    // ... các cấu hình khác của Webpack
    resolve: {
        fallback: {
            "http": require.resolve("stream-http"),
            "https": require.resolve("https-browserify"),
            "buffer": require.resolve("buffer"),
            "path": require.resolve("path-browserify"), // Polyfill cho path
            "crypto": require.resolve("crypto-browserify"), // Polyfill cho crypto
            "os": require.resolve("os-browserify/browser"), // Polyfill cho os
        },
    },
    // ... các cấu hình khác của Webpack
};