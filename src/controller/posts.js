import fs from "node:fs/promises";
import { readFile } from "../lib/readFile.js";
import path from "node:path";

export const postsController = {
    GET: async (req, res) => {
        const posts = await readFile("posts")
        const searchParams = req.searchParams;
        const params = req.params ? req.params: {}
        if(Object.keys(params).length){
            res.json(
                posts.find(item => item.id == params.postId)
            )
        }else{
            if(searchParams){
                const store = []
                for (const post of posts) {
                    let counter = 0;
                    for (const key in searchParams) {
                        if(searchParams[key] == post[key]) counter ++;
                    }
                    if(Object.keys(searchParams).length == counter) store.push(post)
                }
                res.json(store)
            }else{
                res.json(posts)
            }
        }
    },
    POST: async (req, res) => {
        const posts = await readFile("posts")
        const newPost = await req.body;
        if(!newPost.title || !newPost.discription || !newPost.userId){
            res.json({
                message: "Post invalid"
            })
        }else{        
            newPost.id = posts.length ? posts[posts.length-1].id + 1: 1
            posts.push(newPost);
            await fs.writeFile(path.resolve("database", "posts.json"), JSON.stringify(posts, null, 4))
            res.json({
                message: "Post created successfull",
                post: newPost
            })
        }
    },
    PUT: async (req, res) => {
        const posts = await readFile("posts");
        const updatePost = await req.body;
        const params = req.params;
        const idx = posts.findIndex((item) => item.id == params.postId)
        posts[idx] = updatePost
        if(!updatePost.title || !updatePost.discription || !updatePost.userId){
            res.json({
                message: "Post its invalid !"
            })
        }else{
            res.json({
                message: "Post updated successfull",
                post: updatePost
            })
        }
        await fs.writeFile(path.resolve("database", "posts.json"), JSON.stringify(posts, null, 4))
        res.json(posts)
    },
    DELETE: async (req, res) => {
        const posts = Array.from(await readFile("posts"));
        const params = req.params;
        let idx = posts.findIndex(item => item.id == params.postId);
        let deletedPost = posts.splice(idx, 1);
        await fs.writeFile(path.resolve("database", "posts.json"), JSON.stringify(posts, null, 4))
        res.json({
            message: "Post deleted successfull",
            post: deletedPost
        })
    }
}