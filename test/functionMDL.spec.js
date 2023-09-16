const { exiteRoute, absoluteRoute, isMarkdownFile, validateLink, extractLinksFromMarkdown } = require('../functionMDL.js');
const fs = require('fs/promises');
const path = require('path');
const axios = require('axios');


describe('exiteRoute', () => {
  // Supongamos que tienes una carpeta de pruebas con un archivo 'archivoExistente.txt'
  const rutaExistente = './markdowns/prueba.md';
  const rutaNoExistente = './pruebas/archivoNoExistente.txt';

  it('debería devolver true si la ruta existe', () => {
    const resultado = exiteRoute(rutaExistente);
    expect(resultado).toBe(true);
  });

  it('debería devolver false si la ruta no existe', () => {
    const resultado = exiteRoute(rutaNoExistente);
    expect(resultado).toBe(false);
  });
});








describe('absoluteRoute', () => {
  it('Debería convertir una ruta relativa en absoluta', () => {
    const relativeRoute = './prueba.md'; // Ruta relativa
    const expectedAbsoluteRoute = path.resolve(relativeRoute);

    const result = absoluteRoute(relativeRoute);
    expect(result).toBe(expectedAbsoluteRoute);
  });

  it('Debería mantener una ruta absoluta sin cambios', () => {
    const routeAbsolute = 'C:\\Users\\Ingrid\\DEV009-md-links\\prueba.md'; // Ruta absoluta

    const result = absoluteRoute(routeAbsolute);
    expect(result).toBe(routeAbsolute);
  });
});







describe('isMarkdownFile', () => {
  it('Debería retornar true si la extensión es de un archivo Markdown', () => {
    const markdownExtensions = ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'];

    markdownExtensions.forEach((extension) => {
      const filePath = `archivo${extension}`; // Nombre de archivo con extensión Markdown (ajusta la extensión según tu lista de extensiones Markdown)

      const result = isMarkdownFile(filePath);
      expect(result).toBe(true);
    });
  });

  it('Debería retornar false si la extensión no es de un archivo Markdown', () => {
    const nonMarkdownExtensions = ['.html', '.txt', '.js', '.css']; // Extensiones que no son Markdown

    nonMarkdownExtensions.forEach((extension) => {
      const filePath = `archivo${extension}`; // Nombre de archivo con extensión que no es Markdown (ajusta la extensión según tu lista de extensiones no Markdown)

      const result = isMarkdownFile(filePath);
      expect(result).toBe(false);
    });
  });
});






// Mock de axios para simular una respuesta exitosa
jest.mock('axios');
axios.head.mockResolvedValue({ status: 200 });

describe('validateLink', () => {
  it('debería validar un enlace correctamente', () => {
    const markdownFilePath = './markdowns/prueba.md';

    const link = {
      href: 'https://www.youtube.com/@auron/featured',
      text: 'aquí',
      file: path.resolve(markdownFilePath),
    };

    return validateLink(link).then(result => {
      expect(result).toEqual({
        href: 'https://www.youtube.com/@auron/featured',
        text: 'aquí',
        file: path.resolve(markdownFilePath),
        status: 200,
        ok: 'ok',
      });
    });
  });

  it('debería manejar un enlace inválido', () => {
    const markdownFilePath = './markdowns/prueba.md';

    const link = {
      href: 'https:no.existo.com',
      text: 'aca',
      file: path.resolve(markdownFilePath),
    };

    axios.head.mockRejectedValue({ response: { status: 404 } });

    return validateLink(link).then(result => {
      expect(result).toEqual({
        href: 'https:no.existo.com',
        text: 'aca',
        file: path.resolve(markdownFilePath),
        status: 404,
        ok: 'fail',
      });
    });
  });
});

describe('extractLinksFromMarkdown', () => {
  it('debería extraer enlaces de un contenido Markdown sin validar', () => {
    const markdownContent = 'Canal de YouTube de un stremer que recomiendo [aquí](https://www.youtube.com/@auron/featured)';
    const filePath = './markdowns/prueba.md';

    return extractLinksFromMarkdown(markdownContent, filePath, false).then(result => {
      expect(result).toEqual([
        {
          href: 'https://www.youtube.com/@auron/featured',
          text: 'aquí',
          file: './markdowns/prueba.md',
        },
      ]);
    });
  });


  it('debería extraer enlaces de un contenido Markdown y validarlos', () => {
    const markdownContent = 'Canal de YouTube de un stremer que recomiendo [aquí](https://www.youtube.com/@auron/featured)';
    const filePath = './markdowns/prueba.md';

    return extractLinksFromMarkdown(markdownContent, filePath, true).then(result => {
      const expectedLink = {
        href: 'https://www.youtube.com/@auron/featured',
        text: 'aquí',
        file: './markdowns/prueba.md',
        status: 404,
        ok: 'fail',
      };

      // Comprueba si el resultado contiene el enlace esperado
      expect(result).toContainEqual(expectedLink);
    });
  });

});






