/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import path from 'path'

const { paths } = require('./jsconfig.json').compilerOptions

const alias = Object.assign(
  ...Object.keys(paths)
    .filter((key) => /^.*\/\*/.test(key))
    .map((key) => ({
      [key.replace('/*', '')]: path.resolve(__dirname, `./${paths[key]}`.replace('/*', ''))
    }))
)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  resolve: {
    alias
  },
  assetsInclude: ['*.svg']
})
