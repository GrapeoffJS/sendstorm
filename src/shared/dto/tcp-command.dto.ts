/*
 * This file is part of the SendStorm project.
 *
 * File: tcp-command.dto.ts
 * Project: sendstorm
 * Author: Dmitriy Grape
 * Date: 28.11.2024
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

import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

import { Option } from '../decorators/option.decorator';

export class TcpCommandDto {
  @Option({
    flags: '-h, --host <host>',
    description: 'Host to connect to',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  host!: string;

  @Option({
    flags: '-p, --port <port>',
    description: 'Port number',
    required: true,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65_535)
  port!: number;

  @Option({
    flags: '-d, --data <data>',
    description: 'Data to send',
    required: true,
  })
  @IsString()
  data!: string;

  @Option({
    flags: '-e, --encoding <encoding>',
    description: 'Encoding of the data (default: utf8)',
    defaultValue: 'utf-8',
  })
  @IsOptional()
  @IsString()
  encoding?: BufferEncoding;

  @Option({ flags: '--edit', description: 'Open built-in JavaScript/JSON BuiltinEditor', defaultValue: false })
  @IsOptional()
  edit?: boolean;
}
