class BackendController{
    constructor(){
        this.autoUpdateInterval = null;
    }

    autoUpdate(time){
        var self = this;
        this.autoUpdateInterval = setInterval(function(){
            self.reloadGenexpert();
        },time);
    }

    stop(){
        clearInterval(this.autoUpdateInterval);
    }

    reloadGenexpert(){
        genexpertController.showGenexpertList(false);
    }

}

const backendController = new BackendController();
module.exports = backendController;