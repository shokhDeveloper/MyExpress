import os from "os" 

export let IP_ADRESS = "";
export const PORT = process.env.PORT || "4000"
const networkInterface = os.networkInterfaces();
try{
    if(networkInterface["Беспроводная сеть 3"]){
        IP_ADRESS = networkInterface["Беспроводная сеть 3"].find((item) => item.family == "IPv4").address
    }
}catch(error){
    console.log(error)
}
export const host = `http://${IP_ADRESS || "localhost"}:${PORT}`;

