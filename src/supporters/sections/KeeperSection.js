class KeeperSection{
    constructor(){
        KeeperSection.asset = "";
    }
    static getAsset(){
        return KeeperSection.asset;
    }
    static setAsset(content){
        KeeperSection.asset = content;
    }
}
module.exports = KeeperSection;