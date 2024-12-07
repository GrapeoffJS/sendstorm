/*
 * This file is part of the SendStorm project.
 *
 * File: cli-application.ts
 * Project: sendstorm
 * Author: Dmitriy Grape
 * Date: 29.11.2024
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

import { Logger } from '@cli/utils/logger';
import { addOptionsFromDto } from '@shared/utils/add-options-from-dto';
import { validateDto } from '@shared/utils/validate-dto';
import chalk from 'chalk';
import { Command } from 'commander';

import { CommandHandler } from './command-handler';

export class CliApplication {
  private readonly _program: Command;

  constructor(private readonly commandHandlers: CommandHandler[]) {
    this._program = new Command();
  }

  /**
   * Initializes the CLI application with configuration and registered commands.
   */
  initialize(): void {
    this.configureProgram();
    this.registerCommands();
  }

  /**
   * Configures global settings for the CLI program.
   */
  private configureProgram(): void {
    this._program
      .name('sendstorm')
      .description(
        chalk.bold(chalk.yellowBright('A versatile CLI tool for testing microservices over multiple protocols')),
      )
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      .version(chalk.yellowBright(__VERSION__)); // __VERSION__ will be replaced by ESBuild
  }

  /**
   * Registers all command handlers in the CLI application.
   */
  private registerCommands(): void {
    for (const handler of this.commandHandlers) {
      const command = handler.build();
      const dtoClass = Reflect.getMetadata('dto', handler.constructor);

      if (!dtoClass) {
        throw new Error(`DTO class not specified for command '${command.name()}'`);
      }

      addOptionsFromDto(command, dtoClass);

      command.action(async options => {
        try {
          const args = await validateDto(dtoClass, options);
          await handler.execute(args);
        } catch (error) {
          Logger.error(`Faild to execute command '${command.name()}, ensure you passed write credentials.'`);
          Logger.warn(`Runtime Error: ${(error as Error).message}`);
        }
      });

      this._program.addCommand(command);
    }
  }

  /**
   * Runs the CLI program by parsing the command-line arguments.
   */
  public run(): void {
    this._program.parse(process.argv);
  }
}
