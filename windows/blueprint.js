const { BrowserWindow, ipcMain,screen } = require("electron");
const path = require("path");
const { node_modules } = require("./route");

class ApplicationWindow{
    constructor(){}

    setUp(window_options){

        this.window_name = window_options.name;
        this.window_route = 
        window_options.route == undefined ? 
            `${__dirname}/../resources/noroute.html`:
            window_options.route;

        this.window_width = window_options.width == undefined ? 900 : window_options.width;

        this.window_xwidth = window_options.max_width == undefined ? 
        window_options.width : window_options.max_width;

        this.window_swidth = window_options.min_width == undefined ? 
        window_options.width : window_options.min_width;

        this.window_height = window_options.height == undefined ? 600 : window_options.height;
        this.window_xheight = window_options.max_height == undefined ? 
        window_options.height : window_options.max_height;

        this.window_sheight = window_options.min_height == undefined ? 
        window_options.height : window_options.min_height;

        this.window_frame = window_options.frame == undefined ? true : window_options.frame;

        this.window_transparent = window_options.transparent == undefined ? 
        false : window_options.transparent;

        this.window_show = window_options.show == undefined ? 
        false : window_options.show;

        this.window_resizable = window_options.resizable == undefined ? 
        false : window_options.resizable;

        this.window_fullscreen = window_options.fullscreen == undefined ? 
        false : window_options.fullscreen;

        this.window_kiosk = window_options.kiosk == undefined ? 
        false : window_options.kiosk;

        
        this.window_maximizable = window_options.maximizable == undefined ? 
        false : window_options.maximizable;

        this.window_padding_on_screen = window_options.paddingScreen == undefined ?
        90:window_options.paddingScreen;

        this.window_menu = window_options.menu == undefined ?
        false:window_options.menu;

        return this.create();
    }

    create(){

        // let bounds = screen.getPrimaryDisplay().bounds;
        // console.log(bounds);
        // let width = bounds.width - 50;
        // let height = bounds.height - 50;
        const window = new BrowserWindow({
            titleBarStyle:'hidden',
            width:this.window_width,
            maxWidth:this.window_xwidth,
            minWidth:this.window_swidth,
            height:this.window_height,
            maxHeight:this.window_xheight,
            minHeight:this.window_sheight,
            frame:this.window_frame,
            transparent:this.window_transparent,
            show:this.window_show,
            resizable:this.window_resizable,
            fullscreen:this.window_fullscreen,
            kiosk:this.window_kiosk,
            maximizable:this.window_maximizable,
            minimizable:true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
            }
            

            // preload: path.join(__dirname, 'preload.js'),
           
        });

        // window.webContents.openDevTools();
        
        // BrowserWindow.prototype.windowName = this.window_name;
        BrowserWindow.prototype.paddingscreen = this.window_padding_on_screen;
        BrowserWindow.prototype.windowRoute = this.window_route;

       

        // window.on('resize',function(){
        //     window.setSize(this.window_width,this.window_height);
        // });
        // window.on('restore', (e) => {
        //     window.setSize(this.window_width,this.window_height);
        // });
       
        // const { ipcRenderer } = require("electron");
        // ipcRenderer.send("show-dev-tools");
     
        window.webContents.on('dom-ready', () => {

            window.webContents.executeJavaScript(`

                document.addEventListener("keydown", function (e) {
                    if (e.which === 123) {
                       
                    } else if (e.which === 116) {
                        location.reload();
                    }
                    
                })`);

        });

        // ;
        if(!this.window_menu){
            window.setMenu(null);
        }

        
        // window.webContents.setFrameRate(60)
       
        return {window,"name":this.window_name};
    
    }
}

module.exports = ApplicationWindow;