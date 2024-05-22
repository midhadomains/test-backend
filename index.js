import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import express from "express";
import typeDefs from "./typeDefs.js";
import mongoose from "mongoose";
import 'dotenv/config';
import jwt from "jsonwebtoken";

const port = parseInt(process.env.PORT) || 4000;

mongoose.connect(process.env.MONGO_URI);
//{ useNewUrlParser: true, useUnifiedTopology: true }
mongoose.connection.on("connected", () => {
    console.log("connected to mongodb");
});

mongoose.connection.on("error", (err) => {
    console.error("error connecting", err);
});

import "./models/User.js";
import "./models/Quote.js";
import "./models/Blog.js";

import resolvers from "./resolver.js";

const startServer = async () => {
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
    server.applyMiddleware({ app, path: '/' });

    app.listen({ port }, () => {
        console.log(`Server ready at http://localhost:${port}`);
    });
};

startServer().catch(err => {
    console.error("Failed to start server", err);
});
