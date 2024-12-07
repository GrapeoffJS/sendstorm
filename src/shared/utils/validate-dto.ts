/*
 * This file is part of the SendStorm project.
 *
 * File: validate-dto.ts
 * Project: sendstorm
 * Author: Dmitriy Grape
 * Date: 30.11.2024
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
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export async function validateDto(dtoClass: new () => any, options: any): Promise<any> {
  const dto = plainToInstance(dtoClass, options);
  const errors = await validate(dto);

  if (errors.length > 0) {
    console.log(chalk.redBright('Validation failed. Errors:'));

    for (const error of errors) {
      const property = error.property;
      const constraints = Object.values(error.constraints || {});

      for (const constraint of constraints) {
        console.log(`${chalk.bold(property)}: ${constraint}`);
      }
    }

    process.exit(1);
  }

  return dto;
}
