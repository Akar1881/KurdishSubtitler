import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'org.nativescript.kurdishsubtitler',
  appPath: 'app',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none',
    maxLogcatObjectSize: 2048,
    discardUncaughtJsExceptions: true,
    enableMultithreadedJavascript: true
  },
  ios: {
    discardUncaughtJsExceptions: true
  },
  webpackConfigPath: 'webpack.config.js',
  useLibs: true
} as NativeScriptConfig;