// const GenexpertPagination = require("../../../database/GenexpertPagination");


class Pagination{

    constructor(){
        this.perPage = 0;
        this.totalCount =parseInt(0);
        this.currentPage = parseInt(0);
        this.previousPage = this.currentPage - 1;
        this.nextPage = this.currentPage + 1;
        this.pageCount = Math.ceil(this.totalCount / this.perPage);
        this.offset  = this.currentPage > 1 ? this.previousPage * this.perPage : 0;
        this.sidePages = 4;
        this.pages = false;
        this.start = 0;
        // this.genexpertPagination = new GenexpertPagination();
    }
    
        optionList(perpage,callback){

            var self = this;
                self.genexpertPagination.openDatabase();
                self.genexpertPagination.getTotalCount(function(total){

                    self.totalCount = total;
                
                    let html = ``;

                    for(var x = 0; x<Math.ceil(total/perpage); x++){
                        html+=`<option data-page=${x+1}>${x+1}</option>`;
                    }

                    callback(html);
                    self.genexpertPagination.closeDatabase();


                });


        }


        // events(page,callback){

           
        //     var self = this;

        //     $(`.pagination_view #displayPaginate`).click(function(){
        //         console.log(page);
        //         self.genexpertPagination.openDatabase();
                
        //         $(".loader").css('visibility','visible');
                
        //         self.genexpertPagination.execute(page,self).then((data)=>{

        //             $(".loader").css('visibility','hidden');
        //             callback(data);
        //             self.genexpertPagination.closeDatabase();
        //         });



        //     });

               
            


        // }

       
    }
    module.exports = Pagination;