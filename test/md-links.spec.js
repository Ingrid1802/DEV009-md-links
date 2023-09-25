const marked = require('marked');
const axios = require('axios');
const { mdLinks } = require('../index.js');
const fs = require('fs/promises');
const path = require('path');

jest.mock('axios');

describe('mdLinks', () => {

  it('debería rechazar la promesa si la ruta no existe', () => {
    const nonExistentPath = '/ruta/inexistente.md';
    return expect(mdLinks(nonExistentPath)).rejects.toEqual('La ruta o directorio no existe');
  });

  it('Debería devolver una lista de enlaces', () => {
    return mdLinks('./markdowns/markdownd2', false).then(links => {
      expect(links).toHaveLength(3);
    });
  });

  it('debe retornar una lista vacía si no hay enlaces', async () => {
    const directorioDePrueba = './markdowns3';
    const validate = false;

    const links = await mdLinks(directorioDePrueba, validate);

    // Verifica que links sea un array vacío
    expect(Array.isArray(links)).toBeTruthy();
    expect(links.length).toBe(0);
  });

  it('debería procesar un directorio y extraer enlaces de archivos Markdown', () => {
    // Define una ruta válida a un archivo Markdown de prueba
    const filePath = './markdowns';

    // Llama a la función mdLinks con la ruta del archivo y validate como false
    return mdLinks(filePath, false).then(links => {
      // Verifica que links sea un array de objetos con la estructura adecuada
      expect(Array.isArray(links)).toBeTruthy();
      expect(links).toHaveLength(8);
    });
  });

  it('debería devolver estado "ok" para enlaces válidos', () => {
    // Simula una respuesta exitosa para un enlace válido
    axios.head.mockResolvedValue({ status: 200 });

    return mdLinks('./markdowns/markdownd2', true).then(links => {
      expect(links).toHaveLength(3);

      // Verifica que los enlaces válidos tengan el estado "ok"
      expect(links[0].ok).toEqual('ok');
      expect(links[1].ok).toEqual('ok');
      expect(links[2].ok).toEqual('ok');
    });
  });

  it('debería devolver estado "fail" para enlaces rotos', () => {
    // Simula una respuesta con error 404 para un enlace roto
    axios.head.mockRejectedValue({ response: { status: 404 } });

    return mdLinks('./markdowns/markdownd2', true).then(links => {
      expect(links).toHaveLength(3);

      // Verifica que los enlaces rotos tengan el estado "fail"
      expect(links[0].ok).toEqual('fail');
      expect(links[1].ok).toEqual('fail');
      expect(links[2].ok).toEqual('fail');
    });
  });
});
