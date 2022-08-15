const customTitlebar = require('custom-electron-titlebar');
const { showAccountDetails } = require('../../accounts/AccountView');
const remote = require("electron").remote;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;
const { ipcRenderer } = remote;
module.exports = {

    mainTitleBar:function(){
 
        const tb = new customTitlebar.Titlebar({
            //#444
            //#969494
            //#333030
            // backgroundColor: customTitlebar.Color.fromHex('#be1e22'),
            // backgroundColor: customTitlebar.Color.fromHex('#1e1e1e'),
            backgroundColor: customTitlebar.Color.fromHex('#950740'),
            maximizable:true,
            overflow:"hidden",
            
            // shadow:true
            
        });
        
        tb.updateTitle("Main");
        
        const menu = new Menu();
        menu.append(new MenuItem({
            label: 'File',
            submenu: [

                {
                    label: 'Generate Blank Asset Excel',
                    click: () => console.log('Click on subitem 1')
                },
                {
                    label: 'Default Report List',
                    click: () => console.log('Click on subitem 1')
                },
                {
                    label: 'Application Screen Shot List',
                    click: () => console.log('Click on subitem 1')
                },
                {
                    label: 'SAP Installation',
                    click: () => {
                        $(".sap-installation-area").addClass("sap-installation-area-show");
                    }
                }
                
            ]
        }));
       
        menu.append(new MenuItem({
            label: 'View',
            submenu: [
                {
                    label: 'Account',
                    click: () =>{
                        showAccountDetails();
                    },
                    accelerator: 'Ctrl+O'
                },
                // {
                //     label: 'Settings',
                //     // click: () =>display_account_view("body"),
                //     // accelerator: 'Ctrl+S'
                // }
            ]
    
        }));

        // menu.append(new MenuItem({
        //     label: 'Settings',
        //     submenu: [
        //         {
        //             label: 'Authority',
        //             click: () => console.log('Click on subitem 1'),
        //             accelerator: 'Ctrl+O'
        //         },
        //         {
        //             label: 'Back-Up Time Set',
        //             click: () => console.log('Click on subitem 1'),
        //             accelerator: 'Ctrl+T'
        //         },
        //         {
        //             label: 'Others',
        //             click: () => console.log('Click on subitem 1'),
        //             accelerator: 'Ctrl+L'
        //         },
        //     ]
    
        // }));

        menu.append(new MenuItem({
            label: 'Feedback',
            submenu: [
                {
                    label: 'Show Comments',
                    click: () => console.log('Click on subitem 1'),
                    accelerator: 'Ctrl+K'
                },
                {
                    label: 'Rate this App',
                    click: () => console.log('Click on subitem 1'),
                    accelerator: 'Ctrl+K'
                },
                {
                    label: 'Something to Admin',
                    click: () => console.log('Click on subitem 1'),
                    accelerator: 'Ctrl+U'
                },
            ]
    
        }));

        menu.append(new MenuItem({
            label: 'Log-Out',
            click: () => {
                
            },
            accelerator: 'Ctrl+X'
    
        }));

        tb.updateMenu(menu);

    },

    genexpertTitleBar:function(){

        const tb = new customTitlebar.Titlebar({
            //#444
            //backgroundColor: customTitlebar.Color.fromHex('#be1e22'),
            backgroundColor: customTitlebar.Color.fromHex('#1e1e1e'),
            maximizable:false,
            overflow:"hidden",
            
            // shadow:true
            
        });
        tb.updateTitle("Genexpert");
        //tb.updateMenu(null);
        const menu = new Menu();

        menu.append(new MenuItem({
            label: 'View',
            submenu: [
                {
                    label: 'Region',
                    click: () => console.log('Click on subitem 1'),
                    accelerator: 'Ctrl+B'
                },
                {
                    label: 'Installation Type',
                    click: () => console.log('Click on subitem 1'),
                    accelerator: 'Ctrl+I'
                }
                ,
                {
                    label: 'Model Number',
                    click: () => console.log('Click on subitem 1'),
                    accelerator: 'Ctrl+F'
                }
                ,
                {
                    label: 'Module',
                    click: () => {console.log('Click on subitem 1')},
                    accelerator: 'Ctrl+M'
                },
                {
                    label: 'Engineer',
                    submenu: 
                    [
                        {
                            label: 'New Entry',
                            click: () => {
                                setSection. hideModalScreen();
                                assetController.showEngineerEntryModal();    
                                setSection.showModalScreen();
                            }
                           
                            

                        },
                        {
                            label: 'List',
                            click: () => {
                                setSection. hideModalScreen();
                                assetController.showEngineerListModal();    
                                setSection.showModalScreen();
                            }
                            
                            

                        }
                    ]
                   
                },
                {
                    label: 'Service Reports',
                    click: () => console.log('Click on subitem 1'),
                    accelerator: 'Ctrl+Q'
                }
            ]
    
        }));

        menu.append(new MenuItem({
            label: 'Excel',
            submenu: [
                {
                    label: 'Upload',
                    submenu: 
                    [
                        {
                            label: 'Genexpert',
                            click: () => console.log('Click on subitem 1'),
                            

                        },
                        {
                            label: 'Service Call',
                            click: () => console.log('Click on subitem 1'),
                            

                        },
                        {
                            label: 'XpertCheck',
                            click: () => console.log('Click on subitem 1'),
                           
                        },
                        {
                            label: 'Preventive Maintenance',
                            click: () => console.log('Click on subitem 1'),
                           

                        },
                        {
                            label: 'Engineer',
                            click: () => console.log('Click on subitem 1'),
                           

                        },
                        {
                            label: 'Region',
                            click: () => console.log('Click on subitem 1'),
                           

                        },
                        {
                            label: 'Model Number',
                            click: () => console.log('Click on subitem 1'),
                           

                        },
                        {
                            label: 'Installation Type',
                            click: () => console.log('Click on subitem 1'),
                           

                        }

                    ]
                   
                },
                {
                    label: 'Generate Format',
                    submenu: 
                    [
                        {
                            label: 'Genexpert',
                            click: () => console.log('Click on subitem 1'),
                            

                        },
                        {
                            label: 'Service Call',
                            click: () => console.log('Click on subitem 1'),
                            

                        },
                        {
                            label: 'XpertCheck',
                            click: () => console.log('Click on subitem 1'),
                           
                        },
                        {
                            label: 'Preventive Maintenance',
                            click: () => console.log('Click on subitem 1'),
                           

                        },
                        {
                            label: 'Engineer',
                            click: () => console.log('Click on subitem 1'),
                           

                        },
                        {
                            label: 'Region',
                            click: () => console.log('Click on subitem 1'),
                           

                        },
                        {
                            label: 'Model Number',
                            click: () => console.log('Click on subitem 1'),
                           

                        },
                        {
                            label: 'Installation Type',
                            click: () => console.log('Click on subitem 1'),
                           

                        }

                    ]
                   
                },
                {
                    label: 'Excel SAP',
                    click: () => {
                     
                        excelSAPUpload();

                       
                    }
                }
               
                
            ]
           
        }));


        menu.append(new MenuItem({
            label: 'Menu',
            submenu: [
                {
                    label: 'Home',
                    click: () => console.log('Click on subitem 1'),
                    accelerator: 'Ctrl+H'
                },
                {
                    label: 'Assets',
                    click: () => console.log('Click on subitem 1'),
                    accelerator: 'Ctrl+A'
                },
                {
                    label: 'Service Call',
                    click: () => console.log('Click on subitem 1'),
                    accelerator: 'Ctrl+S'
                },
                {
                    label: 'XpertCheck',
                    click: () => console.log('Click on subitem 1'),
                    accelerator: 'Ctrl+X'
                },
                {
                    label: 'Preventive Maintenance',
                    click: () => console.log('Click on subitem 1'),
                    accelerator: 'Ctrl+P'
                },
                {
                    label: 'Reports',
                    click: () => console.log('Click on subitem 1'),
                    accelerator: 'Ctrl+R'
                },
                {
                    label: 'Main',
                    click: () => console.log('Click on subitem 1'),
                    
                }
            ]
    
        }));

        menu.append(new MenuItem({
            label: 'Other',
            submenu: [
                {
                    label: 'Open Save Data',
                    click: () => console.log('Click on subitem 1'),
                    accelerator: 'Ctrl+H'
                }
            ]
    
        }));


        tb.updateMenu(menu);
        
        
    }

}




//tb.updateMenu(menu);