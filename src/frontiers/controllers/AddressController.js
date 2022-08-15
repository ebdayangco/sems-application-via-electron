const addressSection = require("../../supporters/sections/AddressSection");
class AddressController{
    constructor(){}

    displayAddressList(){

        
        
        addressSection.displayRegion(".region-drop-down");

        $(".region-drop-down").on("change",function(){

            const reg_code = $(this).val() != "N/A" || $(this).val() != ""? 
            JSON.parse($(this).val())['reg_code']:0;
            addressSection.displayProvince(".province-drop-down",reg_code);
        });

        $(".province-drop-down").on("change",function(){
            
            const prov_code = $(this).val() != "N/A" || $(this).val() != ""? 
            JSON.parse($(this).val())['prov_code']:0;
            addressSection.displayCity(".city-drop-down",prov_code);
        });
        $(".city-drop-down").on("change",function(){
            
            const mun_code = $(this).val() != "N/A" || $(this).val() != ""? 
            JSON.parse($(this).val())['mun_code']:0;
            addressSection.displayBarangay(".barangay-drop-down",mun_code);
        });
    }
}
const addressController = new AddressController();
module.exports = addressController;