const regs = require("addresspinas").philData.allRegions.regions;
const provs = require("addresspinas").philData.allProvinces.provinces;
const citmun = require("addresspinas").philData.allCitiesAndMunicipal.citiesAndMunicipals;
const brgys  = require("addresspinas").philData.allBrgys.barangays;


class PhilippineLocation{

    constructor(){

    }

    getLocation(){

        function getRegions(){
            return regs;
        }
    
        function getProvinces(reg_code){
    
            if(reg_code){
                return provs.filter(prov=>{
                    return prov['reg_code'] == reg_code;
                });
            }
    
            return provs;
        }
    
        function getCities(prov_code){
    
            if(prov_code){
                return citmun.filter(cit=>{
                    return cit['prov_code'] == prov_code;
                });
            }
            return citmun;
        }
    
        function getBarangays(mun_code){
    
            if(mun_code){
                return brgys.filter(brgy=>{
                    return brgy['mun_code'] == mun_code;
                });
            }
            return brgys;
        }

        return {getRegions,getProvinces,getCities,getBarangays};
    }

}
const pl = new PhilippineLocation();
module.exports = {
    getLocation:function(){
        return pl.getLocation();
    },

}
