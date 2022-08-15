function showTransactionInformation(div){
    const datas = $(div).data('support');

    displayTransactionInformation(datas);
    showSubForm("#transaction-information-area","left");


}

function displayTransactionInformation(data){
    const facility = $("#transaction-information-facility-field");
    const department = $("#transaction-information-department-field");
    const telno = $("#transaction-information-telno-field");
    const address = $("#transaction-information-address-field");
    const contactInfo = $("#transaction-information-contact-info-field");
    const equipment = $("#transaction-information-equipment-field");
    const modelnumber = $("#transaction-information-model-number-field");
    const sn = $("#transaction-information-serial-number-field");

    sn.val(data['serialnumber']);
    facility.val(data['siteName']);
    department.val(data['department']);
    telno.val(data['sr_telno']);

    const region = data['region'] ?`, ${data['region']}`:"";
    const province = data['province'] ?`, ${data['province']}`:"";
    const city = data['city'] ?`,${data['city']}`:"";
    const barangay = data['barangay'] ? `, ${data['barangay']}`:"";
    const street = data['street'] ? data['street']:"";
    let all = street+barangay+city+province+region;
    all = all.startsWith(',') ? all.replace(',',''):all;
    address.val(all);
    let contacts = `
    ${data['contactname'] ? `${data['contactname']} - ${data['contactposition']} `:""}
    ${data['contactemail'] ? `  Email:${data['contactemail']}` :""} 
    ${data['contactnumber'] ? `  Contact Number:${data['contactnumber']}` :""}`;
    contactInfo.val(contacts);
    equipment.val(data['sr_equipment']);
    modelnumber.val(data['mnID']);
    

}

function hideTransactionInformation(){

    hideSubForm("#transaction-information-area","left");


}