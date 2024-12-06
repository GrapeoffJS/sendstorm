/*
 * This file is part of the SendStorm project.
 *
 * File: transport-protocol.factory.ts
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

import { DefaultTransportProtocol } from '@core/transport/default.transport-protocol';
import { JsonTransportProtocol } from '@core/transport/json.transport-protocol';
import { NestJsTransportProtocol } from '@core/transport/nestjs.transport-protocol';
import { TransportProtocol } from '@core/transport/transport-protocol.interface';

export class TransportProtocolFactory {
  static create(protocolName: string): TransportProtocol {
    switch (protocolName.toLowerCase()) {
      case 'json': {
        return new JsonTransportProtocol();
      }
      case 'nestjs': {
        return new NestJsTransportProtocol();
      }
      case 'default': {
        return new DefaultTransportProtocol();
      }
      default: {
        throw new Error(`Unsupported transport protocol: ${protocolName}`);
      }
    }
  }
}
