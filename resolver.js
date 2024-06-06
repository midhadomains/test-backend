import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config';

const User = mongoose.model("User");
const Quote = mongoose.model("Quote");
const Blog = mongoose.model("Blog");

const resolvers = {
    Query: {
        users: async () => await User.find({}),
        user: async (_, { _id }) => await User.findOne({ _id }),
        quotes: async () => await Quote.find({}).populate("by", "_id firstName"),
        iquote: async (_, { by }) => await Quote.find({ by }),
        blogs: async (parent, args, context, info) => {
            const { first, after, category } = args;
            let query = {};
            if (after) {
                query._id = { $gt: after }; // Assuming _id is used for pagination
            }
            if (category) {
                query.category = category;
            }
            //const blogs = await Blog.find(query).limit(first + 1); // Fetch one more than requested
            const blogs = await Blog.find(query).sort({ createdAt: -1 }).limit(first + 1); // Fetch one more than requested, sorted by createdAt

            const hasNextPage = blogs.length > first;
            const edges = hasNextPage ? blogs.slice(0, -1) : blogs; // If there's a next page, exclude the extra document

            const endCursor = edges.length > 0 ? edges[edges.length - 1]._id : null;

            return {
                edges: edges.map(blog => ({
                    cursor: blog._id, // Assuming _id is the unique identifier for blogs
                    node:{
                        ...blog.toObject(),
                        createdAt: blog.createdAt.toISOString(),
                    }
                })),
                pageInfo: {
                    endCursor,
                    hasNextPage
                },
            };
        },
        searchBlogs: async (_, { keyword }) => {
            return await Blog.find({ title: { $regex: keyword, $options: "i" } });
        },
        searchBlogById: async (_, { _id, slug }) => {
            return await Blog.findOne({ _id, slug });
        },
        searchBlogBySlug: async (_, { slug }) => {
            return await Blog.findOne({ slug });
        }
    },
    User: {
        quotes: async (ur) => await Quote.find({ by: ur._id })
    },
    Mutation: {
        signupUser: async (_, { userNew }) => {
            const user = await User.findOne({ email: userNew.email });
            if (user) {
                throw new Error("User already exists with that email");
            }
            const hashedPassword = await bcrypt.hash(userNew.password, 8);
            const newUser = new User({
                ...userNew,
                password: hashedPassword
            });
            return await newUser.save();
        },
        signinUser: async (_, { userSignin }) => {
            const user = await User.findOne({ email: userSignin.email });
            if (!user) {
                throw new Error("User is not Registered");
            }
            const doMatch = await bcrypt.compare(userSignin.password, user.password);
            if (!doMatch) {
                throw new Error("Wrong Password");
            }
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
            return { token };
        },
        createQuote: async (_, { name }, { userId }) => {
            if (!userId) throw new Error("You must be logged in");
            const newQuote = new Quote({
                name,
                by: userId
            });
            await newQuote.save();
            return "Quote saved successfully";
        },
        createBlog: async (_, args, { userId }) => {
            const abc = args.blogNew;
            if (!userId) throw new Error("You must be logged in");
            const newBlog = new Blog({
                ...abc
            });
            await newBlog.save();
            return "Blog created Successfully";
        }
    }
};

export default resolvers;
