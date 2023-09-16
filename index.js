const fs = require('fs/promises'); // Usamos fs/promises para leer el archivo de forma asíncrona
const { absoluteRoute, exiteRoute, isMarkdownFile, extractLinksFromMarkdown } = require('../DEV009-md-links/functionMDL.js');

function mdLinks(path, validate) {
  return new Promise((resolve, reject) => {
    //identifica si la ruta existe.
    if (exiteRoute(path)) {
      //chequear o convertir a una ruta absoluta.
      const absolutePath = absoluteRoute(path);
      //ver si es un archico marckdown
      if (isMarkdownFile(absolutePath)) {
        // Leemos el archivo Markdown
        fs.readFile(absolutePath, 'utf8')
          .then(content => {
            return extractLinksFromMarkdown(content, absolutePath, validate);
          })
          .then(links => {
            resolve(links);
          })
          .catch(error => {
            reject(`Error al leer el archivo: ${error.message}`);
          });
      } else {
        resolve('No es Markdown');
      }
    } else {
      reject('La ruta no existe');
    }
  });
}


module.exports = {
  mdLinks,
}
//lee el archivo md

mdLinks('./markdowns/prueba.md', true)
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(error);
  });
