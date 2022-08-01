const View = require("./View");
const {setAutoComplete} = require("../../supporters/sections/RequestSection");
const addressSection = require("../../supporters/sections/AddressSection");
class FacilityView extends View{
    constructor(){
        super();
    }

    facilityOnAutoComplete(){

        function settingUp(allSiteFunc,allContactFunc){

            allSiteFunc(function(sites){
                allContactFunc(function(contacts){
                    // autoCompleteForGenexpertTransfer(sites);
                    // autoCompleteForGenexpertEntry(sites,contacts);
                    //  autoCompleteForFacilityInfo(sites,contacts);
                     autoCompleteFacilityFortransactionEntry(sites,contacts);
                    // autoCompleteOnSiteForGenexpertInfo(sites,contacts);
                });
            });
        }

        function autoCompleteFacilityFortransactionEntry(sites,contacts){
            
            setAutoComplete(document.getElementById("transaction-facility-field"),sites,function(sel){
                if(sel){
                    $("#transaction-frame-area").data("site-choose",sel);
                }else{
                    $("#transaction-frame-area").data("site-choose",null);
                }
                
                
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
                // $("#genex-install-address-complete-address").val(
                //     sel['complete_address'] == "undefined" ? "":sel['complete_address']);
    
    
                let foundContacts = contacts.filter(cont=>{
                    return cont['sID'] == sel['siteID'];
                });

                foundContacts = foundContacts.length == 0 ? [] : foundContacts;
                foundContacts.filter((c,i)=>{
                    return i == 0;
                }).forEach(cont=>{

                   
                    $("#transaction-contact-name-field").val(cont['fullname']);
                    $("#transaction-contact-email-field").val(cont['email']);
                    $("#transaction-contact-position-field").val(cont['position']);
                    $("#transaction-contact-number-field").val(cont['contactnumber']);
                });
    
                if(foundContacts.length == 0){
                    $("#transaction-contact-name-field").val("");
                    $("#transaction-contact-email-field").val("");
                    $("#transaction-contact-position-field").val("");
                     $("#transaction-contact-number-field").val("");
                }
    
            });
        }

        function autoCompleteForGenexpertTransfer(sites){

            setAutoComplete(document.getElementById("genexpert-transfer-to-facility"),sites,function(sel){
                
                sel['region'] = sel['region'] == ""?"N/A":sel['region'];
                sel['province'] = sel['province'] == ""?"N/A":sel['province'];
                sel['city'] = sel['city'] == ""?"N/A":sel['city'];
                sel['barangay'] = sel['barangay'] == ""?"N/A":sel['barangay'];
    
                
                sel['region'] = sel['region'] == ""?"N/A":sel['region'];
                sel['province'] = sel['province'] == ""?"N/A":sel['province'];
                sel['city'] = sel['city'] == ""?"N/A":sel['city'];
                sel['barangay'] = sel['barangay'] == ""?"N/A":sel['barangay'];
    
                sel['complete_address'] = sel['complete_address'] == ""?"N/A":sel['complete_address'];
    
                $("#genexpert-transfer-region").val(sel['region']);
                $("#genexpert-transfer-province").val(sel['province']);
                $("#genexpert-transfer-city").val(sel['city']);
                $("#genexpert-transfer-barangay").val(sel['barangay']);
                $("#genexpert-transfer-other-address").val(sel['complete_address']);
    
            },"update");
    
           
        }

        function autoCompleteForFacilityInfo(sites,contacts){

            setAutoComplete(document.getElementById("facility-info-facility"),sites,function(sel){
                
                $("#facility-info-facility").data("id",sel['siteID']);
                sel['region'] = sel['region'] == ""?"N/A":sel['region'];
                sel['province'] = sel['province'] == ""?"N/A":sel['province'];
                sel['city'] = sel['city'] == ""?"N/A":sel['city'];
                sel['barangay'] = sel['barangay'] == ""?"N/A":sel['barangay'];
    
                $("#facility-info-region")
                .children(`option[name="${sel['region']}"]`).attr("selected",true);
    
                let reg_code = JSON.parse($("#facility-info-region > option:selected").val());
                
                reg_code = reg_code == [] ? 0 : reg_code['reg_code'];
                addressSection.displayProvince(".province-drop-down",reg_code);
                $(`#facility-info-province > option[name='${sel['province']}']`).attr("selected",true);
    
                let prov_code = JSON.parse($("#facility-info-province > option:selected").val());
                prov_code = prov_code == [] ? 0 : prov_code['prov_code'];
                addressSection.displayCity(".city-drop-down",prov_code);
                $(`#facility-info-city > option[name='${sel['city']}']`).attr("selected",true);
               
                let mun_code = JSON.parse($("#facility-info-city > option:selected").val());
                mun_code = mun_code == [] ? 0 : mun_code['mun_code'];
                addressSection.displayBarangay(".barangay-drop-down",mun_code);
                $(`#facility-info-barangay > option[name='${sel['barangay']}']`).attr("selected",true);
    
    
                $("#facility-info-street").val(sel['street']);
                $("#facility-info-latitude").val(sel['latitude']);
                $("#facility-info-longitude").val(sel['longitude']);
                $("#facility-info-address").val(
                    sel['complete_address'] == "undefined" ? "":sel['complete_address']);

                

                const currentContacts = contacts.filter(c=>{
                    return c['siteID'] == sel['siteID'];
                });

                const tbody = $("#genexpert-info-contact-tbody");
                tbody.html("");
                currentContacts.forEach(d=>{

                    const data = {
                        "genex_faci_cont_contactID":d['contactID'],
                        "genex_faci_cont_fullname":d['fullname'],
                        "genex_faci_cont_position":d['position'],
                        "genex_faci_cont_contactnumber":d['email'],
                        "genex_faci_cont_email":d['contactnumber'],
                        "genex_faci_cont_siteID":d['siteID'],
                    }
        
                    let tr = `<tr 
                    data-data='${JSON.stringify(data)}' 
                    onclick="showContactInfoForm(this,'update')" 
                    data-table-row-id="${d['contactID']}">`;

                    tr+=`<td data-current="${d['fullname']}">${d['fullname']}</td>`;
                    tr+=`<td data-current="${d['position']}">${d['position']}</td>`;
                    tr+=`<td data-current="${d['email']}">${d['email']}</td>`;
                    tr+=`<td data-current="${d['contactnumber']}">${d['contactnumber']}</td>`;


                    tr+="</tr>";
                    tbody.append(tr);
                });



    
            },"update");

            


        }
        function autoCompleteForGenexpertEntry(sites,contacts){
            
            setAutoComplete(document.getElementById("genex-install-general-site"),sites,function(sel){
    
                sel['region'] = sel['region'] == ""?"N/A":sel['region'];
                sel['province'] = sel['province'] == ""?"N/A":sel['province'];
                sel['city'] = sel['city'] == ""?"N/A":sel['city'];
                sel['barangay'] = sel['barangay'] == ""?"N/A":sel['barangay'];
    
                $("#genex-install-address-region")
                .children(`option[name="${sel['region']}"]`).attr("selected",true);
    
           
                let reg_code = JSON.parse($("#genex-install-address-region > option:selected").val());
                
                reg_code = reg_code == [] ? 0 : reg_code['reg_code'];
                addressSection.displayProvince(".province-drop-down",reg_code);
                $(`#genex-install-address-province > option[name='${sel['province']}']`).attr("selected",true);
    
                let prov_code = JSON.parse($("#genex-install-address-province > option:selected").val());
                prov_code = prov_code == [] ? 0 : prov_code['prov_code'];
                addressSection.displayCity(".city-drop-down",prov_code);
                $(`#genex-install-address-city > option[name='${sel['city']}']`).attr("selected",true);
               
                let mun_code = JSON.parse($("#genex-install-address-city > option:selected").val());
                mun_code = mun_code == [] ? 0 : mun_code['mun_code'];
                addressSection.displayBarangay(".barangay-drop-down",mun_code);
                $(`#genex-install-address-barangay > option[name='${sel['barangay']}']`).attr("selected",true);
    
    
                $("#genex-install-address-street").val(sel['street']);
                $("#genex-install-address-latitude").val(sel['latitude']);
                $("#genex-install-address-longitude").val(sel['longitude']);
                $("#genex-install-address-complete-address").val(
                    sel['complete_address'] == "undefined" ? "":sel['complete_address']);
    
    
                let foundContacts = contacts.filter(cont=>{
                    return cont['siteID'] == sel['siteID'];
                });
    
                foundContacts = foundContacts.length == 0 ? [] : foundContacts;
                foundContacts.filter((c,i)=>{
                    return i == 0;
                }).forEach(cont=>{
                    $("#genex-install-contact-fullname").val(cont['fullname']);
                    $("#genex-install-contact-email").val(cont['email']);
                    $("#genex-install-contact-position").val(cont['position']);
                    $("#genex-install-contact-number").val(cont['contactnumber']);
                });
    
                if(foundContacts.length == 0){
                    $("#genex-install-contact-fullname").val("");
                    $("#genex-install-contact-email").val("");
                    $("#genex-install-contact-position").val("");
                     $("#genex-install-contact-number").val("");
                }
    
            });
        }
        function autoCompleteOnSiteForGenexpertInfo(sites,contacts){
    
            setAutoComplete(document.getElementById("asset-info-edit-facility"),sites,function(sel){
    
                sel['region'] = sel['region'] == ""?"N/A":sel['region'];
                sel['province'] = sel['province'] == ""?"N/A":sel['province'];
                sel['city'] = sel['city'] == ""?"N/A":sel['city'];
                sel['barangay'] = sel['barangay'] == ""?"N/A":sel['barangay'];
    
                $("#asset-info-display-region").html(sel['region']);
                $("#asset-info-display-province").html(sel['province']);
                $("#asset-info-display-city").html(sel['city']);
                $("#asset-info-display-barangay").html(sel['barangay']);
                $("#asset-info-display-street").html(sel['street']);
                $("#asset-info-display-latitude").html(sel['latitude']);
                $("#asset-info-display-longitude").html(sel['longitude']);
    
                let foundContacts = contacts.filter(cont=>{
                    return cont['siteID'] == sel['siteID'];
                });
    
                foundContacts = foundContacts.length == 0 ? [] : foundContacts;
                foundContacts.filter((c,i)=>{
                    return i == 0;
                }).forEach(cont=>{
                    $("#genex-install-contact-fullname").val(cont['fullname']);
                    $("#genex-install-contact-email").val(cont['email']);
                    $("#genex-install-contact-position").val(cont['position']);
                    $("#genex-install-contact-number").val(cont['contactnumber']);
                });
    
                if(foundContacts.length == 0){
                    $("#genex-install-contact-fullname").val("");
                    $("#genex-install-contact-email").val("");
                    $("#genex-install-contact-position").val("");
                    $("#genex-install-contact-number").val("");
                }
    
            },"update");
    
        }

        return {settingUp};
    }
}
const facilityView = new FacilityView();
module.exports = facilityView;