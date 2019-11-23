#! /usr/bin/env node
/* eslint-disable no-console */

var color = require('bash-color');

console.log(color.red('您需要安装 “gbook-cli” 才能在系统的任何地方访问 gbook 命令'));
console.log(color.red('如果已全局安装此包，则需要卸载它。'));
console.log(color.red('>> 运行 “npm uninstall -g gbook”, 然后运行 “npm install-g gbook-cli”'));
