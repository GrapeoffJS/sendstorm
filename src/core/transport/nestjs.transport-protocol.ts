/*
 * This file is part of the SendStorm project.
 *
 * File: nestjs.transport-protocol.ts
 * Project: sendstorm
 * Author: Dmitriy Grape
 * Date: 07.12.2024
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

import { TransportProtocol } from './transport-protocol.interface';

export class NestJsTransportProtocol implements TransportProtocol {
  serialize(message: Record<string, any> | string): Buffer | string {
    const parsed = typeof message === 'string' ? JSON.parse(message) : message;

    if (!parsed.pattern) {
      throw new Error('Missing pattern');
    }

    if (!parsed.id) {
      parsed.id = `auto_id_${Date.now()}`;
    }

    const jsonStr = JSON.stringify(parsed);
    const length = Buffer.byteLength(jsonStr, 'utf8');

    return `${length}#${jsonStr}`;
  }

  deserialize(data: Buffer | string): Record<string, any> | string {
    const strData = Buffer.isBuffer(data) ? data.toString('utf8') : data;

    const delimiterIndex = strData.indexOf('#');
    if (delimiterIndex === -1) {
      throw new Error('Invalid message format: Missing delimiter');
    }

    const jsonPart = strData.slice(delimiterIndex + 1);
    return JSON.parse(jsonPart);
  }
}
