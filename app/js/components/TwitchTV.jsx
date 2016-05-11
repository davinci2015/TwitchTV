import React            from 'react';
import Store            from '../stores/store';
import classNames       from 'classnames';
import {toggleTVAction} from '../actions/actions';

export default class TwitchTV extends React.Component {
    constructor(props) {
        super(props);
        this.state = { openTV: false };
        this._toggleTV = this._toggleTV.bind(this);

        /**
         * TV iframe options property
         * iframe width is 60% of window width
         * iframe height is adjusted to fit 16:9 screen
         *
         * @property options
         * @type {Object}
         */
        this.options = {
            width: window.innerWidth * 0.6 + 'px',
            height: (window.innerWidth * 0.6) * 9/16 + 'px'
        };
       
    }

    componentWillMount() {
        Store.addChangeListener(this._toggleTV, 'TVToggle');
    }

    componentWillUnmount() {
        Store.removeChangeListener(this._toggleTV, 'TVToggle');
    }


    /**
     * Method for toggling twitch TV pop-up.
     * This method will be invoked everytime when Store emit 'TVToggle' change
     *
     * @method _toggleTV
     */
    _toggleTV() {
        this.setState({
            openTV: !this.state.openTV
        }, () => {
            if(this.state.openTV) {
                this.options.channel = this.props.tvStream.channel.name;
                
                // initialize Twitch player if it's not initialized 
                if(!this.player)
                    this.player = new Twitch.Player("twitch-tv", this.options);
                    
                // if Twitch player is already initialized that means that user opened tv pop-up more than once
                // then just change channel name to chosen one and play stream 
                else {
                    this.player.setChannel(this.props.tvStream.channel.name);
                    this.player.play();
                }
            }
        })
    }

    /**
     * Method will be called when user close tv pop-up.
     * Pauses current stream and close pop-up
     *
     * @method _closeTV
     */
    _closeTV() {
        this.player.pause();
        toggleTVAction();
    }


    /**
     * Method for rendering stream info (text and description below iframe)
     * 
     * @method _renderInfo
     */
    _renderInfo() {
        if(this.props.tvStream) {
            return(
                <div className="tv__info">
                    <div className="tv__info--left">
                        <h1 className="tv__game-title">{this.props.tvStream.game}</h1>
                        <div className="sprite sprite-eye-white"></div>
                        <h4 className="tv__views">{this.props.tvStream.viewers}</h4>
                        <h4 className="tv__created-at">{new Date(this.props.tvStream.created_at).toDateString()}</h4>
                    </div>

                    <div className="tv__info--right">
                        <img src={this.props.tvStream.channel.logo} alt="logo"/>
                        <p className="tv__display-name">{this.props.tvStream.channel.display_name}</p>
                    </div>
                </div>
            );
        }
    }
    
    render() {

        let tvClass = classNames({
            'tv': true,
            'tv__pop-in': this.state.openTV
        });

        return(
            <div className={tvClass}>
                
                <div className="tv__logo">
                    <img src="imgs/logo.png" alt="Logo"/>
                </div>
                
                <div className="tv__frame">
                    <div className="close-icon close-icon--tv" onClick={() => this._closeTV()}></div>
                    <div id="twitch-tv"></div>
                    {this._renderInfo()}
                </div>
                
            </div>
        );
    }
}