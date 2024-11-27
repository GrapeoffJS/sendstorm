/*
 * This file is part of the SendStorm project.
 *
 * File: index.ts
 * Project: sendstorm
 * Author: grapeoff
 * Date: 26.11.2024
 *
 * Copyright (C) 2024 Dmitriy Grape
 *
 * Licensed under the GNU General Public License, Version 3.
 * See LICENSE in the project root for license information.
 *
 * SendStorm is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * SendStorm is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with SendStorm. If not, see <https://www.gnu.org/licenses/>.
 */

import chalk from 'chalk';
import { program } from 'commander';

program
  .name('sendstorm')
  .description(chalk.bold(chalk.yellowBright('A versatile CLI tool for testing microservices over multiple protocols')))
  .version(chalk.yellowBright(__VERSION__)); // Not an error, will be substituted properly to an actual package version by ESBuild

program.parse(process.argv);
