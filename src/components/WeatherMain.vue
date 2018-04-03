<template>
    <div class="image-background-overlay">
        <div class="cover-container d-flex h-100 p-3 mx-auto flex-column">
            <header class="masthead mb-auto">
                <div class="inner"></div>
            </header>
            <main class="inner cover" role="main">
                <svg width="50%" height="50%" viewBox="0 0 100 100">
                    <image v-bind:href="'../../static/weather-icons/' + currentWeatherIcon" x="0" y="0" height="100" width="100" />
                </svg>
                <h1 class="text-white main-weather" v-if="weatherData">{{ weatherData.conditions.temp }} degrees</h1>
                <p class="text-white small-temp" v-if="weatherData">min: <strong>{{ weatherData.conditions.temp_min }} degree(s)</strong> max: <strong>{{weatherData.conditions.temp_max}} degree(s)</strong></p>
                <p><span class="text-muted">Last Updated: </span> <span class="strong text-white" v-if="lastSyncTime" >{{ lastSyncTime | formatToISODate }}</span><span v-else>I wish i could tell you the weather</span></p>
                <div class="card" v-if="showInput">
                    <div class="card-body p-2" style="text-shadow: none;">
                        <div class="form-group">
                            <label for="locationField" class="form-control-label"><strong>Where are you? <span v-if="locationName.length > 0">: {{locationName}}</span></strong></label>
                            <input type="text" class="form-control" id="locationField" v-model="locationName" placeholder="example: kingston, jm">
                        </div>
                        <div class="row">
                            <div class="col-lg-12">
                                <button class="btn btn-block btn-primary" v-on:click="getWeatherData()">Get Weather</button>
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
                <h2 class="text-white">Quote of the Day</h2>
                <blockquote class="text-white quote-text" v-if="quote">{{ quote }}</blockquote>
                <p class="text-white" v-else>A cool quote will appear here soon...</p>
            </main>
            <footer class="mastfoot mt-auto">
                <div class="row">
                    <div class="col-lg-12">
                        <a class="mr-3 text-white btn" v-on:click="showAboutDialog()">About</a>
                        <a class="text-white btn" v-on:click="showGuessWeatherDialog()">Guess the Weather: Beta</a>
                    </div>
                </div>
            </footer>
        </div>
    </div>
</template>

<script>
    // Created by Simon Neufville <simon@xrscodeworks.com> on March 30 2018 @ 01:05
    // Main weather display

    export default {
        computed: {
            currentWeatherIcon () {
                return this.$store.getters.getCurrentWeatherIcon;
            },
            quote () {
                return this.$store.getters.getQuote;
            },
            lastSyncTime () {
                return this.$store.getters.getLastSync;
            },
            weatherData () {
                return this.$store.getters.getCurrentWeather;
            }
        },
        data() {
            return {
                locationName: '',
                latLng: null,
                showInput: false
            }
        },
        methods: {
            getWeatherData (latLng = null) {
                if (latLng) {
                    this.$store.dispatch('fetchWeatherData', {useName: false, location: null, latLng});
                    return;
                }

                if (this.locationName.length < 1) {
                    this.$notify({
                        group: 'weatherApp',
                        title: 'Unable to get Weather',
                        text: 'Please type a location',
                        type: 'error'
                    });
                    return;
                }
                this.$store.dispatch('fetchWeatherData', {useName: true, location: this.locationName.trim(), latLng: null});
            },
            getQuote () {
                this.$store.dispatch('fetchQuote');
            },
            showAboutDialog () {
                this.$modal.show('dialog', {
                    title: 'About This project',
                    text: `
                        <h5>The following packages were used:</h5>
                        <ul>
                        <li>VueJS</li>
                        <li>VueX</li>
                        <li>VueRouter</li>
                        <li>Moment JS: <br>https://www.npmjs.com/package/moment</li>
                        <li>Vue JS Notifications: <br>https://www.npmjs.com/package/vue-notification</li>
                        <li>Vue JS Modals: <br>https://www.npmjs.com/package/vue-js-modal</li>
                        </ul>
                        <h5>Third-party APIs</h5>
                        <ul>
                        <li>
                        <strong>OpenWeatherMap:</strong> https://openweathermap.org/
                        </li>
                        <li><strong>Quotes: </strong> https://quotes.rest/</li>
                        </ul>
                    `,
                    buttons: [
                        {
                            title: 'Close'
                        }
                    ]
                });
            },
            showGuessWeatherDialog () {
                let self = this;
                this.$modal.show('dialog', {
                    title: 'Guess the Weather',
                    text: `
                    <h4>How to play</h4>
                    <p>It has long been established that some people have the ability to predict the weather. We will now test your ability. This is just for fun. Ready to play?</p>
                    `,
                    buttons: [
                        {
                            title: 'Not today'
                        },
                        {
                            title: 'Lets do it',
                            handler: () => {
                                console.log('Show game screen');
                                self.$modal.hide('dialog');
                                self.$router.push({
                                    name: 'WeatherGame'
                                });
                            }
                        }
                    ]
                })
            }
        },
        mounted() {
            console.log('Component Mounted');
            let self = this;
            this.$getLocation().then(coordinates => {
                console.log(coordinates);
                self.getWeatherData(coordinates);
                if (!coordinates) {
                    self.showInput = true;
                    self.$notify({
                        group: 'weatherApp',
                        title: 'Weather Update',
                        text: 'Something went wrong while trying to get your location. Please enter your location instead',
                        type: 'error'
                    });
                }
            }).catch(err => {
                console.log(err);
                // show field to enter location
                self.showInput = true;
            });

            this.getQuote();
        },
        watch: {
            quote (newVal) {
                console.log(`Changed quote to: ${newVal}`);
            },
            weatherData: {
                deep: true,
                handler (newVal) {
                    console.log(`Weather Data changed to: ${newVal}`);
                }
            }
        }
    }
</script>

<style scoped>
    .main-weather {
        font-size: 5.5em;
    }

    .image-background-overlay {
        background-color: rgba(0, 0, 0, 0.5);
        height: 100%;
        text-shadow: 1px 1px 5px #333333;
        width: 100%;
    }

    .quote-text {
        font-size: 2.0em;
        font-style: italic;
    }

    .small-temp {
        font-size: 2.0em;
    }
</style>
