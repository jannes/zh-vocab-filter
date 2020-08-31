module.exports = (config, options) => {
  config.target = 'electron-renderer';


  if (options.fileReplacements) {
    for (let fileReplacement of options.fileReplacements) {
      if (fileReplacement.replace !== 'src/environments/environment.ts') {
        continue;
      }

      let fileReplacementParts = fileReplacement['with'].split('.');
      if (fileReplacementParts.length > 1 && ['web'].indexOf(fileReplacementParts[1]) >= 0) {
        config.target = 'web';
      }
      break;
    }
  }

  config.module.rules.push({
    test: /\.css$/,
    use: [
      {
        loader: "postcss-loader",
        options: {
          ident: "postcss",
          syntax: "postcss",
          plugins: () => [
            require("postcss-import"),
            require("tailwindcss"),
            require("autoprefixer"),
          ],
        },
      },
    ],
  })
  ;

  return config;
}
