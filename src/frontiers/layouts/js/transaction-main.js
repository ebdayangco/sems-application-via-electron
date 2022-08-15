function displayTransactionOptionType(div){

    const btn = $(div);

    btn.addClass("frame-control-active").parent("li").siblings().children("a")
    .removeClass("frame-control-active");

    const frame_name = btn.attr("frame-name");

    const framed = $(`#${frame_name}`);

    framed.removeClass("transaction-hide").siblings().addClass("transaction-hide");

    if(frame_name == "transaction-list-frame-area"){
        $(".transaction-list-frame-part").removeClass("transaction-hide");
        $(".add-trans-ul").addClass("move-to-left");
        $(".list-trans-ul").addClass("move-to-right");
    }else{
        $(".transaction-list-frame-part").addClass("transaction-hide");
        $(".add-trans-ul").removeClass("move-to-left");
        $(".list-trans-ul").removeClass("move-to-right");
    }

}