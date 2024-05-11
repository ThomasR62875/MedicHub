module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ['@babel/preset-env', {targets: {node: 'current'}}], // Configuración para entorno de Node.js
      '@babel/preset-expo', // Preset de Expo para React Native
      '@babel/preset-typescript', // Preset de TypeScript
    ],
    plugins: [
      ['module:react-native-dotenv'], // Si estás usando variables de entorno
    ],
  };
};
