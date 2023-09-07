const { exiteRoute, absoluteRoute, isMarkdownFile, extractLinksFromMarkdown } = require('../functionMDL.js');
const { mdLinks } = require('../index.js');
const fs = require('fs/promises');
const path = require('path');

// Creamos el mock

jest.mock('fs/promises');

describe('mdLinks', () => {
  // Restaurar el comportamiento original de fs.promises después de cada prueba
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Debe rechazar el path cuando no existe', () => {
    return mdLinks('archivo.md').catch((error) => {
      expect(error).toBe('La ruta no existe')
    })
  });

  it('Debería mostrar un error si la ruta no existe', () => {
    return mdLinks('ruta_invalida.md').catch((error) => {
      expect(error).toBe('La ruta no existe');
    });
  });

  it('Debería mostrar un error si es que no es un archivo Markdown', () => {
    return mdLinks('./index.js').catch((error) => {
      expect(error).toBe('no es Markdown');
    });
  });

  it('debería devolver los enlaces encontrados dentro del archivo Markdown', async () => {
    const fileContents = 'Archivo [Markdown](https://markdown.com) y [Otro enlace](https://otro.com)';
    const filePath = './prueba.md'; // Reemplaza con la ruta correcta a tu archivo

    // Simulamos que la ruta existe
    fs.access.mockResolvedValue();

    // Simulamos la lectura del archivo
    fs.readFile.mockResolvedValue(fileContents);

    const result = await mdLinks(filePath);

    expect(result).toEqual([
      {
        href: 'https://markdown.com',
        text: 'Markdown',
        file: path.resolve(filePath),
      },
      {
        href: 'https://otro.com',
        text: 'Otro enlace',
        file: path.resolve(filePath),
      },
    ]);
  });
});







describe('exiteRoute', () => {
  it('Debería retornar true si la ruta existe', () => {
    const mockRoute = 'README.md'; // Ruta de archivo existente
    fs.existsSync = jest.fn().mockReturnValue(true);
    const result = exiteRoute(mockRoute);
    expect(result).toBe(true);
  });

  it('Debería retornar false si la ruta no existe', () => {
    const mockRoute = 'ruta_no_existente.txt'; // Ruta de archivo que no existe
    fs.existsSync = jest.fn().mockReturnValue(false);
    const result = exiteRoute(mockRoute);
    expect(result).toBe(false);
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







describe('extractLinksFromMarkdown', () => {
  it('Debería extraer los enlaces de un archivo Markdown', () => {
    const markdownContent = '[Enlace 1](https://link1.com) y [Enlace 2](https://link2.com)';
    const filePath = 'archivo.md'; // Nombre de archivo con extensión Markdown

    const result = extractLinksFromMarkdown(markdownContent, filePath);

    expect(result).toEqual([
      {
        href: 'https://link1.com',
        text: 'Enlace 1',
        file: filePath,
      },
      {
        href: 'https://link2.com',
        text: 'Enlace 2',
        file: filePath,
      },
    ]);
  });
});


// Aquí puedes agregar más pruebas según sea necesario

// const { mdLinks } = require('../index.js');

// describe('mdLinks', () => {

//   it('should...', () => {
//     console.log('FIX ME!');
//   });

//   it('Debe rechazar el path cuando no existe', () => {
//     return mdLinks('archivo.md').catch((error) => {
//       expect(error).toBe('La ruta no existe')
//     })
//   });
// });
