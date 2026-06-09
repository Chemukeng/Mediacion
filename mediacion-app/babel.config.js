module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          jsxImportSource: "nativewind",
          // React Compiler is disabled — it conflicts with NativeWind v4's className transform
          reactCompiler: false,
        },
      ],
      "nativewind/babel",
    ],
  };
};
