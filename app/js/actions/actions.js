import AppDispatcher from '../dispatcher/dispatcher.js';
import constants     from '../constants/constants.js';

export function applyFilterAction(filter) {
	AppDispatcher.handleViewAction({
        type: constants.APPLY_FILTER,
        filter: filter
	});
}

export function toggleSidebar(sidebar) {
    AppDispatcher.handleViewAction({
        type: constants.TOGGLE_SIDEBAR,
        sidebar: sidebar
    });
}

export function toggleTVAction() {
    AppDispatcher.handleViewAction({
        type: constants.TOGGLE_TV
    });
}
