const { user_access, main } = require("./route");

module.exports = {
    "account-access":{
        "name":"access",
        "route":user_access,
        "frame":false,
        "transparent":true,
        "width":1200,
        "height":600
    },
    "main-index":{
        "name":"index",
        "route":main,
        "frame":false,
        "transparent":true,
        "resizable":true,
        "width":1300,
        "height":675,
        "center":true
    }
}

