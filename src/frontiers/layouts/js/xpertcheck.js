const xpertcheckController = require("../../controllers/XpertcheckController");

xpertcheckController.showList({'show-load':true});

function xpertcheckValueToField(div){

    const main = $(div);
    const current_val = main.html();
    const parent = main.parent();
    const field = main.data("field");

    if(field == "text" || field == "date"){

        item=`<input type="${field}" id="${main.data('id')}" 
        value="${current_val}" onblur="xpertcheckFieldToValue(this)" 
        data-id="${main.data('id')}"
        class="genexpert-info-field" data-field="${field}">`;
        parent.html(item);
        parent.children().trigger('focus');

    }else if(field == "select"){

        let item=`<select class="${main.data('main-class')} 
        xpertcheck-info-field" 
        onblur="xpertcheckFieldToValue(this)" id="${main.data('id')}" 
        data-id="${main.data('id')}"
        data-main-class="${main.data('main-class')}" 
        data-field="select"></select>`;
        parent.html(item);
        parent.children().trigger('focus');
        const content = $(`.${main.data('main-class')}`).html();
        $(`#${main.data('id')}`).html(content);

        console.log(main.data("select-id"));
        $(`#${main.data('id')}`).val(main.data("select-id"));
    }

}

function xpertcheckFieldToValue(div){

    const main = $(div);
    const parent = main.parent();
    const field = main.data("field");
    const present_value = field == "select"? 
    main.children("option:selected").text():main.val();

    const present_value_id = field == "select"? 
    main.children("option:selected").val():main.val();


    const prev = `<a href="#" onclick="xpertcheckValueToField(this)" 
    data-main-class="${main.data('main-class')}" id="${main.data('id')}"
    data-field="${field}" data-id="${main.data('id')}" data-select-id="${present_value_id}" 
    class="xpertcheck-info-link">${present_value == ""?"N/A":present_value}</a>`;

    parent.html(prev);
   
    if(field == "select"){
        parent.children("a").data("select-id",main.val());
    }

}