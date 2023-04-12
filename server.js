import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register } from './src/Controllers/auth.js';
import authRoute from './src/routes/auth.js';
import userRoute from './src/routes/users.js';
import postsRoute from './src/routes/posts.js';
import { verifyToken } from './src/middleware/auth.js';
import { createPost } from './src/Controllers/posts.js';


//configuration
const __filename = fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );
const app = express();
dotenv.config();
app.use( express.json() );
app.use( helmet() );
app.use( helmet.crossOriginResourcePolicy( { policy: "cross-origin" } ) );
app.use( morgan( "common" ) );
app.use( bodyParser.json( { limit: "30mb", extended: true } ) );
app.use( bodyParser.urlencoded( { limit: "30mb", extended: true } ) );
app.use( cors() );
app.use( "/assets", express.static( path.join( __dirname, 'public/assets' ) ) );


//File Storage
const storage = multer.diskStorage( {
    destination: function ( req, file, cb )
    {
        cb( null, "public/assets" );
    },
    filename: function ( req, file, cb )
    {
        cb( null, file.originalname );
    }
} );

const upload = multer( { storage } );


// Routes with files
app.post( "/auth/register", upload.single( "picture" ), register );
app.post( "/posts", verifyToken, upload.single( "picture" ), createPost );


// Route Path
app.use( "/auth", authRoute );
app.use( "/users", userRoute );
app.use( "/posts", postsRoute );

// Mongoose Configuration
const PORT = process.env.PORT || 5001;
mongoose.set( 'strictQuery', true );
mongoose.connect( process.env.MONGO_URL, {
    useUnifiedTopology: true,
} ).then( () =>
{
    app.listen( PORT, () => console.log( `Mongoose Server Connection on port ${ PORT }` ) );
} ).catch( ( err ) => console.log( err ) );
