
const div = $("div[add-sorter='sorter']");
div.append(`<a href="#" class="table-sorter-btn" data-sort-type="ASC">
<i class="fa fa-caret-down" aria-hidden="true"></i></a>`);


const notifications = $("span[add-notification='notification']");
notifications.append(`<small><span class="ml-1 badge-notification hide-notification"></span></small>`);


$(".table-sorter-btn").on("click",function(){

    const parent = $(this).parent();

    const sources = parent.attr("sorter-source");
    
    const sorter_type = parent.attr("sorter-type");
    const sorter_field = parent.attr("sorter-field");
    const sorter_table = parent.attr("sorter-table");
    let datas = $(sources).data("datas");

    let sortedDatas = [];
    const a = $(this);
    const type = a.data("sort-type");

    if(sorter_type == "alphanumeric"){
        
        

        if(sorter_table == "genexpert"){
            sortedDatas = alphanumeric_sorting_genexpert(datas,sorter_field,type);
        }else{
            sortedDatas = alphanumeric_sorting(datas,sorter_field,type);
        }
    }


    if(sorter_type == "date-calculate"){
        sortedDatas = currentDateOnDate(datas,sorter_field,type);
        
    }

  


    switch(sorter_table){
        case "pm": preventiveMaintenanceController.showList({"uploadDatas":sortedDatas}); break;
        case "xpertcheck": xpertcheckController.showList({"uploadDatas":sortedDatas});  break;
        case "genexpert": genexpertController.showGenexpertList(true,function(){},sortedDatas);  break;
        default: break;
    }


    if(type=="ASC"){

        a.data("sort-type","DESC");
        $(this).html(`<i class="fa fa-caret-up" aria-hidden="true"></i>`);

    }else{

        a.data("sort-type","ASC");
        $(this).html(`<i class="fa fa-caret-down" aria-hidden="true"></i>`);
    }
    
});

function alphanumeric_sorting(arrofDatas,byField,type){

    console.log(arrofDatas);

    if(type=="ASC"){
        
        arrofDatas.sort((a, b) => a[byField].toLowerCase() > b[byField].toLowerCase() ? 1 : -1);
    }else{
       
        arrofDatas.sort((a, b) => b[byField].toLowerCase() > a[byField].toLowerCase() ? 1 : -1);
    }
    

    return arrofDatas;

}

function alphanumeric_sorting_genexpert(arrofDatas,byField,type){
    
    const genexperts = arrofDatas['genexperts'];

    genexperts.filter(d=>{
        return d[byField] == null;
    }).forEach(d=>{
        d[byField] = "null";
    });

    if(type=="ASC"){
        
        genexperts.sort((a, b) => a[byField].toLowerCase() > b[byField].toLowerCase() ? 1 : -1);
    }else{
       
        genexperts.sort((a, b) => b[byField].toLowerCase() > a[byField].toLowerCase() ? 1 : -1);
    }

    arrofDatas['genexperts'] = genexperts;


    return arrofDatas;
}

function currentDateOnDate(arrofDatas,byField,type){

    arrofDatas.forEach(d => {
        const cdate = new Date();
        const gdate = new Date(getOnDate(d[byField]));
        d['date-status'] = cdate.getTime() - gdate.getTime();

        
    });
  


    if(type=="ASC"){
        
        arrofDatas.sort((a, b) => a['date-status'] > b['date-status'] ? 1 : -1);
    }else{
       
        arrofDatas.sort((a, b) => b['date-status'] > a['date-status'] ? 1 : -1);
    }
    

    return arrofDatas;
}