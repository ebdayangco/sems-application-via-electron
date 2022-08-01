class Controller{
    constructor(){}

    setLoggedIn(datas,callback){
        
        localStorage.setItem('logged-user',JSON.stringify(datas));
        callback();
    }

    getLoggedIn(){

        const logged_user = localStorage.getItem('logged-user');

        return JSON.parse(logged_user);

    }
}
module.exports = Controller;