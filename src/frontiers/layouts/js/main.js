function changeBackground(page,div){
    changeNotificationBackground(page);
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

function scrollRead(div,callback){
    $(div).on("scroll",function(){

        callback($(div).scrollTop(),$(this).prop("scrollHeight"));
        
        // if($(div).scrollTop() + $(div).height() == $(div).height()) {
        //     callback();
        // }
    });
   
}

function scrollUnread(){
    $(div).off("scroll");
}

function hideNotificationBox(){
    $(".sems-notification-box-area").addClass("notification-box-hide");
}

function changeNotificationBackground(page){

    let bg = "";

    switch(page){
        case 'genexpert':img = `notification-genexpert-background`;break;
        // case 'module':img = `background:rgb(255,255,255,0.7) !important`;break;
        case 'transaction':bg = `notification-transaction-background`;break;
        // case 'xpertcheck':bg = `url("${root}/xpertcheck_bg.png")`;break;
        // case 'maintenance':bg = `url("${root}/maintenance_bg.jpg")`;break;
         case 'report':bg = `notification-report-background`;break;
        // case 'service-report':img = `url("${root}/service-report.jpg")`;break;
        // case 'jotform':img = `url("${root}/jotform.png")`;break;
        // case 'notification':img = `url("${root}/notification.png")`;break;
        // case 'dashboard':img = `url("${root}/dashboard.jpeg")`;break;
        default:bg = "";break;
    }

    const sems_notification = $(".sems-notification-area");
    sems_notification.removeClass("notification-genexpert-background");
    sems_notification.removeClass("notification-transaction-background");
    sems_notification.removeClass("notification-report-background");
    if(bg != ""){
        sems_notification.addClass(bg);
    }
    

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

function toggleNotificationDocker(){

    const ma = $(".sems-notification-area");

    if(ma.hasClass("notification-sems-hide")){

        ma.removeClass("notification-sems-hide");
        scrollRead(".notification-list-all-area",function(scr,hght){

           
            // const hght = Math.ceil($(".notification-list-area").height());

            const height_of_list_container = Math.floor($(".notification-list-all-area").height());
            const perc = ((height_of_list_container + scr)/hght) * 100;
          
           if(perc >= 90){
                notificationController.addAllListOnScroll();
           }
           
        });

        scrollRead(".notification-list-unread-area",function(scr,hght){

           
            // const hght = Math.ceil($(".notification-list-area").height());

            const height_of_list_container = Math.floor($(".notification-list-unread-area").height());
            const perc = ((height_of_list_container + scr)/hght) * 100;
          
           if(perc >= 90){
                notificationController.addUnreadListOnScroll();
           }
           
        });
        
    }else{
        ma.addClass("notification-sems-hide");
        scrollUnread(".notification-list-area");
        
    }
}

function showUnreadList(div){
    $(div).addClass("notification-option-active").siblings().removeClass("notification-option-active");
    $(".notification-list-unread-area").removeClass("notification-list-hide");
    $(".notification-list-all-area").addClass("notification-list-hide");
    notificationController.resetUnreadLimit();
    notificationController.notificationAction().getUnreadNotification();
}

function showAllList(div){
    $(div).addClass("notification-option-active").siblings().removeClass("notification-option-active");
    $(".notification-list-unread-area").addClass("notification-list-hide");
    $(".notification-list-all-area").removeClass("notification-list-hide");
    notificationController.resetAllLimit();
    notificationController.notificationAction().getAllNotification();
}