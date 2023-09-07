const fs = require('fs/promises'); // Usamos fs/promises para leer el archivo de forma asíncrona
const { absoluteRoute, exiteRoute, isMarkdownFile, extractLinksFromMarkdown } = require('../DEV009-md-links/functionMDL.js');
/*
Es necesario que la función mdLinks sea asíncrona porque realiza operaciones de lectura de archivos
 y acceso al sistema de archivos, las cuales son operaciones de E/S (entrada/salida) que pueden llevar
tiempo. Si no se utiliza una función asíncrona, estas operaciones bloquearían la ejecución del programa
y podrían hacer que se vuelva lento o no responda correctamente.
*/
function mdLinks(path) {
  return new Promise(async (resolve, reject) => {
    //identifica si la ruta existe.
    if (exiteRoute(path)) {
      //chequear o convertir a una ruta absoluta.
      const absolutePath = absoluteRoute(path);
      //ver si es un archico marckdown
      if (isMarkdownFile(absolutePath)) {
        // Leemos el archivo Markdown
        try {
          const content = await fs.readFile(absolutePath, 'utf8');
          const links = extractLinksFromMarkdown(content, absolutePath); // Pasar content y la ruta del archivo
          resolve(links)
        } catch (error) {
          reject(`Error al leer el archivo: ${error.message}`);
        }
      } else {
        resolve('no es Markdown'); // Si no es Markdown, resolvemos con `false`
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
mdLinks('prueba.md')
  .then((resolve) => {
    console.log(resolve);
  })
  .catch((error) => {
    console.error(error);
  });


// const fs = require('fs');

// const mdLinks = (path) => {
//   return new Promise((resolve, reject) => {
//     //identifica si la ruta existe.
//     if (fs.existsSync(path)) {
//       resolve('la ruta existe');
//       //chequear o convertir a una ruta absoluta.
//       //probar si la ruta absoluta es un archivo o un directorio
//       //si es un directorio filtrar los archivos md
//     } else {
//       //si no existe la ruta se va a rechazar la promesa
//       reject('La ruta no existe')
//     }
//   });
// }
// module.exports = () => {
//   mdLinks()
// };
// mdLinks('README.m')
//   .then(() => {

//   }).catch(() => {

//   })