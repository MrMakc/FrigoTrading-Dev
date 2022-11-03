const fs = require('fs');
const path = require('path');
const prompt = require('prompt');
const colors = require("colors/safe");

const pjson = require('./package.json');

const pkgfile = path.join(__dirname, 'package.json');
const mmconfigfile = path.join(__dirname, 'marmite-src/views/layout/use', 'marmiteConfigData.twig');

prompt.start();

prompt.get([
  {name: 'projectRealName', description: colors.yellow('Nom du projet (ex. Marmite)') },
  {name: 'projectJsName', description: colors.yellow('Nom court du projet (variable JS donc camelCase)')},
  {name: 'projectFolderName',  description: colors.yellow('Dossier de la preprod inté (ex. marmite)')}
  ], function (err, result) {
  console.log('Nom du projet : ' + result.projectRealName);
  console.log('Nom court du projet : ' + result.projectJsName);
  console.log('Dossier preprod inté : ' + result.projectFolderName);
  console.log('Le fichier package.json a été mis à jour.');

  pjson.projectRealName = result.projectRealName;
  pjson.projectFolderName = result.projectFolderName;
  fs.writeFileSync(pkgfile, JSON.stringify(pjson, null, 2));
  fs.writeFileSync(mmconfigfile, '{% set projectRealName = "' + result.projectRealName + '" %}\n' +
    '{% set projectJsName = "' + result.projectJsName + '" %}');
});

