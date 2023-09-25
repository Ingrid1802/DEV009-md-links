#!/usr/bin/env node

const figlet = require('figlet');
const chalk = require('chalk');
const yargs = require('yargs');
const cliBoxes = require('cli-boxes');
const { mdLinks } = require('./index.js');

// Título de la CLI
figlet('MD - LINKS!!!', function (err, data) {
  if (err) {
    console.log('Something went wrong...');
    console.dir(err);
    return;
  }

  const figuraConColor = chalk.magenta(data);
  console.log(figuraConColor);
});
// Configuración de yargs
yargs
  .command('$0 [ruta]', 'Encuentra y muestra los enlaces en archivos Markdown', (yargs) => {
    yargs.positional('ruta', {
      describe: 'Ruta al directorio o archivo Markdown',
      type: 'string',
      default: './markdowns', // Valor predeterminado si no se proporciona la ruta
    });
  })
  .option('validate', {
    alias: 'v',
    describe: 'Validar los enlaces',
    type: 'boolean',
  })
  .option('stats', {
    describe: 'Mostrar estadísticas de los enlaces',
    type: 'boolean',
  })
  .help().argv;

const { ruta, validate, stats } = yargs.argv;

// Función para mostrar enlaces en un formato específico
const mostrarEnlaces = (links) => {
  return links.map((link) => {
    let output;

    output = `${chalk.hex('#00FFF0').bold('href:')} ${chalk.hex('#B499D3').italic(link.href)} \n`;
    output += `${chalk.hex('#00FFF0').bold('Text:')} ${chalk.hex('#FEAEE2').italic(link.text)} \n`;
    output += `${chalk.hex('#00FFF0').bold('File:')} ${chalk.hex('#FEFE9F ').italic(link.file)}\n`;
    if (validate) {
      output += ` ${chalk.hex('#00FFF0').bold('Status:')} ${chalk.hex('#7A89E8').bold(link.status)} \n`;
      output += ` ${chalk.hex('#00FFF0').bold('Ok:')} ${chalk.hex('#F78393 ').bold(link.ok)}\n`;
    }
    return output;
  });
};

const optionValidate = () => {
  mdLinks(ruta, { validate })
    .then((links) => {
      const formattedLinks = mostrarEnlaces(links);
      formattedLinks.forEach((formattedLink) => console.log(formattedLink));
    })
    .catch((error) => {
      console.error(error.message);
    });
};

// Función para mostrar estadísticas de enlaces
const mostrarEstadisticas = () => {
  mdLinks(ruta, { validate: true })
    .then((links) => {
      const totalLinks = links.length;
      const uniqueLinks = new Set(links.map((link) => link.href)).size;

      console.log(`${chalk.hex('#73D3CF')('Total:')} ${chalk.hex('#73D3CF')(totalLinks)}`);
      console.log(`${chalk.hex('#83F791')('Unique:')} ${chalk.hex('#83F791')(uniqueLinks)}`);
    })
    .catch((error) => {
      console.error(error.message);
    });
};

const validateANDstats = () => {
  mdLinks(ruta, { validate: true })
    .then((links) => {
      const totalLinks = links.length;
      const uniqueLinks = new Set(links.map((link) => link.href)).size;
      const brokenLinks = links.filter((link) => link.ok === 'fail').length;

      console.log(`${chalk.hex('#73D3CF')('Total:')} ${chalk.hex('#73D3CF')(totalLinks)}`);
      console.log(`${chalk.hex('#83F791')('Unique:')} ${chalk.hex('#83F791')(uniqueLinks)}`);
      console.log(`${chalk.hex('#E38481')('Broken:')} ${chalk.hex('#E38481')(brokenLinks)}`);
    })
    .catch((error) => {
      console.error(error.message);
    });
};

// Lógica para combinar --validate y --stats
if (validate && stats) {
  validateANDstats();
} else if (validate) {
  optionValidate();
} else if (stats) {
  mostrarEstadisticas();
} else {
  // Si no se especifica ninguna opción, muestra los enlaces sin validación ni estadísticas
  mdLinks(ruta, { validate: false })
    .then((links) => {
      const formattedLinks = mostrarEnlaces(links);
      formattedLinks.forEach((formattedLink) => console.log(formattedLink));
    })
    .catch((error) => {
      console.error(error.message);
    });
}
