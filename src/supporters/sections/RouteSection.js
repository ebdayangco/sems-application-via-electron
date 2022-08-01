class RouteSection{

    constructor(){
        this.fs = require("fs");
        this.appPath();
    }

    appPath(){

        this.rootPath = this.fs.existsSync(`${process.cwd()}/src`) ? 
        `${process.cwd()}` : `${process.cwd()}/resources/app`;

    }
    node_modules(){
        return {
            "node_modules":{
                "bootstrap":{
                    "bootstrap-min-css":`${this.rootPath}/node_modules/bootstrap/dist/css/bootstrap.min.css`,
                    "bootstrap-min-js":`${this.rootPath}/node_modules/bootstrap/dist/js/bootstrap.min.js`
                },
                "font-awesome":{
                    "font-awesome-min-css":`${this.rootPath}/node_modules/font-awesome/css/font-awesome.min.css`
                },
                "jquery":{
                    "jquery-min-js":`${this.rootPath}/node_modules/jquery/dist/jquery.min.js`
                }
            }
           
        }
    }
    pages(){
        return {
            "index":`${this.rootPath}/src/index/index.html`,
            "home":{
                "main-html":`${this.rootPath}/src/home/main.html`
            },
            "accounts":{
                "edit":{
                    "account-html":`${this.rootPath}/src/accounts/edit/account.html`,
                    "change-passsword-html":`${this.rootPath}/src/accounts/edit/change_passsword.html`,
                    "account-css":`${this.rootPath}/src/accounts/edit/account.css`
                },
                "login-register":{
                    "access-html":`${this.rootPath}/src/accounts/login_register/access.html`,
                    "access-css":`${this.rootPath}/src/accounts/login_register/access.css`
                },
                "account-controller-js":`${this.rootPath}/src/accounts/AccountController.js`
            },
            "assets":{
                "index":`${this.rootPath}/src/assets/asset-index.html`
            },
            "genexperts":{
                "assets":{
                    "asset-index-html":`${this.rootPath}/src/genexperts/assets/asset-index.html`,
                    "asset-new-html":`${this.rootPath}/src/genexperts/assets/asset-new.html`,
                    "asset-edit-html":`${this.rootPath}/src/genexperts/assets/asset-edit.html`,
                    "asset-upload-excel-html":`${this.rootPath}/src/genexperts/assets/asset-upload-excel.html`,
                    "asset-info-display-html":`${this.rootPath}/src/genexperts/assets/asset-info-display.html`,
                    "asset-filter-html":`${this.rootPath}/src/genexperts/assets/asset-filter.html`
                },
                "xpertchecks":{
                    "xpertcheck-index-html":`${this.rootPath}/src/genexperts/xpertchecks/xpertcheck_index.html`,
                    "xpertcheck-entry-html":`${this.rootPath}/src/genexperts/xpertchecks/xpertcheck_entry.html`
                },
                "preventive-maintenances":{
                    "pm-index-html":`${this.rootPath}/src/genexperts/preventive_maintenances/pm_index.html`,
                },
                "genexpert-css":`${this.rootPath}/src/genexperts/genexpert.css`
            },
            "modules":{
                "module-index-html":`${this.rootPath}/src/module/module-index.html`,
                "module-new-html":`${this.rootPath}/src/module/module-new.html`,
                "module-transaction-html":`${this.rootPath}/src/module/module-transaction.html`,
            },
            "reports":{
                "report-main-html":`${this.rootPath}/src/reports/report-main.html`,
                "report-blank-html":`${this.rootPath}/src/reports/report-blank.html`,
                "report-shared-html":`${this.rootPath}/src/reports/report-shared.html`,
                "report-created-html":`${this.rootPath}/src/reports/report-created.html`
            }
        }
    }

    
}
const routesection = new RouteSection();
module.exports = {
    ...routesection.node_modules(),
    ...routesection.pages()
    
}