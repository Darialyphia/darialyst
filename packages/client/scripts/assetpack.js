import { AssetPack } from '@assetpack/core';
import makeConfig from '@game/assetpack';

const assetpack = new AssetPack(makeConfig('./src/assets', './src/public/assets'));


void assetpack.watch();
