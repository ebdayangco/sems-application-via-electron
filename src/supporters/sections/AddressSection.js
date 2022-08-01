const { getLocation } = require("../dependencies/phLocation/philippineLocation");
class AddressSection{
    constructor(){
       
    }

    getAddresses(level,code){

        let locations = [];

        switch(level){
            case "regions":locations = getLocation().getRegions(); break;
            case "provinces":locations = getLocation().getProvinces(code); break;
            case "cities":locations = getLocation().getCities(code); break;
            case "barangays":locations = getLocation().getBarangays(code); break;
            default:null;

        }
        
        return locations;
    }

    displayRegion(container){
        $(container).html('');
        $(container).append(`<option value='${JSON.stringify([])}' name="N/A">N/A</option>`);
        getLocation().getRegions().forEach(region=>{
            $(container).append(`<option value='${JSON.stringify(region)}' name="${region['name']}">${region['name']}</option>`);
        });
    }

    displayProvince(container,reg_code){

        $(container).html('');
        $(container).append(`<option value='${JSON.stringify([])}' name="N/A">N/A</option>`);

        getLocation().getProvinces().filter(prov=>{
            return prov['reg_code'] == reg_code;
        }).forEach(prov=>{
            $(container).append(`<option value='${JSON.stringify(prov)}' 
            name="${prov['name']}">${prov['name']}</option>`);
        });

    }
    displayCity(container,prov_code){

        $(container).html('');
        $(container).append(`<option value='${JSON.stringify([])}' 
        name="N/A">N/A</option>`);

        getLocation().getCities().filter(cit=>{
            return cit['prov_code'] == prov_code;
        }).forEach(cit=>{
            $(container).append(`<option value='${JSON.stringify(cit)}' 
            name="${cit['name']}">${cit['name']}</option>`);
        });

    }

    displayBarangay(container,mun_code){

        $(container).html('');
        $(container).append(`<option value='${JSON.stringify([])}' name="N/A">N/A</option>`);

        getLocation().getBarangays().filter(brgy=>{
            return brgy['mun_code'] == mun_code;
        }).forEach(brgy=>{
            $(container).append(`<option value='${JSON.stringify(brgy)}' 
            name="${brgy['name']}">${brgy['name']}</option>`);
        });

    }

    createList(options){

        $(options['container']).html('');
        $(options['container']).append(`<option value='${JSON.stringify([])}'>N/A</option>`);

        if(options['codename']){
           
            options['datas'].filter(d=>{
                return d[options['codename']] == options['codenum'];
            }).forEach(data => {
                $(options['container']).append(`<option value='${JSON.stringify(data)}' 
                name="${data['name']}">
                ${data['name']}</option>`);
            });
        }else{
            options['datas'].forEach(data => {
                $(options['container']).append(`<option value='${JSON.stringify(data)}' 
                name="${data['name']}">
                ${data['name']}</option>`);
            });
        }

       

       

    }


    assignAddress(address){

        let region,province,city,barangay = [];


        //REGION ASSIGN SELECT LIST
        if(address['region']['name'] == "N/A"){

            this.createList({
                "container":address['region']['container'],
                "datas":getLocation().getRegions()
            });

        }else{
            
            region = getLocation().getRegions().filter(v=>{
                return v['name'] == address['region']['name'];
            });

            this.createList({
                "container":address['region']['container'],
                "datas":getLocation().getRegions()
            });

            $(address['region']['container'])
            .find(`option[value='${JSON.stringify(region)}']`).attr('selected','selected');

        }

        //PROVINCE ASSIGN SELECT LIST
        if(address['province']['name'] == "N/A"){

            this.createList({
                "container":address['province']['container'],
                "datas":[]
            });

        }else{
            
            province = getLocation().getProvinces().filter(v=>{
                return v['name'] == address['province']['name'];
            });

            this.createList({
                "container":address['province']['container'],
                "datas":getLocation().getProvinces(),
                "codename":"reg_code",
                "codenum":region['reg_code']
            });

           
            $(address['province']['container'])
            .find(`option[value='${JSON.stringify(province)}']`).attr('selected','selected');
        }

         //CITY ASSIGN SELECT LIST
        if(address['city']['name'] == "N/A"){

            this.createList({
                "container":address['city']['container'],
                "datas":[]
            });
            

        }else{
            
            city = getLocation().getCities().filter(v=>{
                return v['name'] == address['city']['name'];
            });

            
            this.createList({
                "container":address['city']['container'],
                "datas":getLocation().getCities(),
                "codename":"prov_code",
                "codenum":province['prov_code']
            });
            
            $(address['city']['container'])
            .find(`option[value='${JSON.stringify(city)}']`).attr('selected','selected');
        }

         //BARANGAY ASSIGN SELECT LIST
         if(address['city']['name'] == "N/A"){

            this.createList({
                "container":address['barangay']['container'],
                "datas":[]
            });


        }else{
            
            barangay = getLocation().getCities().filter(v=>{
                return v['name'] == address['barangay']['name'];
            });

            this.createList({
                "container":address['barangay']['container'],
                "datas":getLocation().getBarangays(),
                "codename":"mun_code",
                "codenum":city['mun_code']
            });
           

            $(address['barangay']['container'])
            .find(`option[value='${JSON.stringify(barangay)}']`).attr('selected','selected');
        }

        this.setOnchange({
            "region":address['region']['container'],
            "province":address['province']['container'],
            "city":address['city']['container'],
            "barangay":address['barangay']['container']
        });
        
           
    }

    setOnchange(containers){    

        var self = this;
        $(containers['region']).on('change',function(){

            const region = JSON.parse($(this).val());
           
            self.displayProvince(containers['province'],region['reg_code']);
        });

        $(containers['province']).on('change',function(){

            const prov = JSON.parse($(this).val());
           
            self.displayCity(containers['city'],prov['prov_code']);
        });

        $(containers['city']).on('change',function(){

            const city = JSON.parse($(this).val());
           
            self.displayBarangay(containers['barangay'],city['mun_code']);
        });
    }



}
const addressSection = new AddressSection();
module.exports = addressSection
