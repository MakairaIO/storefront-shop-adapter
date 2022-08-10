// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

const [_engine, _path, adapterName] = process.argv

if (!/[a-zA-Z]+/.test(adapterName)) {
  throw new Error('The adapter name can only consist of letters a-z or A-Z')
}

const adapterNameCleaned = adapterName.toLocaleLowerCase()

const adapterNameUpperCase =
  adapterNameCleaned.charAt(0).toUpperCase() + adapterNameCleaned.slice(1)

const destinationDir = `${__dirname}/../../packages/storefront-shop-adapter-${adapterNameCleaned}`
const mainTsConfigPath = `${__dirname}/../../tsconfig.json`

if (fs.existsSync(destinationDir)) {
  throw new Error('The adapter already exists')
}

copyAndReplaceAllTemplateFiles(
  `${__dirname}/storefront-shop-adapter-template`,
  destinationDir
)

// update the main tsconfig

const mainTsConfig = JSON.parse(
  fs.readFileSync(mainTsConfigPath, { encoding: 'utf-8' })
)

mainTsConfig.compilerOptions.paths[
  `@makaira/storefront-shop-adapter-${adapterNameCleaned}/*`
] = [`../storefront-shop-adapter-${adapterNameCleaned}/src/*`]

mainTsConfig.compilerOptions.paths[
  `@makaira/storefront-shop-adapter-${adapterNameCleaned}`
] = [`../storefront-shop-adapter-${adapterNameCleaned}/src`]

fs.writeFileSync(mainTsConfigPath, JSON.stringify(mainTsConfig, null, 2))

function copyAndReplaceAllTemplateFiles(src, dest) {
  const exists = fs.existsSync(src)
  const stats = exists && fs.statSync(src)
  const isDirectory = exists && stats.isDirectory()
  if (isDirectory) {
    fs.mkdirSync(dest)
    fs.readdirSync(src).forEach(function (childItemName) {
      copyAndReplaceAllTemplateFiles(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      )
    })
  } else {
    const fileContent = fs.readFileSync(src, { encoding: 'utf-8' })

    fs.writeFileSync(
      dest,
      fileContent
        .replace(/__SHOP_ADAPTER_NAME__/g, adapterNameCleaned)
        .replace(/__SHOP_ADAPTER_NAME_UPPERCASE__/g, adapterNameUpperCase)
        .replace(/\*\*SHOP_ADAPTER_NAME\*\*/g, adapterNameCleaned)
        .replace(/\*\*SHOP_ADAPTER_NAME_UPPERCASE\*\*/g, adapterNameUpperCase)
    )
  }
}
