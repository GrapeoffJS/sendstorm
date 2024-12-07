/*
 * This file is part of the SendStorm project.
 *
 * File: tcp-client.ts
 * Project: sendstorm
 * Author: Dmitriy Grape
 * Date: 27.11.2024
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

import net from 'node:net';

import { AbstractTransport } from '@core/clients/abstract-transport.interface';

export class TcpClient implements AbstractTransport {
  private _client?: net.Socket;

  private _onData?: (data: Buffer<ArrayBufferLike>) => void;
  private _onError?: (error: Error) => void;

  connect(options: net.TcpNetConnectOpts): void {
    this._client = net.createConnection(options);

    this._client.on('data', data => this._onData?.(data));
    this._client.on('error', error => this._onError?.(error));
    this._client.on('close', () => {
      console.log('TCP connection closed');
      process.exit(0);
    });
  }

  async send(data: any): Promise<void> {
    if (!this._client || this._client.destroyed) {
      throw new Error('TCP client is not connected');
    }

    return new Promise((resolve, reject) => {
      this._client!.write(data, error => {
        if (error) return reject(error);
        resolve();
      });
    });
  }

  disconnect(): void {
    if (this._client && !this._client.destroyed) {
      this._client.destroy();
    }
  }

  set onData(handler: (data: Buffer<ArrayBufferLike>) => void) {
    this._onData = handler;
  }

  set onError(handler: (error: Error) => void) {
    this._onError = handler;
  }
}
