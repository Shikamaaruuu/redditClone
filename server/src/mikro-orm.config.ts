import { Post } from "./entities/Post";
import { __prod__ } from "./constants";
import {MikroORM} from "@mikro-orm/core"
import path from "path"
import { User } from "./entities/User";

export default {
    migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },

    entities:[Post,User],
        dbName:'reddit',
        // clientUrl:"postgresql://postgres@127.0.0.1:5432",
        debug:!__prod__,
        type:"postgresql",
        // user:"postgres",
        // password:"020202"
} as Parameters<typeof MikroORM.init>[0]; // Parameters returns an array so grabbing first element 