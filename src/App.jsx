import { App, View, f7 } from 'framework7-react';
import { App as cApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import * as Views from './views';
import ReportsPanel from './components/ReportsPanel';
import Toast from './components/Toast';
import Popovers from './components/Popover';
import { ModelProvider, WalkthroughProvider } from './context';
import './index.css';

/*
    CRIOLLO ATOMIZADORES
*/

// Navegacion
const pushState = page => window.history.pushState(null, null, page);

const f7params = {
    name: 'Criollo Atomizadores',
    id: 'com.inta.criolloatm',    
    theme: 'md',
    dialog: {
        buttonOk: 'Aceptar',
        buttonCancel: 'Cancelar'
    },    
    routes: [
        { // Menu principal
            path: '/',
            component: Views.Home,
            options: {
                transition: "f7-cover"        
            }
        },
        { // Menu informativo
            path: '/info/', 
            component: Views.Info,
            on:{pageInit: ()=>pushState("info")},
            options: {
                transition: "f7-cover"        
            }
        },
        { // Seccion acerca de
            path: '/about/',
            component: Views.About,
            on:{pageInit: ()=>pushState("about")},
            options: {
                transition: "f7-cover"        
            }
        },
        { // Seccion de parametros
            path: '/params/',
            component: Views.Params,
            on:{pageInit: ()=>pushState("params")},
            options: {
                transition: "f7-cover"        
            }
        },
        { // Cronometro
            path: '/control/',
            component: Views.Control,
            on:{pageInit: ()=>pushState("control")},
            options: {
                transition: "f7-cover"        
            }
        },
        { // Medicion de velocidad
            path: '/velocity/',
            component: Views.Velocity,
            on:{pageInit: ()=>pushState("velocity")},
            options: {
                transition: "f7-cover"        
            }
        },
        { // Configuracion de arcos
            path: '/arc/:id?',
            component: Views.ArcConfig,
            on:{pageInit: ()=>pushState("arc")},
            options: {
                transition: "f7-cover"        
            }
        },
        { // Listado de configuraciones de arco guardadas
            path: '/arcList/',
            component: Views.ArcList,
            on:{pageInit: ()=>pushState("arcList")},
            options: {
                transition: "f7-cover"        
            }
        },
        { // Cálculo de TRV
            path: '/trv/',
            component: Views.Trv,
            on:{pageInit: ()=>pushState("trv")},
            options: {
                transition: "f7-cover"        
            }
        },
        { // Seguridad y prevencion
            path: '/security/',
            component: Views.Security,
            on:{pageInit: ()=>pushState("security")},
            options: {
                transition: "f7-cover"        
            }
        },
        { // Calculo de insumos
            path: '/supplies/',
            component: Views.Supplies,
            on:{pageInit: ()=>pushState("supplies")},
            options: {
                transition: "f7-cover"        
            }
        },
        { // Lista de insumos
            path: '/suppliesList/',
            component: Views.SuppliesList,
            on:{pageInit: ()=>pushState("suppliesList")},
            options: {
                transition: "f7-cover"        
            }
        },
        { // Lista de reportes
            path: '/reports/',
            component: Views.Reports,
            on:{pageInit: ()=>pushState("reports")},
            options: {
                transition: "f7-cover"        
            }
        },
        { // Detalle de reporte
            path: '/reportDetails/:id',
            component: Views.ReportDetails,
            on:{pageInit: ()=>pushState("reportDetails")},
            options: {
                transition: "f7-cover"        
            }
        }
    ]
};

let exitWatchDog = 0;

if(Capacitor.isNativePlatform())
    cApp.addListener('backButton', () => {
        // Salir en vista principal
        if(f7.view.main.router.url === '/'){
            if(Date.now() - exitWatchDog > 3000){
                Toast('info', 'Presione nuevamente para salir');
                exitWatchDog = Date.now();
            }else{
                try{
                    // variable expuesta en ModelContext.js
                    window.criollomodel.clearForms();
                }catch(err){
                    console.log(err);
                }
                cApp.exitApp();
            }            
        }else{
            f7.view.main.router.back();
        }
    });
else
    window.addEventListener("popstate", () => {    
        f7.view.main.router.back();
    }, false);

const Criollo = () => (
    <App {...f7params}>
        <ModelProvider>
            <WalkthroughProvider>
                <View main url="/" className="app"/>
                <ReportsPanel />
                <Popovers />
            </WalkthroughProvider>
        </ModelProvider>
    </App>
);

export default Criollo;