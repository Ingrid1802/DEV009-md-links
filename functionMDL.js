const marked = require('marked');
const fs = require('fs');
const path = require("path");
const axios = require('axios');

function exiteRoute(route) {
  if (fs.existsSync(route)) {
    return true;
  } else {
    return false;
  }
}

function absoluteRoute(route) {
  if (!path.isAbsolute(route)) {
    return path.resolve(route);
  } else {
    return route;
  }
}

function isMarkdownFile(route) {
  const markdownExtensions = ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'];
  const fileExtension = path.extname(route);
  return markdownExtensions.includes(fileExtension);
}

function validateLink(link) {
  return axios.head(link.href)
    .then(response => {
      link.status = response.status;
      link.ok = response.status >= 200 && response.status < 400 ? 'ok' : 'fail';
      return link;
    })
    .catch(error => {
      link.status = 404;
      link.ok = 'fail';
      return link;
    });
}

function extractLinksFromMarkdown(markdownContent, filePath, validate) {
  const links = [];

  const renderer = new marked.Renderer();
  renderer.link = function (href, title, text) {
    const link = {
      href: href,
      text: text || title,
      file: filePath,
    };

    if (validate) {
      links.push(validateLink(link));
    } else {
      links.push(link);
    }
  };

  marked.parse(markdownContent, { renderer: renderer });

  return Promise.all(links);
}

module.exports = {
  exiteRoute,
  absoluteRoute,
  isMarkdownFile,
  extractLinksFromMarkdown,
  validateLink
};
