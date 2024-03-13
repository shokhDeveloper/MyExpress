const RegexGenerator = (url) => {
    let str = '';
    let params = '\\b.*?/';
    let ind = false
    for(let i = 0; i<url.length; i++){
        if(url[i] == ":"){
            str += params
            ind = true
        }else if(url[i] == "/" && ind){
            ind = false
        }else if(ind){
            continue;
        }else{
            str += url[i]
        }
    }
    return new RegExp(str, "gis")
}
console.log(RegexGenerator("/posts/:x/:j"))
// /\/posts/\b.*?/\b.*?//gis
console.log(handleTestRegex())