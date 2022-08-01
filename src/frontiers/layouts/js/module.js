const moduleModel = require("../../models/ModuleModel");

function showModuleHistory(div){
    const data =$(div).parent().data("module");
    const mod_ser = data['modu_serialnumber'];

    // module-record-content-area
    moduleModel.process().getRecords(mod_ser,function(res){

        // console.log(res);

        const container = $("#module-record-content-area");
        container.html("");

        res.forEach(el => {
            const item = ` <tr>
            <td>${getOnDate(el['dateupdated'])}</td>
            <td>${el['location']}</td>
            <td>${el['itName']}</td>
            <td>${el['fullname']}</td>
            <td>${el['genexpertSN']}</td>
            <td>${el['siteName']}</td>
            <td>${el['status']}</td>
            <td>${el['update_by']}</td>
            <td>${el['part_number']}</td>
            <td>${el['revision_number']}</td>
            </tr>`;

            container.append(item);


        });

        showSubForm("#module-records-area","left");
    });


   
}