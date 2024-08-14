module.exports = {
  plugins: [
    '@babel/syntax-dynamic-import',
    '@babel/transform-async-to-generator',
    [
      'react-intl',
      {
        messagesDir: './translations/messages/',
      },
    ],
  ],
  presets: ['@babel/env', '@babel/react'],
}

// for react-intl v3
// module.exports = {
//   plugins: [
//     '@babel/syntax-dynamic-import',
//     '@babel/transform-async-to-generator',
//     [
//       'formatjs',
//       {
//         idInterpolationPattern: '[sha512:contenthash:base64:6]',
//         ast: true,
//       },
//     ],
//   ],
//   presets: ['@babel/env', '@babel/react'],
// }
