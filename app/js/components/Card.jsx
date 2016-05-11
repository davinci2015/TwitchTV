import React from 'react';

export default class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return(
            <div className="card" onClick={() => this.props.onClick(this.props.stream.channel.name)}>

                <div className="card__top">
                    <div className="card__top-content">
                        <img src={this.props.stream.channel.video_banner || 'imgs/template-fallback.jpg'} alt="template" className="card__top-bg"></img>
                        <img className="card__logo" src={this.props.stream.channel.logo || 'imgs/logo-fallback.jpg'} alt="logo"/>
                        <span className="card__display-name">{this.props.stream.channel.display_name}</span>
                    </div>
                </div>

                <div className="card__center">
                    <img src={this.props.stream.preview.large} alt="Preview"/>
                </div>

                <div className="card__bottom">
                    <div className="card__bottom-info">
                        <h2 className="card__game-title">{this.props.stream.game}</h2>
                        <div className="sprite sprite-eye"></div>
                        <h4 className="card__views">{this.props.stream.viewers}</h4>
                        <h4 className="card__created-at">{new Date(this.props.stream.created_at).toDateString()}</h4>
                    </div>
                </div>
                
            </div>
        );
    }
}