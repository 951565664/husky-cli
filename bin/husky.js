#!/usr/bin/env node
'use strict';

const chalk = require('chalk');
const program = require('commander');
const spawn = require('win-spawn');
const join = require('path').join;
const resolve = require('path').resolve;
const exists = require('fs').existsSync;
const readFileSync = require('fs').readFileSync;

// Notify update when process exits
const updater = require('update-notifier');
const pkg = require('../package.json');
updater({ pkg: pkg }).notify({ defer: true });

if (process.argv.slice(2).join('') === '-v') {
  const pkg = require('../package');
  console.log('husky-cli version ' + pkg.version);
  try {
    const cwd = process.cwd();
    const huskyPkg = resolve('node_modules/husky/package.json');
    const huskyVersion = JSON.parse(readFileSync(huskyPkg, 'utf-8')).version;
    console.log('    husky version ' + huskyVersion);
    const roadhogPkg = resolve('node_modules/roadhog/package.json');
    const roadhogVersion = JSON.parse(readFileSync(roadhogPkg, 'utf-8')).version;
    console.log('roadhog version ' + roadhogVersion);
  } catch (e) {
  }
  if (!(pkg._from && pkg._resolved)) {
    console.log(chalk.cyan('@local'));
  }
  return;
}

program
  .usage('<command> [options]')
  .on('--help', printHelp)
  .parse(process.argv);


const args = process.argv.slice(3);
let subcmd = program.args[0];


if (!subcmd) {
  program.help();
} else {
  const bin = executable(subcmd);
  if (bin) {
    console.log(bin);
    wrap(spawn(bin, args, { stdio: 'inherit', customFds: [0, 1, 2] }));
  } else {
    program.help();
  }
}

function wrap(sp) {
  sp.on('close', function (code) {
    process.exit(code);
  });
}

function printHelp() {
  console.log('  Commands:');
  console.log();
  console.log('    init           Init a new husky application in the current folder');
  console.log('    new            Creates a new application');
  console.log();
  console.log('  All commands can be run with -h (or --help) for more information.')
}

function executable(subcmd) {
  var file = join(__dirname, 'husky-' + subcmd);
  if (exists(file)) {
    return file;
  }
}
