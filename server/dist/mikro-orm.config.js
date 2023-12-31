"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = require("./entities/Post");
const constants_1 = require("./constants");
const User_1 = require("./entities/User");
exports.default = {
    migrations: {
        path: 'dist/migrations',
        pathTs: 'src/migrations',
    },
    entities: [Post_1.Post, User_1.User],
    dbName: 'reddit',
    debug: !constants_1.__prod__,
    type: "postgresql",
};
//# sourceMappingURL=mikro-orm.config.js.map