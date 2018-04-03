/**
 * Created by Simon Neufville <simon@xrscodeworks.com> on March 29 2018 @ 16:20
 * Main centralized Store
 */

// Imports
import Axios from 'axios';
import Vue from 'vue';
import VueX from 'vuex';

import { PublicAPIConstants, URLConstants, WeatherGameLocations, WeatherIconConstants } from '../constants';

Vue.use(VueX);

// Actions
const actions = {
    // FetchWeatherData: Uses Axios to retrieve weather data based on user's location
    fetchWeatherData: (context, payload = {useName: false, location: 'kingston, jm', latLng: null}) => {
        context.commit('unsetLastError');

        context.commit('setBackgroundLoading', true);

        let searchQuery = '';

        if (payload.useName) {
            searchQuery = `?q=${payload.location}`;
        } else {
            searchQuery = `?lat=${payload.latLng.lat}&lon=${payload.latLng.lng}`;
        }

        searchQuery += `&units=metric&APPID=${PublicAPIConstants.openWeatherKey}`;

        Axios.get(`${URLConstants.openWeatherAPIURL}${searchQuery}`).then(response => response.data).then(data => {

            context.commit('setBackgroundLoading', false);
            console.log(data);
            const conditions = data['main'];

            const weatherArray = data['weather'];

            let iconName = '';
            let bgName = '';

            if (weatherArray.length) {
                const weatherCond = weatherArray[0];
                const conditionId = weatherCond['id'];

                if (conditionId >= 200 && conditionId < 300) {
                    iconName = WeatherIconConstants['thundershowers'];
                    bgName = 'lightning';
                } else if (conditionId >= 300 && conditionId < 500) {
                    iconName = WeatherIconConstants['rain'];
                    bgName = 'rain';
                } else if (conditionId >= 500 && conditionId < 600) {
                    iconName = WeatherIconConstants['showers'];
                    bgName = 'showers';
                } else if (conditionId >= 600 && conditionId < 700) {
                    iconName = WeatherIconConstants['snow'];
                    bgName = 'snow';
                } else if (conditionId >= 700 && conditionId < 800) {
                    iconName = WeatherIconConstants['windy'];
                    bgName = 'windy';
                } else if (conditionId === 800) {
                    iconName = WeatherIconConstants['clear'];
                    bgName = 'sunny';
                } else if (conditionId > 800 && conditionId < 900) {
                    iconName = WeatherIconConstants['partlyCloudy'];
                    bgName = 'cloudy';
                } else {
                    iconName = WeatherIconConstants['clear'];
                    bgName = 'sunny';
                }
            }
            context.commit('setCurrentBackground', `${bgName}.jpg`);
            context.commit('setCurrentWeatherIcon', iconName);

            context.commit('setCurrentWeather', {conditions, weatherArray});
            context.commit('setLastSync', Date.now());
        }).catch(err => {
            context.commit('setBackgroundLoading', false);
            context.commit('setLastError', {err});
        })
    },
    // Fetches weather for the game and also updates 'game' state
    fetchWeatherForGame: (context, payload) => {
        context.commit('unsetLastError');
        context.commit('setGameLastQuestionCorrect', null);

        if (context.getters.getGameCurrentQuestion === WeatherGameLocations.length) {
            context.commit('setLastError', { err: 'Out of questions' });
            console.log('game ended');
            context.commit('setGameEnded', true);
            return;
        }

        if (!payload.hasOwnProperty('answer')) {
            context.commit('setLastError', { err: 'An answer was not chosen'});
            console.log('object does not have answer');
            return;
        }

        const answer = payload['answer'];

        context.commit('setBackgroundLoading', true);

        // get location based on question index
        const location = WeatherGameLocations[context.getters.getGameCurrentQuestion];

        const searchQuery = `?q=${location}&APPID=${PublicAPIConstants.openWeatherKey}`;

        context.commit('setBackgroundLoading', true);

        Axios.get(`${URLConstants.openWeatherAPIURL}${searchQuery}`).then(response => response.data).then(data => {
            context.commit('setBackgroundLoading', false);
            console.log(data);

            const weather = data['weather'];

            if (!weather || !weather.length) {
                context.commit('setLastError', { err: 'Failed to get data' });
                return;
            }

            const currentWeather = weather[0];

            context.state.gameCurrentQuestion += 1;

            let tmpCode = currentWeather['id'];
            let actualCode = 0;

            if (tmpCode >= 200 && tmpCode < 300) {
                actualCode = 200
            } else if (tmpCode >= 300 && tmpCode < 500) {
                actualCode = 300
            } else if (tmpCode >= 500 && tmpCode < 600) {
                actualCode = 500
            } else if (tmpCode >= 600 && tmpCode < 700) {
                actualCode = 600
            } else if (tmpCode >= 700 && tmpCode < 800) {
                actualCode = 700
            } else if (tmpCode === 800) {
                actualCode = 800
            } else if (tmpCode > 800 && tmpCode < 900) {
                actualCode = 801
            } else {
                actualCode = 900;
            }

            if (answer.code !== actualCode) {
                context.commit('setGameLastQuestionCorrect', false);
                return;
            }
            context.commit('setGameLastQuestionCorrect', true);
            context.state.gameCurrentScore += 1;
        }).catch(err => {
            console.log(err);
            context.commit('setBackgroundLoading', false);
            context.commit('setLastError', {err});
        });
    },
    // FetchQuoteOfTheDay: Uses Axios to retrieve a quote of the day
    fetchQuote: context => {
        context.commit('unsetLastError');

        context.commit('setBackgroundLoading', true);

        Axios.get(`${URLConstants.quotesAPIURL}`).then(response => response.data).then(data => {

            context.commit('setBackgroundLoading', false);

            const contents = data['contents'];

            console.log(contents);

            if (!contents) {
                context.commit('setLastError', {err: 'quote not found'});
                return;
            }

            const quotes = contents['quotes'];

            if (!quotes.length) {
                context.commit('setLastError', {err: 'quotes not found'});
                return;
            }

            context.commit('setQuote', quotes[0]['quote']);
        }).catch(err => {
            context.commit('setBackgroundLoading', false);
            context.commit('setLastError', {err});
        })
    },
    // resets all application data and flushes local storage
    resetGameState: context => {
        // Empty Application Data
        context.commit('unsetAppData');
    }
};

// Getters
const getters = {
    getBackgroundLoading: state => {
        return state.backgroundLoading;
    },
    getCurrentBackground: state => {
        return state.currentBackground;
    },
    getGameCurrentQuestion: state => {
        return state.gameCurrentQuestion;
    },
    getCurrentWeather: state => {
        return state.currentWeather;
    },
    getCurrentWeatherIcon: state => {
        return state.currentWeatherIcon;
    },
    getGameCurrentScore: state => {
        return state.gameCurrentScore;
    },
    getGameEnded: state => {
        return state.gameEnded;
    },
    getGameLastQuestionCorrect: state => {
        return state.gameLastQuestionCorrect;
    },
    getLastError: state => {
        return state.lastError;
    },
    getLastSync: state => {
        return state.lastSync;
    },
    getQuote: state => {
        return state.quote;
    }
};

// Mutations
const mutations = {
    setBackgroundLoading: (state, loading) => {
        if (typeof loading === 'boolean') state.backgroundLoading = loading;
    },
    setCurrentBackground: (state, background) => {
        state.currentBackground = background;
    },
    setCurrentWeather: (state, currentWeather) => {
        if (currentWeather) state.currentWeather = currentWeather;
    },
    setCurrentWeatherIcon: (state, icon) => {
        state.currentWeatherIcon = icon;
    },
    setGameEnded: (state, ended) => {
        state.gameEnded = ended;
    },
    setGameLastQuestionCorrect: (state, isCorrect) => {
        state.gameLastQuestionCorrect = isCorrect;
    },
    setLastError: (state, errorObj) => {
        if (errorObj) state.lastError = errorObj;
    },
    setLastSync: (state, time) => {
        state.lastSync = time;
    },
    setQuote: (state, quote) => {
        if (quote) state.quote = quote;
    },
    unsetAppData: state => {
        state.backgroundLoading = false;
        state.currentWeather = null;
        state.currentWeatherIcon = null;
        state.gameCurrentScore = 0;
        state.gameCurrentQuestion = 0;
        state.gameLastQuestionCorrect = null;
        state.gameEnded = false;
        state.lastError = null;
        state.lastSync = null;
    },
    unsetLastError: state => {
        state.lastError = null;
    }
};

// Application State
const state = {
    backgroundLoading: false,
    currentBackground: 'sunny.jpg',
    currentWeather: null,
    currentWeatherIcon: 'clearNightIcon.svg',
    gameCurrentScore: 0,
    gameCurrentScoreDetail: [],
    gameCurrentQuestion: 0,
    gameLastQuestionCorrect: null,
    gameEnded: false,
    lastError: null,
    lastSync: null,
    quote: null,
};

export const store = new VueX.Store({
    actions,
    getters,
    mutations,
    state
});
