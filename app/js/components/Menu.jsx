import React        from 'react';
import classNames   from 'classnames';
import Store        from '../stores/store';

import {
    applyFilterAction,
    toggleSidebar
} from '../actions/actions';

export default class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = { menuOpen: false };
        this._onSidebarToggle = this._onSidebarToggle.bind(this);
    }

    componentWillMount() {
        Store.addChangeListener(this._onSidebarToggle, 'menuToggle');
    }

    componentWillUnmount() {
        Store.removeChangeListener(this._onSidebarToggle, 'menuToggle');
    }

    /**
     * Method for toggling sidebar state.
     * This method will be invoked everytime when Store emit 'menuToggle' change
     *
     * @method _onSidebarToggle
     */
    _onSidebarToggle() {
        this.setState({
            menuOpen: Store.getMenuSidebarState()
        })
    }


    /**
     * Method for rendering games in menu
     * When user click on game filter will be applied
     * 
     * @method _renderGames
     */
    _renderGames() {
        let games = ['League of Legends', 'DOTA 2', 'Hearthstone', 'Counter Strike', 'Call of Duty', 'Minecraft', 'Overwatch', 'Xcom 2', 'Starcraft II'];
        return games.map((elem, key) => {
            return(
                <div key={key} className="menu__option" onClick={() => applyFilterAction({gameFilter: elem})}>
                    <span>{elem.toUpperCase()}</span>
                </div>
            );
        });
    }

    render() {
        // when user opens sidebar apply 'menu__open' class to sidebar wrapper
        let menuClass = classNames({
            'menu': true,
            'menu__open': this.state.menuOpen
        });

        return(
            <div className={menuClass}>
                <div
                    className="close-icon close-icon--menu"
                    onClick={() => toggleSidebar("menu")}>
                </div>

                <div className="menu__content">
                    {this._renderGames()}
                </div>
            </div>
        );
    }
}