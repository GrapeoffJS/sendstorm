/*
 * This file is part of the SendStorm project.
 *
 * File: spinner.ts
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

import ora, { Ora } from 'ora';

export class Spinner {
  private static spinner: Ora | null = null;

  static start(text: string) {
    if (!this.spinner) {
      this.spinner = ora(text).start();
    }
  }

  static stop() {
    if (this.spinner) {
      this.spinner.stop();
      this.spinner = null;
    }
  }

  static succeed(text: string) {
    if (this.spinner) {
      this.spinner.succeed(text);
      this.spinner = null;
    }
  }

  static fail(text: string) {
    if (this.spinner) {
      this.spinner.fail(text);
      this.spinner = null;
    }
  }
}
