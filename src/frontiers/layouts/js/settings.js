

const default_root = settingJSON['defaults'];

function setDefaults(){
    setDefaultDate();
    setDefaultEngineer();
    watchChanges();
}


function setDefaultDate(){
    const default_date = default_root['date-field'];
    let date_field = $("input[type='date']");
     date_field = date_field.not(`.filter-content-area input[type='date']`);
    if(default_date == 'today'){
        date_field.val(getOnDate());
    }else{
        date_field.val(default_date);
    }

}

function setDefaultEngineer(){

    let engineer_field = $("select.engineer-drop-down");
    engineer_field = engineer_field.not(`.filter-content-area select.engineer-drop-down`);
    const default_engineer = default_root['engineer-id'];
    engineer_field.val(default_engineer);
}

function watchChanges(){
    
    fs.watch(`${__dirname}/../../../supporters/storages/settings.json`,function(){
        setDefaultEngineer();
    });
}

