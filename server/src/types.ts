import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import {Request,Response} from "express"
import {Session, SessionData} from "express-session"

export type Mycontext = {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
    req: Request & { session?: Session & { userId?: number } } ;
    res: Response;
}