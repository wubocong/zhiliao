module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        require('./babel/babel-plugin-async-catch'),
        {
          catchClause: (identifier) => `console.error(${identifier});require('react-native-root-toast').default.show(${identifier}?.message);`,
        },
      ],
    ],
  };
};
