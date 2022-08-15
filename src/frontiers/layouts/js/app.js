const reportLibrary = require("../../../supporters/sections/ReportLibrary");

function openMacareSite(){
    shell.openExternal("https://www.macare-medicals.com/");
}

function quitApp(){
    ipcRenderer.send('quit-app','argument');
}

function buildInstaller(){

}

function sapImport(){
    reportLibrary.excel().importing().SAP(function(datas){
        // console.log(datas);
    });
}

function notifying(title,body,onclick){
    ipcRenderer.send("show-notification",{body,title});
    ipcRenderer.on("catch-notification",function(d){

        d.on('click', (event, arg)=>{
           onclick();
           
        });
    });
    
}



function minimize(){

    ipcRenderer.send("minimize-window","");
}

function showDevTools(){
    ipcRenderer.send("show-dev-tools");
}

function maximize(div){

    const val = $(div).attr('name');

    if(val == "restore"){

        $(div).attr('name',"maximize");
        $(div).html("&square;");

        $(".title-bar-area").css("border-top-left-radius","10px");
        $(".title-bar-area").css("border-top-right-radius","10px");
        $(".title-bar-area").css("border","1.5px solid #fff");
        $(".main-area").css("border-bottom-left-radius","10px");
        $(".main-area").css("border-bottom-right-radius","10px");
        $(".main-area").css("border","1.5px solid #fff");
        $(".main-area").css("border-top","0px");
        
      
        ipcRenderer.send("restore-window","");
        console.log("above");

    }else{

        $(div).attr('name',"restore");
        $(div).html("&#128471;&#xFE0E;");

        $(".title-bar-area").css("border-top-left-radius","0px");
        $(".title-bar-area").css("border-top-right-radius","0px");
        $(".title-bar-area").css("border","0px solid #fff");
        $(".title-bar-area").css("border-top","1px solid rgb(255, 255, 255)");
        $(".title-bar-area").css("border-bottom","1px solid rgb(255, 255, 255)");
        $(".main-area").css("border-bottom-left-radius","0px");
        $(".main-area").css("border-bottom-right-radius","0px");
        $(".main-area").css("border","0px solid #fff");

        ipcRenderer.send("maximize-window","");
        console.log("below");
    }

    
}

function showSubForm(id_class,hideLocation,div){
    const form = $(id_class);
    switch(hideLocation){
        case "top": form.addClass("showFromTop");  break;
        case "bottom": form.addClass("showFromBottom");  break;
        case "left": form.addClass("showFromLeft");  break;
        case "right": form.addClass("showFromRight");  break;
        default:form.addClass("showFromTop");  break;
    }

    if(div){
        $(div).off("click");
    }

}

function hideSubForm(id_class,lastLocation,div){

    const form = $(id_class);
    switch(lastLocation){
        case "top": form.removeClass("showFromTop");  break;
        case "bottom": form.removeClass("showFromBottom");  break;
        case "left": form.removeClass("showFromLeft");  break;
        case "right": form.removeClass("showFromRight");  break;
        default:form.removeClass("showFromTop");  break;
    }
    if(div){
        $(div).off("click");
    }
   
}

// Vertical bar chart
// var ctx = document.getElementById('active-gen-monthly-a-year').getContext('2d');
// var myChart = new Chart(ctx, {
//     type: 'bar',
//     data: {
//         labels: ['January', 'February', 'March', 'April', 'May', 'June','July','August',
//     'September','October','November','December'],
//         datasets: [{
//             label: 'Life expectancy',
//             data: [84.308, 84.188, 84.118, 83.706, 83.5, 83.468,85,78.343,87.65,89.45,90.34,150],
//             backgroundColor: [
//                 'rgba(216, 27, 96, 0.6)',
//                 'rgba(3, 169, 244, 0.6)',
//                 'rgba(255, 152, 0, 0.6)',
//                 'rgba(29, 233, 182, 0.6)',
//                 'rgba(156, 39, 176, 0.6)',
//                 'rgba(84, 110, 122, 0.6)'
//             ],
//             borderColor: [
//                 'rgba(216, 27, 96, 1)',
//                 'rgba(3, 169, 244, 1)',
//                 'rgba(255, 152, 0, 1)',
//                 'rgba(29, 233, 182, 1)',
//                 'rgba(156, 39, 176, 1)',
//                 'rgba(84, 110, 122, 1)'
//             ],
//             borderWidth: 1
//         }]
//     },
//     options: {
//         legend: {
//             display: false
//         },
//         title: {
//             display: true,
//             text: 'Number of Active Genexpert 2022',
//             position: 'top',
//             fontSize: 14,
//             padding: 20
//         },
//         scales: {
//             yAxes: [{
//                 ticks: {
//                     min: 75
//                 }
//             }]
//         }
//     }
// });
reportController.maker().settingUp();
reportController.list().onView().list().showDefault();

