import fs from "fs/promises";
import path from "path";
export const readFile = async (fileName) => {
    let data = await fs.readFile(path.resolve("database", `${fileName}.json`), "utf-8")
    data = data ? JSON.parse(data): [];
    return data
}