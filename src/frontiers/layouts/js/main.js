function changeBackground(page,div){
    const root = "../../../supporters/galleries";
    let img = `url("${root}/bg.jpg`;
    
    switch(page){
        case 'genexpert':img = `url("${root}/asset_bg.png")`;break;
        case 'module':img = `url("${root}/module_bg.webp")`;break;
        case 'transaction':img = `url("${root}/transaction_bg.png")`;break;
        case 'xpertcheck':img = `url("${root}/xpertcheck_bg.png")`;break;
        case 'maintenance':img = `url("${root}/maintenance_bg.jpg")`;break;
        case 'report':img = `url("${root}/report_bg.jpg")`;break;
        case 'service-report':img = `url("${root}/service-report.jpg")`;break;
        case 'jotform':img = `url("${root}/jotform.png")`;break;
        case 'notification':img = `url("${root}/notification.png")`;break;
        case 'dashboard':img = `url("${root}/dashboard.jpeg")`;break;
        default:"";
    }

    $(".screen-area").css(`background`,img);

    if(page == "notification"){
        if($(div).hasClass('unread-alert-highlight')){
            $(div).removeClass('unread-alert-highlight');
        }
    }
    

    activeMenu(div);

    
}

function showLogOutForm(){
    showSubForm(".log-out-screen-area","top");
}

function hideLogOutForm(){
    hideSubForm(".log-out-screen-area","top");
}

function getAccountField(){
    return {
        "firstname":$("#show-account-firstname"),
        "lastname":$("#show-account-lastname"),
        "contact-number":$("#show-account-contact-number"),
        "email":$("#show-account-email")
    }
}

function showAccountInfo(){
    
    // localStorage.setItem('logged-user',JSON.stringify(datas));
    const fields = getAccountField();
    const datas = JSON.parse(localStorage.getItem('logged-user'));
    fields['firstname'].val(datas['firstname']);
    fields['lastname'].val(datas['lastname']);
    fields['contact-number'].val(datas['contactnumber']);
    fields['email'].val(datas['email']);
  
    showSubForm(".show-account-screen-area","top");
}

function hideAccountInfo(){
    hideSubForm(".show-account-screen-area","top");
}

function titlebar_form(formID){

    const titlebarform = $(".title-bar-reveal-form-area");

    if(titlebarform.hasClass("title-bar-form-hide")){
        titlebarform.removeClass("title-bar-form-hide");
    }

  
}

function closeTitleBarForm(){
    const titlebarform = $(".title-bar-reveal-form-area");
    titlebarform.addClass("title-bar-form-hide");
}


notificationController.liveNotification();

function toggleChatDocker(){

    const ma = $(".sems-chat-area");

    if(ma.hasClass("chat-sems-hide")){

        ma.removeClass("chat-sems-hide");
        
    }else{
        ma.addClass("chat-sems-hide");
        
    }
}