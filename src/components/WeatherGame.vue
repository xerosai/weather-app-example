<template>
    <div class="row h-100">
        <div class="col-lg-12">
            <div class="card bg-light h-100">
                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-12">
                            <h1>
                                Predict the Weather
                            </h1>
                            <p>It has long been established that some people have the ability to predict the weather. We will now test that ability. This is just for fun.</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <p>Current Score: <strong>{{ currentScore }}</strong></p>
                        </div>
                    </div>
                    <div class="row mb-2" id="questionContainer">
                        <div class="col-lg-12">
                            <div class="card bg-light">
                                <div class="card-body p-2">
                                    <h3 class="text-left"><span class="text-muted">Question: </span>What will be the weather for <strong>{{ currentLocation }}</strong>?</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row" id="answersContainer">
                        <div class="col-lg-12">
                            <h4>Answers</h4>
                        </div>
                        <div class="col-lg-4 mb-1" v-for="(answer, index) in weatherGameAnswers" v-bind:key="'answer-' + index">
                            <button
                                class="btn btn-block"
                                v-bind:class="[index === selectedIndex ? 'btn-primary' : 'btn-outline-primary']"
                                v-on:click="setSelectedIndex(index)"
                            >{{ answer.val }}</button>
                        </div>
                    </div>
                    <div class="row" id="submitContainer">
                        <div class="col-lg-12">
                            <button class="btn btn-block btn-primary mt-4" v-on:click="submitAnswer()">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="row">
                        <div class="col-lg-6">
                            <router-link v-bind:to="{ name: 'WeatherMain' }" class="btn btn-block btn-secondary mb-2">< Back to Weather</router-link>
                        </div>
                        <div class="col-lg-6">
                            <button class="btn btn-block btn-warning mb-2" v-on:click="resetGame()">
                                Reset Game
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    // Created by Simon Neufville <simon@xrscodeworks.com> on April 02 2018 @ 15:58
    // Weather Game component
    import {WeatherGameLocations, weatherGameAnswers} from '../constants';
    export default {
        name: 'WeatherGame',
        computed: {
            backgroundLoading () {
                return this.$store.getters.getBackgroundLoading;
            },
            currentScore () {
                return this.$store.getters.getGameCurrentScore;
            },
            currentLocation () {
                return WeatherGameLocations[this.$store.getters.getGameCurrentQuestion] || null;
            },
            gameEnded () {
                return this.$store.getters.getGameEnded;
            },
            gameLastQuestionCorrect () {
                return this.$store.getters.getGameLastQuestionCorrect;
            },
            weatherGameAnswers () {
                return weatherGameAnswers;
            }
        },
        data() {
            return {
                selectedIndex: null
            }
        },
        methods: {
            resetGame () {
                // prompt user
                this.$store.dispatch('resetGameState');
            },
            setSelectedIndex (index) {
                if (index > this.weatherGameAnswers.length) {
                    console.log('Invalid Answer');
                    return;
                }
                console.log(`Selected Index: ${index}`);
                this.selectedIndex = index;
            },
            submitAnswer () {

                if (this.backgroundLoading) {
                    console.log('Operation in progress');
                    this.$notify({
                        group: 'weatherApp',
                        title: 'Oops!',
                        text: 'Please wait before attempting to submit an answer',
                        type: 'warning'
                    });
                    return;
                }

                if (this.selectedIndex < -1) {
                    console.log('Selection Not made');
                    this.$notify({
                        group: 'weatherApp',
                        title: 'Oops!',
                        text: 'Please choose answer below before submitting.',
                        type: 'error'
                    });
                    return;
                }

                console.log(`Submit answer: ${this.selectedIndex}`);
                this.$store.dispatch('fetchWeatherForGame', { answer: this.weatherGameAnswers[this.selectedIndex], location: this.currentLocation });
                this.selectedIndex = null;
            }
        },
        mounted () {
            console.log('Component mounted');
        },
        watch: {
            gameEnded (newVal) {
                if (newVal) this.$notify({
                    group: 'weatherApp',
                    title: 'Game Ended',
                    text: 'Game Finished. Thanks for playing!',
                    type: 'info'
                });
            },
            gameLastQuestionCorrect (newVal) {
                if (newVal !== null) {
                    const notificationType = newVal ? 'success' : 'error';
                    const text = newVal ? 'Correct' : 'Wrong';
                    this.$notify({
                        group: 'weatherApp',
                        title: 'Your answer was: ',
                        text: `<strong>${text}</strong>`,
                        type: notificationType
                    });
                }
            }
        }
    }
</script>

<style scoped>
    .full-height {
        height: 100%;
    }
</style>
