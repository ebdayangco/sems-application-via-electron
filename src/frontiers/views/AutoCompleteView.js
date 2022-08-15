const { setAutoComplete, requestsection } = require("../../supporters/sections/RequestSection");
const contactController = require("../controllers/ContactController");
const facilityController = require("../controllers/FacilityController");
const transactionController = require("../controllers/TransactionController");
const View = require("./View");

class AutoCompleteView extends View{
    constructor(){
        super();
    }

    displaySites(div,fieldName){
        facilityController.getAllSites(function(sites){
            requestsection.createAutoComplete(div,sites,fieldName,function(item){
                
            });
        });
        
        
     
    }

    autoCompleteLists(){

        var self = this;

        facilityController.getAllSites(function(sites){

            self.createAutoComplete(sites,'transaction-facility-field','siteName',function(sel){
                getFacilitySN(null,sel['siteName']);
                sel['region'] = sel['region'] == "" || sel['region'] == null?"N/A":sel['region'];
                sel['province'] = sel['province'] == "" || sel['province'] == null ? "N/A":sel['province'];
                sel['city'] = sel['city'] == "" || sel['city'] == null ? "N/A":sel['city'];
                sel['barangay'] = sel['barangay'] == "" || sel['barangay'] == null ?"N/A":sel['barangay'];
    
                $("#transaction-address-region-field")
                .children(`option[name="${sel['region']}"]`).attr("selected",true);
    
           
                let reg_code = JSON.parse($("#transaction-address-region-field > option:selected").val());
                
                reg_code = reg_code == [] ? 0 : reg_code['reg_code'];
                addressSection.displayProvince(".province-drop-down",reg_code);
                $(`#transaction-address-province-field > option[name='${sel['province']}']`).attr("selected",true);
    
                let prov_code = JSON.parse($("#transaction-address-province-field > option:selected").val());
                prov_code = prov_code == [] ? 0 : prov_code['prov_code'];
                addressSection.displayCity(".city-drop-down",prov_code);
                $(`#transaction-address-city-field > option[name='${sel['city']}']`).attr("selected",true);
               
                let mun_code = JSON.parse($("#transaction-address-city-field > option:selected").val());
                mun_code = mun_code == [] ? 0 : mun_code['mun_code'];
                addressSection.displayBarangay(".barangay-drop-down",mun_code);
                $(`#transaction-address-barangay-field > option[name='${sel['barangay']}']`).attr("selected",true);
    
    
                $("#transaction-address-street-field").val(sel['street']);
                $("#transaction-address-latitude-field").val(sel['latitude']);
                $("#transaction-address-longitude-field").val(sel['longitude']);
            });
        });

        facilityController.getAllSites(function(sites){


            self.createAutoComplete(sites,'transaction-information-facility-field','siteName',function(sel){
                // getFacilitySN(null,sel['siteName']);
                // sel['region'] = sel['region'] == "" || sel['region'] == null?"N/A":sel['region'];
                // sel['province'] = sel['province'] == "" || sel['province'] == null ? "N/A":sel['province'];
                // sel['city'] = sel['city'] == "" || sel['city'] == null ? "N/A":sel['city'];
                // sel['barangay'] = sel['barangay'] == "" || sel['barangay'] == null ?"N/A":sel['barangay'];
    
                // $("#transaction-address-region-field")
                // .children(`option[name="${sel['region']}"]`).attr("selected",true);
    
           
                // let reg_code = JSON.parse($("#transaction-address-region-field > option:selected").val());
                
                // reg_code = reg_code == [] ? 0 : reg_code['reg_code'];
                // addressSection.displayProvince(".province-drop-down",reg_code);
                // $(`#transaction-address-province-field > option[name='${sel['province']}']`).attr("selected",true);
    
                // let prov_code = JSON.parse($("#transaction-address-province-field > option:selected").val());
                // prov_code = prov_code == [] ? 0 : prov_code['prov_code'];
                // addressSection.displayCity(".city-drop-down",prov_code);
                // $(`#transaction-address-city-field > option[name='${sel['city']}']`).attr("selected",true);
               
                // let mun_code = JSON.parse($("#transaction-address-city-field > option:selected").val());
                // mun_code = mun_code == [] ? 0 : mun_code['mun_code'];
                // addressSection.displayBarangay(".barangay-drop-down",mun_code);
                // $(`#transaction-address-barangay-field > option[name='${sel['barangay']}']`).attr("selected",true);
    
    
                // $("#transaction-address-street-field").val(sel['street']);
                // $("#transaction-address-latitude-field").val(sel['latitude']);
                // $("#transaction-address-longitude-field").val(sel['longitude']);
            });
        });

        facilityController.getAllSites(function(sites){

            const uniques = [...new Set(sites.map(item => item['street']))];
            const finalUniques = uniques.filter(d=>{
                return d != "N/A" && d != null;
            }).map(v=>{
                return {"street":v}
            });

            self.createAutoComplete(finalUniques,'transaction-address-street-field','street',
            function(){
                
            });
        });
 
        facilityController.getAllSites(function(sites){

            const uniques = [...new Set(sites.map(item => item['siteName']))];
            const finalUniques = uniques.filter(d=>{
                return d != "N/A" && d != null;
            }).map(v=>{
                return {"siteName":v}
            });
            function clear(){

                $("#transaction-transfer-region-field").children(`option[name="N/A"]`).attr("selected",true);
                $("#transaction-transfer-region-field").data('current',"N/A");

                $("#transaction-transfer-province-field").children(`option[name="N/A"]`).attr("selected",true);
                $("#transaction-transfer-province-field").data('current',"N/A");

                $("#transaction-transfer-city-field").children(`option[name="N/A"]`).attr("selected",true);
                $("#transaction-transfer-city-field").data('current',"N/A");

                $("#transaction-transfer-barangay-field").children(`option[name="N/A"]`).attr("selected",true);
                $("#transaction-transfer-barangay-field").data('current',"N/A");

                $("#transaction-transfer-street-field").val("");
                $("#transaction-transfer-latitude-field").val("");
                $("#transaction-transfer-longitude-field").val("");
                
            }
            function display(sel){

                sel['region'] = sel['region'] == "" || sel['region'] == null?"N/A":sel['region'];
                sel['province'] = sel['province'] == "" || sel['province'] == null ? "N/A":sel['province'];
                sel['city'] = sel['city'] == "" || sel['city'] == null ? "N/A":sel['city'];
                sel['barangay'] = sel['barangay'] == "" || sel['barangay'] == null ?"N/A":sel['barangay'];
    
                $("#transaction-transfer-region-field")
                .children(`option[name="${sel['region']}"]`).attr("selected",true);
                $("#transaction-transfer-region-field").data('current',sel['region']);
           
                let reg_code = JSON.parse($("#transaction-transfer-region-field > option:selected").val());
                
                reg_code = reg_code == [] ? 0 : reg_code['reg_code'];
                addressSection.displayProvince(".province-drop-down",reg_code);
                $(`#transaction-transfer-province-field > option[name='${sel['province']}']`).attr("selected",true);
                $("#transaction-transfer-province-field").data('current',sel['province']);
    
                let prov_code = JSON.parse($("#transaction-transfer-province-field > option:selected").val());
                prov_code = prov_code == [] ? 0 : prov_code['prov_code'];
                addressSection.displayCity(".city-drop-down",prov_code);
                $(`#transaction-transfer-city-field > option[name='${sel['city']}']`).attr("selected",true);
                $("#transaction-transfer-city-field").data('current',sel['city']);
               
                let mun_code = JSON.parse($("#transaction-transfer-city-field > option:selected").val());
                mun_code = mun_code == [] ? 0 : mun_code['mun_code'];
                addressSection.displayBarangay(".barangay-drop-down",mun_code);
                $(`#transaction-transfer-barangay-field > option[name='${sel['barangay']}']`).attr("selected",true);
                $("#transaction-transfer-barangay-field").data('current',sel['barangay']);
    
    
                $("#transaction-transfer-street-field").val(sel['street']);
                $("#transaction-transfer-latitude-field").val(sel['latitude']);
                $("#transaction-transfer-longitude-field").val(sel['longitude']);
            }

            $('#transaction-transfer-new-facility-field').on('keyup',function(){

                const val = $(this).val();
                const sel = sites.filter(s=>{
                    return s['siteName'] == val;
                });
                if(sel.length == 0){
                    clear();
                }else{
                    display(sel[0]);
                }
                
            });

            self.createAutoComplete(sites,'transaction-transfer-new-facility-field',
            'siteName',
            function(sel){
                
               display(sel);
            });
        });

        transactionController.getAllTransactions(function(transactions){
            
            const uniques = [...new Set(transactions.map(item => item['department']))];
            const finalUniques = uniques.filter(d=>{
                return d != "N/A" && d != null;
            }).map(v=>{
                return {"department":v}
            });

            self.createAutoComplete(finalUniques,'transaction-department-field',
            'department',function(){
                
            });
        });

        contactController.getAllContacts(function(contacts){


            const duplicates = [];
            const unique_contacts = [];
            contacts.filter(contact => {
                if(!duplicates.includes(contact['fullname'])){
                    duplicates.push(contact['fullname']);
                    unique_contacts.push(contact);
                }
            });

            self.createAutoComplete(unique_contacts,'transaction-contact-name-field',
            'fullname',function(sel){
                $("#transaction-contact-number-field").val(sel['contactnumber']);
                $("#transaction-contact-email-field").val(sel['email']);
                $("#transaction-contact-position-field").val(sel['position']);
            });
        });

        // contactController.getAllContacts(function(contacts){


        //     const duplicates = [];
        //     const unique_contacts = [];
        //     contacts.filter(contact => {
        //         if(!duplicates.includes(contact['contactnumber'])){
        //             duplicates.push(contact['contactnumber']);
        //             unique_contacts.push(contact);
        //         }
        //     });

        //     self.createAutoComplete(unique_contacts,'transaction-contact-number-field',
        //     'contactnumber',function(sel){
        //         $("#transaction-contact-name-field").val(sel['fullname']);
        //         $("#transaction-contact-email-field").val(sel['email']);
        //         $("#transaction-contact-position-field").val(sel['position']);
        //     });
        // });

        contactController.getAllContacts(function(contacts){


            const duplicates = [];
            const unique_contacts = [];
            contacts.filter(contact => {
                if(!duplicates.includes(contact['email'])){
                    duplicates.push(contact['email']);
                    unique_contacts.push(contact);
                }
            });

            self.createAutoComplete(unique_contacts,'transaction-contact-email-field',
            'email',function(sel){
                $("#transaction-contact-name-field").val(sel['fullname']);
                $("#transaction-contact-number-field").val(sel['contactnumber']);
                $("#transaction-contact-position-field").val(sel['position']);
            });
        });

        contactController.getAllContacts(function(contacts){


            const duplicates = [];
            const unique_contacts = [];
            contacts.filter(contact => {
                if(!duplicates.includes(contact['position'])){
                    duplicates.push(contact['position']);
                    unique_contacts.push(contact);
                }
            });

            self.createAutoComplete(unique_contacts,'transaction-contact-position-field',
            'position',function(sel){
               
            });
        });

        // jotformController.getAllSubmissions(function(jotforms){
            
           

        //     const uniques = [...new Set(jotforms.map(item => item['ticket_no']))];
        //     const finalUniques = uniques.filter(d=>{
        //         return d != "N/A" && d != null;
        //     }).map(v=>{
        //         return {"ticket_no":v}
        //     });
        //     self.createAutoComplete(finalUniques,'transaction-jotform-ticket-no-field',
        //     'ticket_no',function(){
                
        //     });
        // });
       
      
    }

    activatePeripheralAutoComplete(){
        var self = this;
        facilityController.getAllSites(function(sites){


            self.createAutoComplete(sites,'genex-install-peripheral-name','siteName',function(sel){
                // getFacilitySN(null,sel['siteName']);
                // sel['region'] = sel['region'] == "" || sel['region'] == null?"N/A":sel['region'];
                // sel['province'] = sel['province'] == "" || sel['province'] == null ? "N/A":sel['province'];
                // sel['city'] = sel['city'] == "" || sel['city'] == null ? "N/A":sel['city'];
                // sel['barangay'] = sel['barangay'] == "" || sel['barangay'] == null ?"N/A":sel['barangay'];
    
                // $("#transaction-address-region-field")
                // .children(`option[name="${sel['region']}"]`).attr("selected",true);
    
           
                // let reg_code = JSON.parse($("#transaction-address-region-field > option:selected").val());
                
                // reg_code = reg_code == [] ? 0 : reg_code['reg_code'];
                // addressSection.displayProvince(".province-drop-down",reg_code);
                // $(`#transaction-address-province-field > option[name='${sel['province']}']`).attr("selected",true);
    
                // let prov_code = JSON.parse($("#transaction-address-province-field > option:selected").val());
                // prov_code = prov_code == [] ? 0 : prov_code['prov_code'];
                // addressSection.displayCity(".city-drop-down",prov_code);
                // $(`#transaction-address-city-field > option[name='${sel['city']}']`).attr("selected",true);
               
                // let mun_code = JSON.parse($("#transaction-address-city-field > option:selected").val());
                // mun_code = mun_code == [] ? 0 : mun_code['mun_code'];
                // addressSection.displayBarangay(".barangay-drop-down",mun_code);
                // $(`#transaction-address-barangay-field > option[name='${sel['barangay']}']`).attr("selected",true);
    
    
                // $("#transaction-address-street-field").val(sel['street']);
                // $("#transaction-address-latitude-field").val(sel['latitude']);
                // $("#transaction-address-longitude-field").val(sel['longitude']);
            },false);
        });
    }
    
    createAutoComplete(datas,fieldname,category,callback,aClass = false){

        // <form autocomplete="off" class="w-100">
        // <div class="autocomplete w-100">
        //     <input type="text" class="site-field  w-100" 
        //     id="facility-info-facility">
        // </div>
        // </form>
        const cls = aClass?".":"#";
        const ma = $(`${cls}${fieldname}`);
        ma.wrap(`<div class="autocomplete w-100"></div>`);
        ma.parent().wrap(`<form autocomplete="off" class="w-100"></form>`);

        // const w = $(`#${fieldname}`).parent().addClass("autocomplete w-100");
        // w.parent().parent().addClass("w-100 autocomplete-form");
        // const root = w.parent().parent();
        // root.attr("autocomplete","off");


        // setAutoComplete(fieldname,datas,category,function(sel){
        //     callback(sel);
        // });


    }

    setAutoCompleteByField(){

        const field = $(`input[auto-complete]`);

        const db_field = field.attr('auto-db-field');
        const db_table = field.attr('auto-db-table');

        if(db_table == 'site'){
            this.setSiteDropDown(function(sites){



            });
        }

        

    }

    setSiteDropDown(callback){
        facilityController.getAllSites(callback);
    }


}
const autoCompleteView = new AutoCompleteView();
module.exports = autoCompleteView;