import AppDispatcher  from '../dispatcher/dispatcher';
import constants      from '../constants/constants';
import {EventEmitter} from 'events';

const CHANGE_EVENT = 'change';

let filter = {
    gameFilter: false,
    broadcastLang: '',
    streamLang: ''
};

let sidebar = {
    filter: false,
    menu: false
};

class StoreClass extends EventEmitter {

    emitChange(event) {
        this.emit(event || CHANGE_EVENT);
    }

    addChangeListener(callback, event) {
        this.on(event || CHANGE_EVENT, callback);
    }

    removeChangeListener(callback, event) {
        this.removeListener(event || CHANGE_EVENT, callback);
    }

    getCurrentFilter() {
        return filter;
    }
    
    getFilterSidebarState() {
        return sidebar.filter;
    }

    getMenuSidebarState() {
        return sidebar.menu;
    }
}

const Store = new StoreClass();

AppDispatcher.register((payload) => {
    const action = payload.action;
    switch(action.type) {
        
        case constants.APPLY_FILTER:
            if(action.filter.hasOwnProperty('gameFilter'))
                filter.gameFilter    = action.filter.gameFilter;
            else {
                filter.broadcastLang = action.filter.broadcastLang;
                filter.streamLang    = action.filter.streamLang;
            }
            Store.emitChange('filterChanged');
            break;
        
        case constants.TOGGLE_SIDEBAR:
            if(action.sidebar === 'filter' && !sidebar.menu) {
                sidebar.filter = !sidebar.filter;
                Store.emitChange('filterToggle');
                Store.emitChange('sidebarToggle');
                return;
            }
            else if(action.sidebar === 'menu' && !sidebar.filter) {
                sidebar.menu = !sidebar.menu;
                Store.emitChange('menuToggle');
                Store.emitChange('sidebarToggle');
                return;
            }
            break;
        
        case constants.TOGGLE_TV:
            Store.emitChange('TVToggle');
            break;
        
        default:
            return true;
    }
});

export default Store;