const marked = require('marked');
const fs = require('fs');
const path = require("path");

// const markdownIt = require('markdown-it')();

// Identifica si la ruta existe.
//(ROUTE = RUTA)
function exiteRoute(route) {
  if (fs.existsSync(route)) {
    return true;
  } else {
    return false;
  }
}

// evaluación de ruta
function absoluteRoute(route) {
  if (!path.isAbsolute(route)) {
    return path.resolve(route);
  } else {
    return route;
  }
}

//Asegurarnos que es un archivo Markdown
function isMarkdownFile(route) {
  // Lista de extensiones Markdown permitidas
  const markdownExtensions = ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'];

  // Obtiene la extensión del archivo usando la función extname del módulo path
  const fileExtension = path.extname(route);

  // Comprueba si la extensión del archivo está en la lista de extensiones Markdown
  return markdownExtensions.includes(fileExtension);
}

function extractLinksFromMarkdown(markdownContent, filePath) {
  const links = [];

  // Configurar el parser de marked para capturar los enlaces
  const renderer = new marked.Renderer();
  renderer.link = function (href, title, text) {
    links.push({
      href: href,
      text: text || title, // Utiliza text o title como texto del enlace
      file: filePath,
    });
  };

  // Parsear el contenido Markdown utilizando parse
  marked.parse(markdownContent, { renderer: renderer });

  return links;
}

module.exports = {
  exiteRoute,
  absoluteRoute,
  isMarkdownFile,
  extractLinksFromMarkdown
};
