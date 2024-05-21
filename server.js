import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import express from "express";
import typeDefs from "./typeDefs.js";
import mongoose from "mongoose";
import 'dotenv/config';
import jwt from "jsonwebtoken";

mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on("connected", () => {
    console.log("connected to mongodb");
});

mongoose.connection.on("error", (err) => {
    console.log("error connecting", err);
});

import "./models/User.js";
import "./models/Quote.js";
import "./models/Blog.js";
import resolvers from "./resolver.js";

const app = express();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const { authorization } = req.headers;
        if (authorization) {
            const { userId } = jwt.verify(authorization, process.env.JWT_SECRET);
            return { userId };
        }
    },
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

await server.start();
server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 4000 }, () => {
    console.log(`Server ready at http://localhost:4000/graphql`);
});
