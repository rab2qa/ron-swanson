import React, { Component } from 'react';
import axios from 'axios';
import ReactStars from 'react-stars'

import './App.css';

const serverURL = 'http://localhost:3001/';
const numQuotes = 1;

class App extends Component {
    state = {
        quotes: []
    }

    getQuote(filter) {
        axios.get(`${serverURL}v2/quotes/${numQuotes}?filter=${filter}`)
            .then(res => {
                if (res.data) {
                    this.setState({ quotes: res.data });
                }
            });
    }

    updateRating(quote, newRating) {
        const self = this;
        quote.userRating = newRating;
        axios.post(`${serverURL}v2/rating`, {
            quoteID: quote.id,
            rating: newRating
        })
            .then(function (response) {
                if (response.data) {
                    quote.aggregateRating = response.data;
                    self.setState({ quotes: self.state.quotes });
                }
            })
    }

    render() {
        return (
            <div className="panel center">
                <h1>Ron Swanson Quote of the Day</h1>
                <div>
                    <button className="large-button" onClick={() => this.getQuote()}>Get Quote</button>
                </div>
                <div>
                    <button onClick={() => this.getQuote('small')}>Small</button>
                    <button onClick={() => this.getQuote('medium')}>Medium</button>
                    <button onClick={() => this.getQuote('large')}>Large</button>
                </div>
                <ul>
                    {this.state.quotes.map(quote =>
                        <li key={quote.id}>
                            <div className="quote">
                                "{quote.value}"
                            </div>
                            <div className="inline">
                                <ReactStars
                                    count={5}
                                    value={quote.userRating || 0}
                                    onChange={(newRating) => this.updateRating(quote, newRating)}
                                    size={48}
                                    half={false}
                                    color1={'#8e8d8a'}
                                    color2={'#e85a4f'}
                                />
                            </div>
                            { quote.aggregateRating &&
                                <div className="highlight">
                                    <span>Average User Rating </span>
                                    <span className="highlight2">(</span>
                                    <span>{quote.aggregateRating || 'not rated'}</span>
                                    <span className="highlight2">)</span>
                                </div>
                            }
                        </li>
                    )}
                </ul>
            </div>
        );
    }
}

export default App;
