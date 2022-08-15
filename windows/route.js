const fs = require("fs");
class Route{

    constructor(){
        this.appPath();
    }

    appPath(){
    
        this.rootPath = fs.existsSync(`${process.cwd()}/src`) ? 
        `${process.cwd()}` : `${process.cwd()}/resources/app`;

    }

    getFolderPath(){
        return {
           "folder":{
                "frontiers":`${this.rootPath}/src/frontiers`,
                "supporters":`${this.rootPath}/src/supporters`
           }
        }
    }

    html(){

        let roots = `${this.getFolderPath()['folder']['frontiers']}/layouts/html`;

        return {
            "user_access":`${roots}/user-access.html`,
            "main":`${roots}/main.html`
        }
    }
}
const route = new Route();
module.exports = {
    ...route.getFolderPath(),
    ...route.html()

}