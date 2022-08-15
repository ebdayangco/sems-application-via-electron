
function getLoc(htmlName){
    return `${__dirname}/${htmlName}`;
}

function appendProcess(htmlName,loadto,callback){
    const content = fs.readFileSync(getLoc(htmlName),{encoding:"utf-8"});
    $(loadto).append(content);
   
    callback();
}

function insertAfter(htmlName,loadafter,callback){
    const content = fs.readFileSync(getLoc(htmlName),{encoding:"utf-8"});
    $(content).insertAfter(loadafter);
   
    callback();
}

function insertBefore(htmlName,loadbefore,callback){
    const content = fs.readFileSync(getLoc(htmlName),{encoding:"utf-8"});
    $(content).insertBefore(loadbefore);
    callback();
}

const transactionLoc = `#transaction-frame-area > #transaction-main > 
.transaction-form > .transaction-content-area `;
const genexpertTransactionContent = `${transactionLoc} > .genexpert-content-area`;


insertBefore("titlebar.html",".main-area",function(){
    insertBefore("menu.html",".body-area",function(){
        appendProcess("home.html",".body-area",function(){
            insertAfter("transaction-main.html","#home-frame-area",function(){
                //insertAfter("transaction.html","#transaction-main-frame-area",function(){
                    appendProcess("transaction-filter.html","#transaction-filter-area",function(){
                        appendProcess("genexpert-installation.html",genexpertTransactionContent,function(){
                            appendProcess("genexpert-transfer.html",genexpertTransactionContent,function(){
                                appendProcess("module-replacement.html",genexpertTransactionContent,function(){
                                    appendProcess("xpertcheck-set.html",genexpertTransactionContent,function(){
                                        appendProcess("preventive-maintenance-set.html",genexpertTransactionContent,function(){
                                            appendProcess("genexpert-pullout.html",genexpertTransactionContent,function(){
                                                insertAfter("genexpert-list.html","#transaction-main-frame-area",function(){
                                                    appendProcess("genexpert-filter.html","#genexpert-filter-area",function(){
                                                        insertAfter("module-list.html","#genexpert-frame-area",function(){
                                                            insertAfter("haemonetics-list.html","#modules-frame-area",function(){
                                                                insertAfter("xpertcheck-list.html","#haemonetics-frame-area",function(){
                                                                    appendProcess("xpertcheck-filter.html",".xpertcheck-filter-area",function(){
                                                                        insertAfter("preventive-maintenance-list.html","#xpertcheck-frame-area",function(){
                                                                            appendProcess("preventive-maintenance-filter.html",".pm-filter-area",function(){
                                                                                insertAfter("service-report-list.html","#preventive-maintenance-frame-area",function(){
                                                                                    insertAfter("jotform-list.html","#service-report-frame-area",function(){
                                                                                        // insertAfter("notification-list.html","#jotform-frame-area",function(){
                                                                                            insertAfter("report-list.html","#service-report-frame-area",function(){
                                                                                                insertAfter("dashboard.html","#report-frame-area",function(){
                                                                                                    insertAfter("ledgers.html","#dashboard-frame-area",function(){
                                                                                                        // sub-forms
                                                                                                        insertAfter("genexpert-information.html",".body-area",function(){
                                                                                                            appendProcess("xpertcheck-information.html","#xpertcheck-frame-area",function(){
                                                                                                                appendProcess("preventive-maintenance-information.html","#preventive-maintenance-frame-area",function(){
                                                                                                                    appendProcess("genexpert-edit.html",".genexpert-information-write-area",function(){
                                                                                                                        insertAfter("report-make.html",".body-area",function(){
                                                                                                                            appendProcess("facility-list.html",".body-area",function(){
                                                                                                                                insertAfter("facility-info.html",".body-area",function(){
                                                                                                                                    insertAfter("contact-info.html",".body-area",function(){
                                                                                                                                        insertAfter("assaystatistic-entry.html",".body-area",function(){
                                                                                                                                            insertAfter("peripheral-entry.html",".body-area",function(){
                                                                                                                                                insertAfter("module-information.html",".body-area",function(){
                                                                                                                                                    insertAfter("transaction-info.html",".body-area",function(){
                                                                                                                                                        appendProcess("jotform-information.html","#jotform-frame-area",function(){
                                                                                                                                                            insertAfter("report-option.html",".body-area",function(){
                                                                                                                                                                appendProcess('genexpert-records.html',"#genexpert-record-area",function(){
                                                                                                                                                                    appendProcess('service-report-entry.html',"#service-report-frame-area",function(){
                                                                                                                                                                        appendProcess('module-records.html',"body",function(){
                                                                                                                                                                            appendProcess('pdf-generate-option.html',"#genexpert-frame-area",function(){
                                                                                                                                                                                
                                                                                                                                                                            });
                                                                                                                                                                        });
                                                                                                                                                                    });
                                                                                                                                                                });
                                                                                                                                                            });
                                                                                                                                                        });
                                                                                                                                                    });
                                                                                                                                                });
                                                                                                                                            });
                                                                                                                                        });
                                                                                                                                    });
                                                                                                                                });
                                                                                                                            });
                                                                                                                        });
                                                                                                                    });
                                                                                                                });
                                                                                                            });
                                                                                                        
                                                                                                        });
                                                                                                    });
                                                                                                    
                                                                                                });
                                                                                            });
                                                                                        // });
                                                                                    });
                                                                                });
                                                                            });
                                                                    
                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        });                                                
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });

                //});

            });
        });
    });
});

genexpertInformationPanelSetUp();
addressController.displayAddressList();
engineerController.displayEngineer(".engineer-drop-down",function(){
    installationtypeController.displayInstallationType(".installation-type-drop-down",
    function(){
        modelNumberController.displayModelNumber(".model-number-drop-down",function(){
            userController.displayUsers(".user-drop-down",function(){
                autoCompleteView.autoCompleteLists();
                setDefaults();
                
            });
            
        });
    });
    
    
});

genexpertController.showGenexpertList(true,function(){});
// appUpdaterController.getDatas();