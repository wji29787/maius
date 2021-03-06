"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const util_1 = require("util");
const file_item_model_1 = require("../models/loader/file-item-model");
const index_1 = require("../utils/index");
class BaseLoader {
    constructor(options) {
        assert(options.path, 'options.path cannot be ignored');
        this.path = options.path;
    }
    getIntancesCol() {
        const col = {};
        this.getFiles().forEach(item => {
            const UserClass = require(item.path);
            if (util_1.isFunction(UserClass)) {
                col[item.name] = new UserClass();
            }
            else if (index_1.isObject(UserClass)) {
                col[item.name] = UserClass;
            }
            else {
                throw new Error(`${item.name}.js is not a class function`);
            }
        });
        return col;
    }
    getFiles() {
        const dir = this.path;
        let list = null;
        try {
            list = fs.readdirSync(dir);
        }
        catch (error) {
            throw new Error(`Cannot find ${dir} directory.`);
        }
        const files = list
            .filter(item => /.*?\.js$/.test(item))
            .map(item => {
            const fileItem = new file_item_model_1.default();
            fileItem.name = /(.*?)\.js$/.exec(item)[1];
            fileItem.path = path.join(dir, item);
            return fileItem;
        });
        return files;
    }
}
exports.default = BaseLoader;
