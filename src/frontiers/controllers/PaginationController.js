class PaginationController{
    constructor(){

        this.pageNum = "";
    }
    paginationControl(funcList){
    
        var self = this;
        function onKeyUp(evt){

            const wc = evt['which'];
            
            if(wc === 13){
                
                funcList();
            }


        }
        function onPage(direction="Next"){

          
            const add = direction == "Next" ? 1 : -1;
            let val = parseInt($(self.pageNum).val()) + add;
            if(val <= 0 ){
                val = 1;
            }
            $(self.pageNum).val(val);
            funcList();
        }
  

        return {onKeyUp,onPage};
    }
}
module.exports = PaginationController;