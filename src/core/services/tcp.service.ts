/*
 * This file is part of the SendStorm project.
 *
 * File: tcp.service.ts
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

import { Logger } from '@cli/utils/logger';
import { Spinner } from '@cli/utils/spinner';
import { TcpClient } from '@core/clients/tcp-client';
import { TransportProtocolFactory } from '@core/transport/transport-protocol.factory';
import { TcpCommandDto } from '@shared/dto/tcp-command.dto';
import { highlight } from 'cli-highlight';

export class TcpService {
  private _tcpClient: TcpClient | null = null;

  async sendRequest(dto: TcpCommandDto): Promise<void> {
    const protocol = TransportProtocolFactory.create(dto.transport);
    this._tcpClient = new TcpClient();

    this._tcpClient.onData = (data: Buffer): void => {
      Spinner.stop();

      try {
        const responseObj = protocol.deserialize(data);
        Logger.success('Received response object:');

        console.log(highlight(JSON.stringify(responseObj, null, 2)));
      } catch {
        Logger.warn('Failed to deserialize response using specified protocol');
      }

      this._tcpClient!.disconnect();
    };

    this._tcpClient.onError = (error: Error): void => {
      Spinner.fail('Error occurred');
      Logger.error(error.message);
    };

    try {
      this._tcpClient.connect({ host: dto.host, port: dto.port });
      const serialized = protocol.serialize(dto.data);

      await this._tcpClient.send(serialized);

      Spinner.start('Waiting for response...');
    } catch (error: any) {
      Spinner.fail('Failed to send request');
      Logger.error(error.message);
    }
  }
}
