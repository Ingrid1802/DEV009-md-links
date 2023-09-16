const axios = require('axios');
const { mdLinks } = require('../index.js');
const fs = require('fs/promises');
const path = require('path');

jest.mock('axios');

describe('mdLinks', () => {
  // Restaurar el comportamiento original de fs.promises después de cada prueba
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debería rechazar la promesa si la ruta no existe', () => {
    const nonExistentPath = '/ruta/inexistente.md';
    return expect(mdLinks(nonExistentPath)).rejects.toEqual('La ruta no existe');
  });

  it('debería convertir una ruta relativa en una ruta absoluta', () => {
    const relativePath = './markdowns/prueba.md';
    const expectedAbsolutePath = path.resolve(relativePath);
    return mdLinks(relativePath).then((result) => {
      expect(result[0].file).toEqual(expectedAbsolutePath);
    });
  });

  it('debería detectar un archivo Markdown', () => {
    const markdownFilePath = './markdowns/prueba.md';
    return mdLinks(markdownFilePath).then((result) => {
      // Verificar que el resultado no sea igual a "No es Markdown"
      expect(result).not.toBe('No es Markdown');
    });
  });

  it('debería detectar que no es un archivo Markdown', () => {
    const nonMarkdownFilePath = './index.js';
    return mdLinks(nonMarkdownFilePath).then((result) => {
      // Verificar que el resultado sea igual a "No es Markdown"
      expect(result).toBe('No es Markdown');
    });
  });

  it('debería leer el archivo Markdown y extraer los enlaces', () => {
    const markdownFilePath = './markdowns/prueba.md';

    return mdLinks(markdownFilePath).then((result) => {
      // Verificar que el resultado sea un array de objetos de enlace
      expect(Array.isArray(result)).toBe(true);

      // Verificar que el resultado contenga al menos un objeto de enlace
      expect(result.length).toBeGreaterThan(0);

      // Verificar que los objetos de enlace tengan las propiedades esperadas (href, text, file)
      expect(result[0]).toHaveProperty('href');
      expect(result[0]).toHaveProperty('text');
      expect(result[0]).toHaveProperty('file');
    });
  });

  it('debería validar enlaces correctamente', () => {
    const markdownFilePath = './markdowns/prueba.md';

    // Configurar una respuesta falsa para Axios
    axios.head.mockResolvedValue({ status: 200 });

    return mdLinks(markdownFilePath, { validate: true }).then(result => {
      // Crear un arreglo de enlaces válidos esperados
      const expectedValidLinks = [
        {
          href: 'https://www.youtube.com/@auron/featured',
          text: 'aquí',
          file: path.resolve(markdownFilePath),
          status: 200,
          ok: 'ok',
        }
      ];
      // Verificar que todos los enlaces válidos esperados estén presentes en el resultado
      expectedValidLinks.forEach(expectedLink => {
        expect(result).toContainEqual(expectedLink);
      });
    });
  });
});
