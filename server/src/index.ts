import { MikroORM } from "@mikro-orm/core"
import { COOKIE_NAME, __prod__ } from "./constants";
import { Post } from "./entities/Post"
import mikroConfig from "./mikro-orm.config"
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from "./resolvers/Hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/User"
import connectRedis from "connect-redis"
import session from "express-session"
import redis, { createClient } from "redis" 
import RedisStore from "connect-redis";
import cors from 'cors'
import { sendEmail } from "./utils/sendEmail";



  

const main = async () => {
    // sendEmail('anuragreddy0202@gmail.com','hello mf')
    const orm = await MikroORM.init(mikroConfig);
    const emFork = orm.em.fork(); // <-- create the fork
    await orm.getMigrator().up() 
 
    const app = express(); //creating server

    let redisClient = createClient()
    redisClient.connect().catch(console.error)

    // Initialize store.
    let redisStore = new (RedisStore as any)({ 
        client: redisClient,
        prefix: "myapp:",
    })
    app.use(
        cors({
            origin: ["http://localhost:3000","https://studio.apollographql.com"],
            // default: "https://studio.apollographql.com",
            credentials:true
        })
    )
    app.set("trust proxy", true);
    // app.set("Access-Control-Allow-Origin", "https://studio.apollographql.com");
    // app.set("Access-Control-Allow-Origin", "http://localhost:3000");
    app.set("Access-Control-Allow-Credentials", true);
    // Initialize sesssion storage.
    app.use(
        session({
            name: COOKIE_NAME,
            store: redisStore,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10years
                httpOnly: false,
                sameSite: "lax",
                secure: false // cookies only work in https 
            },
            resave: false, // required: force lightweight session keep alive (touch)
            saveUninitialized: false, // recommended: only save session when data exists
            secret: "jehfwjhfwnflnqlk",
        }) // We are running redis middleware before apollo middleware as we will be using redis inside of apollo
    ) 


    
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({ em: emFork, req, res })  // -> Special object accessible by resolvers, here the function return a orm object for context  
    })
    await apolloServer.start();

    
 
    apolloServer.applyMiddleware({
        app,
        cors: false,
    }) // will create a graphQL entry point for us on express server


    app.listen(4000, () => {
        console.log("Server started and listening at port 4000")
    });

    

}
console.log("Hello world")


main()
