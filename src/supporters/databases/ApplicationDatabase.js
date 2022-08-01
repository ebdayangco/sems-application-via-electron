const config = require("./mysql_config.json");
const mysql = require('mysql');

class ApplicationDatabase{
    constructor(){

    }
    getConfiguration(){

        const cur = config['current-configuration'];
        const conf = config['configuration'][cur];
        return conf;    

    }

    onConnect(connected){

        const connection = mysql.createConnection(this.getConfiguration());
        connection.connect(function(server_connect_error){
            if(server_connect_error){
                // messageLoadingSection.showErrorMessage("Server Connection Error",server_connect_error.message);
            }else{
                connected(connection);
            }
        
        });
    }

    onQuery(options,callback){
        this.onConnect(function(conn){

            conn.query(options['statement'],options['params'] ? "":options['params'],function(mysql_query_error,results){

                // console.log(options['statement']);
                if(mysql_query_error){
                    
                    if(options['error']){
                        options['error'](mysql_query_error.message);
                    }
                    else{
                        console.log(options['statement'])
                        console.error(mysql_query_error);
                        // showErrorMessage("Database Query Error",mysql_query_error.message);
                    }

                }else{

                    options['results'] ? options['results'](results):'';
                    options['success'] ? options['success']():'';
                   
                }


                let disconnecting = async function(){
                    await conn.end();

                }

                disconnecting().then(callback);

            });

        });
    }
    // onQuery(statement,options){
    //     this.onConnect(function(conn){

    //         async function queryProcess(){

    //             const queryProm = await new Promise(resolve=>{

    //                 conn.query(statement,function(mysql_query_error,results){

    //                     if(mysql_query_error){
                            
    //                         conn.destroy();
                            
    //                         if(options['error']){
    //                             options['error'](mysql_query_error.message);
    //                         }
    //                         else{
    //                             console.error(mysql_query_error);
    //                             // showErrorMessage("Database Query Error",mysql_query_error.message);
    //                         }

    //                     }else{

    //                         options['results'] ? options['results'](results):'';
    //                         options['success'] ? options['success']():'';
    //                         resolve(conn);
    //                     }

    //                 });

    //             });
                
    //             return queryProm;
               
    //         }

    //         queryProcess().then(connecting=>{

    //             options['continue'] ? option['continue'](connecting):connecting.end();
    //         });

            
    //     });
    // }

    onQueries(options){

        let statements = options['statements'];
        let total = statements.length;
        var self = this;
        

        let onProcess = async()=>{

            options['loading-start'] ? options['loading-start']():"";

            let connecting = async()=>{
                return await mysql.createConnection(self.getConfiguration());
            }
            

            statements.forEach((statement,index) => {
                // console.log(statement);
                let process = async()=>{

                    let db = await connecting();
                    await db.query(statement);
                    options['percentage'] ?  options['percentage'](Math.ceil(((index)/total)*100)) :"";
                    await db.end();
                    
                }

                process();

            });

            

        }

           
        onProcess().then(()=>{
            options['loading-end'] ? options['loading-end']():"";
         })  


        
    }
    inquireDatabase(options,callback){
        this.onQuery(options,callback);
    }

    updateDataOnApplication(){
        
    }

    
}
// const appDB = new ApplicationDatabase();
// module.exports = {
//     askDatabase:function(options){
//         appDB.onQuery(options,function(){});
//     },
//     inquireDatabase:function(options,callback){
//         appDB.onQuery(options,callback);
//     }
// }
module.exports = ApplicationDatabase;


