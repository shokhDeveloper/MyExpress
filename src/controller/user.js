import fs from "node:fs/promises";
import { readFile } from "../lib/readFile.js";
import path from "node:path";
export const userController = {
    GET: async (req, res) => {
        const users = await readFile("users")
        const searchParams = req.searchParams;
        if(searchParams){
            const store = []
            for (const user of users) {
                let counter = 0;
                for (const key in searchParams) {
                    if(searchParams[key] == user[key]) counter ++;
                }
                if(Object.keys(searchParams).length == counter) store.push(user)
            }
            res.json(store)
        }else{
            res.json(users)
        }
    },
    POST: async (req, res) => {
        const users = await readFile("users")
        const newUser = await req.body;
        if(!newUser.name || !newUser.gender || !newUser.age){
            res.json({
                message: "Invalid user data"
            })    
        }else{
            users.push(newUser);
            await fs.writeFile(path.resolve("database", "users.json"), JSON.stringify(users, null, 4))
            res.json({
                message: "User created successfull !",
                user: newUser
            })
        }
    }
}
