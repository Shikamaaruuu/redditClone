import { fetchExchange } from "urql"
import { LogoutMutation, MeQuery, MeDocument, LoginMutation, RegisterMutation } from "../generated/graphql"
import { betterUpdateQuery } from "./betterUpdateQuery"
import { cacheExchange } from "@urql/exchange-graphcache"


export const createURQLClient = (ssrExchange: any) => ({
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
        credentials: 'include' as const
    },
    exchanges: [cacheExchange({
        //Updating cache(meQuery) everytime login or register happens

        updates: {
            Mutation: {
                logout: (_result, args, cache, info) => {
                    // We can just return null from me query 
                    betterUpdateQuery<LogoutMutation, MeQuery>(
                        cache,
                        { query: MeDocument },
                        _result,
                        () => ({ me: null })
                    )
                },
                login: (_result, args, cache, info) => {
                    betterUpdateQuery<LoginMutation, MeQuery>(cache,
                        { query: MeDocument },
                        _result,
                        (result, query) => {
                            if (result.login.errors) {
                                return query
                            } else {
                                return {
                                    me: result.login.user
                                }
                            }
                        })
                },

                register: (_result, args, cache, info) => {
                    betterUpdateQuery<RegisterMutation, MeQuery>(cache,
                        { query: MeDocument },
                        _result,
                        (result, query) => {
                            if (result.register.errors) {
                                return query
                            } else {
                                return {
                                    me: result.register.user
                                }
                            }
                        })
                }
            }
        }
    }), ssrExchange,fetchExchange],
})