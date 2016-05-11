import React      from 'react';
import Card       from '../components/Card.jsx';
import Filter     from '../components/Filter.jsx';
import Menu       from '../components/Menu.jsx';
import TwitchTV   from '../components/TwitchTV.jsx';
import Store      from '../stores/store';
import classNames from 'classnames';
import {
    getAllStreams,
    getFilteredStreams
} from '../utils/twitchService';

import {
    toggleSidebar, toggleTVAction
} from '../actions/actions';


export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this._applyFilter     = this._applyFilter.bind(this);
        this._onSidebarToggle = this._onSidebarToggle.bind(this);
        this._openTV          = this._openTV.bind(this);

        this.state = {
            loading: true,
            numOfCards: 9,
            twitch: {
                streams: []
            }
        }
    }

    componentWillMount() {
        Store.addChangeListener(this._applyFilter, 'filterChanged');
        Store.addChangeListener(this._onSidebarToggle, 'sidebarToggle');
    }

    /**
     * Lifecycle method that will be invoked after initial rendering
     * Fetches all streams (without any filter) and updates current state
     *
     * @method componentDidMount
     */
    componentDidMount() {
        getAllStreams((res) => {
            this.setState({
                twitch: res,
                loading: false
            });
        });
    }

    componentWillUnmount() {
        Store.removeChangeListener(this._applyFilter, 'filterChanged');
        Store.removeChangeListener(this._onSidebarToggle, 'sidebarToggle');
    }

    /**
     * Lifecycle method that will be invoked after initial rendering
     * Fetches all streams (without any filter) and updates current state
     *
     * @method _applyFilter
     * @param {Boolean} loadMore - set to true only when user clicks 'Load more' button
     */
    _applyFilter(loadMore) {
        let filter = Store.getCurrentFilter();
        let numOfCards = loadMore ? this.state.numOfCards + 9 : 9;

        // get streams with current filter
        getFilteredStreams(filter.streamLang, filter.broadcastLang, filter.gameFilter, (res) => {
            this.setState({
                twitch: res,
                numOfCards: numOfCards
            });
        });
    }

    /**
     * Method that will be invoked everytime when Store emit 'sidebarToggle' change
     * Get sidebar state from Store and update current state
     *
     * @method _onSidebarToggle
     */
    _onSidebarToggle() {
        this.setState({
            filterSidebarOpen: Store.getFilterSidebarState(),
            menuSidebarOpen: Store.getMenuSidebarState()
        }); 
    }


    /**
     * Method that will be invoked when user clicks on stream card
     * When method sets current stream it will be automatically passed down to child component - Card
     * After updating current stream open tv pop-up
     *
     * @method _openTV
     * @param {Object} stream - stream which is chosen by user
     */
    _openTV(stream) {
        this.setState({
            tvStream: stream
        }, () => toggleTVAction() );
    }

    /**
     * Method for rendering all cards (streams)
     * If there's no currently live streams then message 'No stream found' will be shown
     * Every card has onClick event which will invoke _openTV method and pass chosen stream to it
     *
     * @method _renderCards
     */
    _renderCards() {
        if(!this.state.twitch.streams.length)
            return(<h1 className="main__no-streams">No streams found</h1>);
        return this.state.twitch.streams.map(function(elem, key) {
            if(key < this.state.numOfCards)
                return(<Card key={key} stream={elem} onClick={() => this._openTV(elem)}/>);
        }, this);
    } 

    render() {

        // apply 'filter-sidebar-open' class or 'menu-sidebar-open' class on cards wrapper depending on opened sidebar
        let cardsWrapperClass = classNames({
            'main__cards-wrapper': true,
            'filter-sidebar-open': this.state.filterSidebarOpen,
            'menu-sidebar-open': this.state.menuSidebarOpen
        });

        // show overlay over Main component if sidebar is open
        let overlayClass = classNames({
            'overlay': this.state.filterSidebarOpen || this.state.menuSidebarOpen
        });

        // apply 'hide' class to filter icon if menu sidebar is open
        let filterIconClass = classNames({
            'sprite sprite-filter': true,
            'hide': this.state.menuSidebarOpen
        });

        // apply 'hide' class to hamburger icon if filter sidebar is open
        let menuIconClass = classNames({
            'main__menu-wrapper': true,
            'hide': this.state.filterSidebarOpen
        });

        // apply 'hide' class to load more button if current number of rendered cards if greater or equal to number of available streams
        // or apply 'hide' class when there's no available streams at all
        let loadMoreClass = classNames({
            'main__load-more-wrapper': true,
            'hide': this.state.twitch.streams.length <= this.state.numOfCards || !this.state.twitch.streams.length
        });

        if(!this.state.loading)
            return(
                <div className="main">
                    
                    <div 
                         className={filterIconClass}
                         onClick={() => toggleSidebar('filter')}>
                    </div>

                    <div
                        className={menuIconClass}
                        onClick={() => toggleSidebar('menu')}>
                        <span className="main__menu-open-icon"></span> 
                    </div>

                    
                    <div className={cardsWrapperClass}>
                        <div className="main__logo">
                            <img src="imgs/logo.png" alt="Logo"/>
                        </div>

                        <div className="main__cards">
                            {this._renderCards()}
                        </div>

                        <div className={loadMoreClass} onClick={() => this._applyFilter(true)}>
                            <span className="main__load-more">LOAD<br/>MORE</span>
                        </div>
                    </div>

                    <div className={overlayClass}></div>

                    <Filter   />
                    <Menu     />
                    <TwitchTV tvStream={this.state.tvStream} />

                </div>
            );
        return(<div></div>);
    }
}