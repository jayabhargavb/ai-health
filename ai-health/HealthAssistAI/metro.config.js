const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add this to support SVG files
const assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
const sourceExts = [...config.resolver.sourceExts, 'svg'];

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};
config.resolver = {
  ...config.resolver,
  assetExts,
  sourceExts,
};

module.exports = config;
