import * as fs from 'fs';
import * as path from 'path';
import IUserConfig from '../interface/i-user-config';
import IUserOptions from '../interface/i-user-options';

const CONTENT = Symbol('content');

export default class UserConfigLoader {
  public options: IUserOptions;

  /**
   * @constructor
   */

  constructor(options: IUserOptions) {
    this.options = options;
  }

  /**
   * @since 0.1.0
   */

  get config(): IUserConfig {
    if (this[CONTENT]) { return this[CONTENT]; }

    const filename = path.join(this.options.rootDir, 'config.js');

    if (!fs.statSync(filename)) {
      throw new Error('Not found config.js in project root directory!');
    }

    this[CONTENT] = require(filename);
    return this[CONTENT];
  }
}
