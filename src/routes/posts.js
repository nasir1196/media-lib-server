import express from 'express';
import { commentPost, getFeedPosts, getUserPosts, likePost } from '../Controllers/posts.js';
import { verifyToken } from '../middleware/auth.js';




const router = express.Router();

// Read
router.get( "/", verifyToken, getFeedPosts );
router.get( "/:userId/posts", verifyToken, getUserPosts );


// Update
router.patch( "/:id/like", verifyToken, likePost );

router.post( "/:id/comments", verifyToken, commentPost );


export default router;