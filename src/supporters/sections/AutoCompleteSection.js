const { getAllSites } = require("../../frontiers/controllers/FacilityController");

class AutoCompleteSection{

    constructor(){}


    setAutoComplete(){
        const autoCompleteInput = $("input[style-input='auto-complete']");
        

        if(autoCompleteInput){
            const parent = autoCompleteInput.parent();
            parent.addClass("makeRed");
            parent.append(`<div class="auto-complete-list">
                <div class="auto-complete-item">Item 1</div>
                <div class="auto-complete-item">Item 2</div>
                <div class="auto-complete-item">Item 3</div>
                <div class="auto-complete-item">Item 4</div>
            </div>`)

        }

    }


    createAutoComplete(inputID,displayID,table){

        

       
        const searchElement = async searchText=>{

            switch(table){

                case "sites":getSite(function(res){

                     let matches = res.filter(element => {

                        if(element['region'] && element['province'] && 
                        element['city'] && element['barangay']){
                            element['complete_address'] = `${element['barangay']},
                            ${element['city']} ${element['province']}, ${element['region']}`;
                        }

                         element['display'] = element['siteName'];
                         element['sub-display'] = element['complete_address'];



                         const regex = new RegExp(`^${searchText}`,'gi');
                        return element['siteName']+"".match(regex);

                     });

                     if(searchText.length === 0){
                            matches = [];

                     }
                     console.log(matches)
                     matches.forEach(mat=>{
    
                        displayID.append(createItem(mat));

                    
                    });

                     
                }); break;

                default:null;
            }
        };

        console.log($(`#${inputID}`).val())

        $(`#${inputID}`).on('input',()=>{
            console.log("hellow?");
            searchElement($(this).val());

        });

        // input.addEventListener('input',()=>searchElement(input.value));

        function createItem(datas){
            datas.forEach(function(data){
                return `<div class="card card-body mb-1">
                <h4 class="text-primary">${data['display']}</h4>
                <small class="text-secondary">${data['sub-display']}</small>`;
            });
        }

        function getSite(callback){

            getAllSites(function(sites){

                let all = JSON.parse(JSON.stringify(sites));
                callback(all);
            });



        }

       
    }

    whenPressEnter(callback,cls = document){
      	
        $(cls).on("keypress",function(event){
            var keycode = (event.keyCode ? event.keyCode : event.which);
                if(keycode == '13'){
                    callback();
                }
        });
    }
    
}
const autocompleteSection = new AutoCompleteSection();
module.exports = autocompleteSection;