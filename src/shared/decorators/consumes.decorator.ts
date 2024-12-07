/*
 * This file is part of the SendStorm project.
 *
 * File: consumes.decorator.ts
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

import 'reflect-metadata';

export function Consumes(dtoClass: new () => any): ClassDecorator {
  return target => {
    Reflect.defineMetadata('dto', dtoClass, target);
  };
}
