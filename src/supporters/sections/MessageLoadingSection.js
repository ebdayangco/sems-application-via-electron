class MessageLoadingSection{
    constructor(){
    }
    showErrorMessage(title,message,logo=false,autoclose=false){
            
    }
    informMessage(){

    }
    exitScreen(opt){
        $(`.${opt.screen}`).remove();
    }
    backendScreen(opt){
        if(this.current_screen != ''){
            $(this.current_screen).remove();
        }
        this.current_screen = `.${opt['screen-name']}`;
        let animation = ``;
    
        let openedCSS = ``;

        if(opt["animation"]){
            
            if(opt["animation"]["stand-up"]){

                let ctime = opt["animation"]["stand-up"]["length-second"] ? 
                opt["animation"]["stand-up"]["length-second"] : '100';
                let second = opt["animation"]["stand-up"]["second"] ? 
                opt["animation"]["stand-up"]["second"] :'ms';
                let startingdegree = opt["animation"]["stand-up"]["degree"] ? 
                opt["animation"]["stand-up"]["degree"] : '-90deg';

                animation =  `
                transition:${ctime}${second} all;
                transform: rotateZ(${startingdegree});
                perspective: 2300;
                opacity:0;
                left:-100%;`;
                
                openedCSS = `
                .display-backend-screen{
                        left:0;
                        transform: rotateZ(0deg);
                        opacity:1;

                    }
                `;
               
            }

           
            
            
           
        }
        let screen_bg = `rgba(0,0,0,0.7)`;
        if(opt['screen-options']){
            if(opt['screen-options']['background']){
                if(opt['screen-options']['background'] == 'transparent'){
                    screen_bg = `transparent`;
                }
            }
        }
        // let screen_backdrop = opt['screen-options']['backdrop'] ?"backdrop-filter:blur(3px)":"";
        const br = opt['border-radius'] ? "border-radius:9.5px;":"";
        const style = `
            <style>
                .${opt['screen-name']}{
                    position:absolute;
                    top:0;
                    left:0;
                    width:100%;
                    height:100%;
                    background:${screen_bg};
                    overflow:hidden !important;
                    z-index:999999999;
                    ${br}
                    ${animation}
                    backdrop-filter:blur(5px);  
                }
               
                ${openedCSS}

            </style>
        `;

                
        let box = '';
        if(opt['message-box']){
            box = this.chooseMessageBox(opt);
        }else if(opt['loading-box']){
            box = this.chooseLoadingBox(opt);
        }

       

        let onclick = '';
        if(opt['animation']){

            onclick = `$(".${opt['screen-name']}").toggleClass("display-backend-screen")`;
        }else{
            onclick = `$(".${opt['screen-name']}").remove()`;
        }
        const script = `
          <script>
            function onClickbtn(){
                ${onclick};
                if(${opt['registered-user-execute']}){
                    $(".goLoginbtn").click();
                }
            }
            
          </script>
        `;
        // ${opt['after-closed'] ? opt['after-closed']() : ""}
        // const bescreen = opt['animation'] ? "display-backend-screen":"";
        const div = `
        <div class="${opt['screen-name']}">
          ${style}${box}${script}
        </div>`;

        $(opt["container"]).append(div);
        
        setTimeout(function(){
            if(openedCSS != ''){
                $(`.${opt['screen-name']}`).toggleClass("display-backend-screen");
            }
        },1);
       
    }
    chooseLoadingBox(opt){

        let box = null;
        switch(opt['loading-box']['version']){
            case 1 : box = this.loadingBoxV01(opt); break;
            case 2 : box = this.loadingBoxV02(opt); break;
            default: null;
        }

        return box;
    }
    chooseMessageBox(opt){

        let box = null;

        switch(opt['message-box']['version']){
            case 1 : box = this.messageBoxV01(opt); break;
            case 2 : box = this.messageBoxV02(opt); break;
            case 3 : box = this.messageBoxV03(opt); break;
            case 4 : box = this.messageBoxV04(opt); break;
            case 5 : box = this.messageBoxV05(opt); break;
            default: null;
        }

        return box;
    }

    loadingBoxV01(opt){

  
        const style = `
        <style>
            .ldg-box-01{
              position:absolute;
              top:50%;
              left:50%;
              transform:translate(-50%,-50%);
              padding:30px;
              padding-top:50px;
              padding-bottom:50px;
              width:auto;
              height:auto;
            }
  
  
            .ldg-box-01 > * {
              margin: 0;
              padding: 0;
            }
            
            .ldg-box-01 > .loading_container {
              width: 200px;
              height: 200px;
              position: absolute;
              left: 50%;
              top: 40%;
              transform: translate(-50%, -50%);
              border-radius: 150px;
            }
            
            .ldg-box-01 >.loading_container > .loading {
              width: 100%;
              height: 100%;
              border-radius: 150px;
              border-right: 3px solid #fff;
              animation: animate 2s linear infinite;
            }
            
            .ldg-box-01 > h3 {
              color:#fff;
              width:100%;
              margin-top:200px !important;
            }
            
  
            @keyframes animate {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
            
  
        </style>
      `;
  
        const div = `
            <div class="ldg-box-01">
                ${style}
                <div class="loading_container">
                    <div class="loading">
                    </div>
                </div>
                <h3>${opt['loading-box']['message']}</h3>
            </div>`;

        return div;
    }
    loadingBoxV02(opt){
        
        const style = `
            <style>
                // .ldg-box-02{
                //     position:absolute;
                //     top:-100px;
                //     ${opt['loading-box']['left-space'] ? "left:" + opt['loading-box']['left-space'] : ""};
                //     ${opt['loading-box']['bottom-space'] ? "bottom:" + opt['loading-box']['bottom-space'] : ""};
                //     ${opt['loading-box']['right-space'] ? "right:" + opt['loading-box']['right-space'] : ""};
                //     padding:10px;
                //     width:300px;
                //     height:70px;
                //     background:#fff;
                //     border-radius:3px;
                // }
                // .ldg-box-02-entrance{
                //     ${opt['loading-box']['top-space'] ? "top:" + opt['loading-box']['top-space'] : ""};
                // }

            </style>
        `;
        const script = `
               
                <script>
                
                    // ${opt['process'](opt['done-process']())}
                </script>
        `;
        const div = 
        `
        ${style}
        <div class="ldg-box-02"></div>
            ${script}
        `;

     

       return div;

    }

    messageBoxV04(opt){

        const style = `
            <style>

            .msg-box-04{
                position:absolute;
                top:50%;
                left:50%;
                transform:translate(-50%,-50%);
                background:#fff;
                border-radius:3px;
                overflow:hidden;
                padding:10px;
                display:flex;
                flex-direction:column;
                padding:40px;
            }

            .msg-box-04 > .header{
                text-align:center;
                font-size:24px;
                font-weight:700;
                color:#000;
            }

            .msg-box-04 > .body{
              font-size:18px;
              font-weight:200;
              color:rgb(20,20,20);
              padding-top:40px;
              padding-bottom:40px;
            }

           
            </style>
        `;

        const div = `
              
            <div class="msg-box-04">

            ${style}
            
                <div class="header">${opt['message-box']['header']}</div>
                <div class="body">${opt['message-box']['message']}</div>
                <div class="btn btn-danger txt-light w-100" 
                onclick="onClickbtn()">CLOSE</div>
            </div>
        
        `;


        return div;
    }

    messageBoxV03(opt){

        const style =
        `
        <style>
            .msg-box-03{
                position:absolute;
                top:50%;
                left:50%;
                transform:translate(-50%,-50%);
                background:#fff;
                border-radius:3px;
                overflow:hidden;
                padding:10px;
            }
            .msg-box-03 > *{
                height:100%;
            }
            .message-box-image{
                color:lime;
            }
           
            .msg-box-03 > .message-box-message{
                width:100%;
                padding:30px;
                text-align:left;
                margin-bottom:20px;
                font-weight:500;
                font-size:18px;
            }
            .message-box-content{
                padding:10px;
            }
            .message-box-close-btn{
                position:absolute !important;
                right:10px !important;
                top:5px !important;
                color:#000;
                font-size:14px;
            }
            .message-box-image{
                padding:12px;
                padding-right:0px !important;
                padding-top:15px !important;
            }
            .message-box-image i{
                font-size:50px;
            }
            .message-box-content > .message-box-title{
                font-size:25px;
                font-weight:700;
                color:#000;
                padding:5px;
            }
            .message-box-content > .message-box-message{
                font-size:15px;
                padding-left:8px;
            }
        
        </style>`;

        const div = 
        `<div class="msg-box-03 d-flex">
            ${style}
            <div class="message-box-image"><i class="fa fa-check-circle"></i></div>
            <div class="message-box-area">
                <a href="#" class="message-box-close-btn" 
                onclick='onClickbtn()'><i class="fa fa-times"></i></a>
                <div class="message-box-content">
                    <div class="message-box-title">Message Information</div>
                    <div class="message-box-message small">${opt['message-box']['message']}</div>
                </div>
                
               
            </div>
           
            
           
        </div>`;


        return div;

    }
    messageBoxV02(opt){

        const style =
        `
        <style>
            .msg-box-02{
                position:absolute;
                top:50%;
                left:50%;
                transform:translate(-50%,-50%);
                padding:30px;
                width:500px;
                // height:300px;
                background:#fff;
                border-radius:3px;
            }
            .msg-box-02 > .message-box-message-image-title{
                width:100%;
                text-align:center;
                font-size:50px;
            }
            .msg-box-02 > .message-box-message-text-title{
                width:100%;
                text-align:center;
                font-weight:bold;
                font-size:25px;
            }
            .msg-box-02 > .message-box-message{
                width:100%;
                text-align:center;
                margin-top:20px;
                margin-bottom:20px;
            }
            .msg-box-02 > .message-box-close-btn{
               margin-left:53%;
               width:200px;
            }
        
        </style>`;

        const div = 
        `<div class="msg-box-02">
            ${style}
            <div class="message-box-message-image-title"><i class='fa fa-check-circle text-success'></i></div>
            <div class="message-box-message-text-title">${opt['message-box']['title']}</div>
            <div class="message-box-message">${opt['message-box']['message']}</div>
            <a href="#" class="btn btn-success message-box-close-btn" 
            onclick='onClickbtn()'>CLOSE</a>
        </div>`;


        return div;

    }

    messageBoxV01(opt){

        const style = `
          <style>
              .msg-box-01{
                position:absolute;
                top:50%;
                left:50%;
                transform:translate(-50%,-50%);
                padding:30px;
                padding-top:50px;
                padding-bottom:50px;
                width:auto;
                height:auto;
                background:linear-gradient(-220deg, rgba(200,0,0,0.9),rgba(250,0,0,0.7),rgba(204,0,0,0.4),rgba(255,51,52,0.3) 100%);
                ${opt['border-radius'] ? 'border-radius:5px;' :''}
                box-shadow:0px 0px 3px 1px #fff;
                // backdrop-filter:blur(3px);
              }
  
              .msg-box-01 > .msg-box-01-messages > ul.simple-message-ul {
                list-style: none;
                padding: 0;
              }
              .msg-box-01 > .msg-box-01-messages > ul.simple-message-ul > li {
                padding-left: 30px !important;
                font-size:18px;
                padding-bottom:10px;
                color:#fff;
                
              }
              .msg-box-01 > .msg-box-01-messages > ul.simple-message-ul > li:before {
                content:'\\2718';
                display: inline-block;
                margin-left: -1.3em; 
                width: 1.3em;
                font-size:18px;
                font-weight:600;
                color:#fff;
                
              }
              .msg-box-01-close-btn{
                  position:relative;
                  top:20px;
                  left:50%;
                  width:120px;
                  transform:translate(-50%,-50%);
                  background:rgba(250,255,255,1);
                  box-shadow:0px 0px 1px 0.5px #fff;
                  color:rgb(255,0,0);
                  font-weight:800;
                  outline:none !important;
              }
              .msg-box-01-close-btn:hover{
                box-shadow:0px 0px 1px 0.5px #fff;
                outline:none !important;
                color:rgb(255,0,0);
              }
  
          </style>
        `;
  
        let messageOndiv = `<ul class="simple-message-ul">`;
              
        opt['message-box']['messages'].forEach(message=>{
          messageOndiv += `<li>${message}</li>`;
        }); 
  
        messageOndiv += `</ul>`;
  
        const div = `
            <div class="msg-box-01">
              ${style}
              <div class="msg-box-01-messages">${messageOndiv}</div>
              <div class="btn txt-light msg-box-01-close-btn" 
              onclick="onClickbtn()">CLOSE</div>
            </div>
        `;
         
       return div;
    }

    messageBoxV05(opt){

        const style = `
          <style>
              .msg-box-05{
                position:absolute;
                top:50%;
                left:50%;
                transform:translate(-50%,-50%);
                padding:30px;
                padding-top:50px;
                padding-bottom:50px;
                width:auto;
                height:auto;
                background:linear-gradient(-220deg, rgba(200,0,0,0.9),rgba(250,0,0,0.7),rgba(204,0,0,0.4),rgba(255,51,52,0.3) 100%);
                ${opt['border-radius'] ? 'border-radius:5px;' :''}
                box-shadow:0px 0px 3px 1px #fff;
                // backdrop-filter:blur(3px);
              }
  
              .msg-box-05 > .msg-box-05-messages > .message-on-box-05 > ul.simple-message-ul {
                list-style: none;
                padding: 0;
              }
              .msg-box-05 > .msg-box-05-messages > .message-on-box-05 > ul.simple-message-ul > li {
                padding-left: 30px !important;
                font-size:18px;
                padding-bottom:10px;
                color:#fff;
                
              }
              .msg-box-05 > .msg-box-05-messages > .message-on-box-05 > 
              ul.simple-message-ul > li:before {
                content:'\\2718';
                display: inline-block;
                margin-left: -1.3em; 
                width: 1.3em;
                font-size:18px;
                font-weight:600;
                color:#fff;
                
              }
              .msg-box-05-close-btn{
                  position:relative;
                  top:20px;
                  left:50%;
                  width:120px;
                  transform:translate(-50%,-50%);
                  background:rgba(250,255,255,1);
                  box-shadow:0px 0px 1px 0.5px #fff;
                  color:rgb(255,0,0);
                  font-weight:800;
                  outline:none !important;
              }
              .msg-box-05-close-btn:hover{
                box-shadow:0px 0px 1px 0.5px #fff;
                outline:none !important;
                color:rgb(255,0,0);
              }
              .message-on-box-05{
                position:relative;
                top:0;
                left:0;
                margin-bottom:20px;
                width:100%;
              }

              .message-on-box-05-title{
                position:relative;
                top:0;
                left:0;
                margin-bottom:20px;
                width:100%;
                font-size:16px;
                font-weight:700;
                color:#fff;
                text-decoration:underline;
                text-transform:uppercase;
                padding:3px;
              }
  
          </style>
        `;
         let box_content = "";     
        opt['message-box']['messages']['datas'].forEach(r=>{

            let messageOnBox = `<div class="message-on-box-05">
            <div class="message-on-box-05-title">${r['title']}</div>`;      
            let messageOndiv = `<ul class="simple-message-ul">`;
                  
            r['messages'].forEach(message=>{
              messageOndiv += `<li>${message}</li>`;
            }); 
      
            messageOndiv += `</ul>`;
            messageOnBox += `${messageOndiv}</div>`;
            box_content+=messageOnBox;
        });
      
  
        const div = `
            <div class="msg-box-05">
              ${style}
              <div class="msg-box-05-messages">${box_content}</div>
              <div class="btn txt-light msg-box-05-close-btn" 
              onclick="onClickbtn()">CLOSE</div>
            </div>
        `;
         
       return div;
    }

    getObject(){

        return new MessageLoadingSection();
    }


}
const mlsection = new MessageLoadingSection();
module.exports = {
    MessageLoading:mlsection,
    backendScreen:function(opt){
        mlsection.backendScreen(opt);
    }
}
