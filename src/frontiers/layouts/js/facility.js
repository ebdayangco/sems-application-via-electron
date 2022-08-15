const addressSection = require("../../../supporters/sections/AddressSection");
function allClearInfo(){

    let fieldList = {
        "facility":"#facility-info-facility",
        "region":"#facility-info-region",
        "province":"#facility-info-province",
        "city":"#facility-info-city",
        "barangay":"#facility-info-barangay"
    }
   
    const fields = Object.values(fieldList);
    const type = ["text","select","select","select","select"];
    let objects = [];
    fields.forEach((f,i)=>{
        objects.push({
            "div":f,
            "type":type[i]
        });
    });
    // $("#facility-info-region").prop('selectedIndex', 0);
   


}
function displayFacilityInfo(data,func){
    
    allClearInfo();
    data['region'] = data['region'] == ""?"N/A":data['region'];
    data['province'] = data['province'] == ""?"N/A":data['province'];
    data['city'] = data['city'] == ""?"N/A":data['city'];
    data['barangay'] = data['barangay'] == ""?"N/A":data['barangay'];
    

    data = JSON.parse(JSON.stringify(data));
    $("#facility-info-facility").val(data['facility']);

    if(data['region'] == "N/A"){
    
        $("#facility-info-region").prop('selectedIndex', 0);
    }else{
        $("#facility-info-region")
    .children(`option[name="${data['region']}"]`).attr("selected",true);
    }
    

    let reg_code = JSON.parse($("#facility-info-region > option:selected").val());
   
    reg_code = reg_code == [] ? 0 : reg_code['reg_code'];
    addressSection.displayProvince(".province-drop-down",reg_code);
    $(`#facility-info-province > option[name='${data['province']}']`).attr("selected",true);

    let prov_code = JSON.parse($("#facility-info-province > option:selected").val());
    prov_code = prov_code == [] ? 0 : prov_code['prov_code'];
    addressSection.displayCity(".city-drop-down",prov_code);
    $(`#facility-info-city > option[name='${data['city']}']`).attr("selected",true);
    
    let mun_code = JSON.parse($("#facility-info-city > option:selected").val());
    mun_code = mun_code == [] ? 0 : mun_code['mun_code'];
    addressSection.displayBarangay(".barangay-drop-down",mun_code);
    $(`#facility-info-barangay > option[name='${data['barangay']}']`).attr("selected",true);

   

    $("#facility-info-save-btn").on("click",function(){

        let datas = {
            "siteID":$("#facility-info-facility").data("id"),
            "facility":$("#facility-info-facility").val(),
            "region":$("#facility-info-region").children("option:selected").text(),
            "province":$("#facility-info-province").children("option:selected").text(),
            "city":$("#facility-info-city").children("option:selected").text(),
            "barangay":$("#facility-info-barangay").children("option:selected").text(),
            "street":$("#facility-info-street").val(),
            "latitude":$("#facility-info-latitude").val(),
            "longitude":$("#facility-info-longitude").val()
        }
        func(datas);
    });
    
}

