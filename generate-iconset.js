'use strict'

const svg2png = require('svg2png')

svg2png('gramin-express-logo.svg', 'target/gramin-express.iconset/icon_16x16.png', 1/16, function() {})
svg2png('gramin-express-logo.svg', 'target/gramin-express.iconset/icon_16x16@2x.png', 1/8, function() {})
svg2png('gramin-express-logo.svg', 'target/gramin-express.iconset/icon_32x32.png', 1/8, function() {})
svg2png('gramin-express-logo.svg', 'target/gramin-express.iconset/icon_32x32@2x.png', 1/4, function() {})
svg2png('gramin-express-logo.svg', 'target/gramin-express.iconset/icon_128x128.png', 1/2, function() {})
svg2png('gramin-express-logo.svg', 'target/gramin-express.iconset/icon_128x128@2x.png', 1, function() {})
svg2png('gramin-express-logo.svg', 'target/gramin-express.iconset/icon_256x256.png', 1, function() {})
svg2png('gramin-express-logo.svg', 'target/gramin-express.iconset/icon_256x256@2x.png', 2, function() {})
svg2png('gramin-express-logo.svg', 'target/gramin-express.iconset/icon_512x512.png', 2, function() {})
svg2png('gramin-express-logo.svg', 'target/gramin-express.iconset/icon_512x512@2x.png', 4, function() {})
