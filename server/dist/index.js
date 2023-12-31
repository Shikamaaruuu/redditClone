"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const constants_1 = require("./constants");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const Hello_1 = require("./resolvers/Hello");
const post_1 = require("./resolvers/post");
const User_1 = require("./resolvers/User");
const express_session_1 = __importDefault(require("express-session"));
const redis_1 = require("redis");
const connect_redis_1 = __importDefault(require("connect-redis"));
const cors_1 = __importDefault(require("cors"));
const main = async () => {
    const orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
    const emFork = orm.em.fork();
    await orm.getMigrator().up();
    const app = express_1.default();
    let redisClient = redis_1.createClient();
    redisClient.connect().catch(console.error);
    let redisStore = new connect_redis_1.default({
        client: redisClient,
        prefix: "myapp:",
    });
    app.use(cors_1.default({
        origin: ["http://localhost:3000", "https://studio.apollographql.com"],
        credentials: true
    }));
    app.set("trust proxy", true);
    app.set("Access-Control-Allow-Credentials", true);
    app.use(express_session_1.default({
        name: constants_1.COOKIE_NAME,
        store: redisStore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            httpOnly: false,
            sameSite: "lax",
            secure: false
        },
        resave: false,
        saveUninitialized: false,
        secret: "jehfwjhfwnflnqlk",
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await type_graphql_1.buildSchema({
            resolvers: [Hello_1.HelloResolver, post_1.PostResolver, User_1.UserResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({ em: emFork, req, res })
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: false,
    });
    app.listen(4000, () => {
        console.log("Server started and listening at port 4000");
    });
};
console.log("Hello world");
main();
//# sourceMappingURL=index.js.map