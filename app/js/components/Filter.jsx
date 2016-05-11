import React        from 'react';
import classNames   from 'classnames';
import Store        from '../stores/store';
import {
    applyFilterAction,
    toggleSidebar
} from '../actions/actions';

export default class Filter extends React.Component {
    constructor(props) {
        super(props);
        this.state = { filterOpen: false };
        
        this._onFilterSidebarToggle = this._onFilterSidebarToggle.bind(this);
        this.filter = {
            broadcastLang: {
                set: false,
                language: ''
            },
            streamLang: {
                set: false,
                language: ''
            }
        };
        
    }

    componentWillMount() {
        Store.addChangeListener(this._onFilterSidebarToggle, 'filterToggle');
    }

    componentWillUnmount() {
        Store.removeChangeListener(this._onFilterSidebarToggle, 'filterToggle');
    }

    /**
     * Method for toggling sidebar state.
     * This method will be invoked everytime when Store emit 'filterToggle' change
     *
     * @method _onFilterSidebarToggle
     */
    _onFilterSidebarToggle() {
        this.setState({
            filterOpen: Store.getFilterSidebarState()
        });
    }
    
    /**
     * Method for setting current active filter and pass it to Store singleton object
     *
     * @method _setFilter
     * @param {String} filter - which filter to apply (broadcastLang or streamLang - must be same name as object key)
     * @param {String} lang - language that will be applied to filter ('en', 'de'...)
     */
    _setFilter(filter, lang) {
        this.filter[filter].set = !this.filter[filter].set;
        this.filter[filter].language = lang;
        applyFilterAction(this.filter);
    }

    render() {
        // when user opens filter sidebar apply 'filter__open' class to sidebar wrapper
        let filterClass = classNames({
            'filter': true,
            'filter__open': this.state.filterOpen
        });

        return(
            <div className={filterClass}>

                <div
                    className="close-icon close-icon--filter"
                    onClick={() => toggleSidebar('filter')}>
                </div>

                <div className="filter__content">
                    <div className="filter__option">
                        <span>BROADCAST LANGUAGE ENGLISH</span>
                        <label>
                            <input
                                type="checkbox"
                                className="filter__option-input checkbox"
                                onClick={() => this._setFilter('broadcastLang', 'en')}
                            />
                        </label>
                    </div>

                    <div className="filter__option">
                        <span>STREAM LANGUAGE ENGLISH</span>
                        <label>
                            <input
                                type="checkbox"
                                className="filter__option-input checkbox"
                                onClick={() => this._setFilter('streamLang', 'en')}
                            />
                        </label>
                    </div>
                </div>

            </div>
        );
    }
}