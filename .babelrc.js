const presetEnv = require('@babel/preset-env')

const logicalAssignmentPlugin = require('@babel/plugin-proposal-logical-assignment-operators')
const decoratorsPlugin = require('@babel/plugin-proposal-decorators')

module.exports = {
  plugins: [
    [logicalAssignmentPlugin, {}],
    [decoratorsPlugin, {
      version: `2021-12`,
      decoratorsBeforeExport: true,
    }],
    `@babel/plugin-proposal-private-methods`,
    `@babel/plugin-proposal-nullish-coalescing-operator`,
    `@babel/plugin-proposal-class-static-block`,
  ],
  presets: [
    [presetEnv, {
      targets: {
        node: `current`,
      },
    }],
  ]
}
