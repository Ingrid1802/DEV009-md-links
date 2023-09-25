const fs = require('fs/promises');
const path = require('path');
const { absoluteRoute, exiteRoute, isMarkdownFile, extractLinksFromMarkdown } = require('../DEV009-md-links/functionMDL.js');

function mdLinks(ruta, validate) {
  return new Promise((resolve, reject) => {
    const absolutepath = absoluteRoute(ruta);

    function processDirectory(directoryPath) {
      return fs.readdir(directoryPath)
        .then(files => {
          const promises = files.map(file => {
            const filePath = path.join(directoryPath, file);
            return fs.stat(filePath)
              .then(stats => {
                if (stats.isDirectory()) {
                  return processDirectory(filePath);
                } else if (isMarkdownFile(filePath)) {
                  return fs.readFile(filePath, 'utf8')
                    .then(content => {
                      return extractLinksFromMarkdown(content, filePath, validate);
                    });
                }
              });
          });

          return Promise.all(promises);
        })
        .then(results => {
          const links = results.flat();
          return links; // Devuelve los enlaces aquí
        })
        .catch(error => {
          reject(`Error al leer los archivos del directorio: ${error.message}`);
        });
    }

    if (exiteRoute(absolutepath)) {
      processDirectory(absolutepath)
        .then(links => {
          resolve(links); // Resuelve la promesa principal con los enlaces
        })
        .catch(error => {
          reject(error);
        });
    } else {
      reject('La ruta o directorio no existe');
    }
  });
}

module.exports = {
  mdLinks,
};

// // Lee el archivo md
// mdLinks('./markdowns', true)
//   .then(result => {
//     console.log(result);
//   })
//   .catch(error => {
//     console.error(error);
//   });





////con esto se cual es mi directorio
//
// const directorioActual = process.cwd();
// console.log('Directorio actual:', directorioActual);