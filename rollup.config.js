import NodePath from 'path';
import RollupNodeResolve from '@rollup/plugin-node-resolve';
import RollupCommonjs from '@rollup/plugin-commonjs';
import RollupTypescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

const resolveFile = (path) => NodePath.resolve(__dirname, path);

const externalpkgs = ['react', 'react-dom', '@tarojs/components', '@tarojs/runtime', '@tarojs/taro', '@tarojs/react'];

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: resolveFile(pkg.main),
      format: 'cjs',
      sourcemap: false,
    },
    {
      file: resolveFile(pkg.module),
      format: 'es',
      sourcemap: false,
    },
  ],
  external: externalpkgs,
  plugins: [
    RollupNodeResolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules',
      },
    }),
    RollupCommonjs({
      include: /\/node_modules\//,
    }),
    RollupTypescript(),
  ],
};
