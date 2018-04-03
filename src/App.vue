<template>
    <div id="app">
        <div class="image-background"
             v-bind:style="currentBackgroundStyle"
             style="background-size: auto auto; width: 100%;">
            <router-view/>
            <v-dialog name="weatherDialogs" />
            <notifications group="weatherApp" position="top center" />
        </div>
    </div>
</template>

<script>
    export default {
        name: 'WeatherPlus',
        computed: {
            currentBackgroundStyle () {
                return `background-image: url('../static/weather-backgrounds/${this.$store.getters.getCurrentBackground}');`;
            },
            lastError () {
                return this.$store.getters.getLastError;
            }
        },
        data() {
            return {
            }
        },
        watch: {
            lastError (newVal) {
                console.log('last error updated');
                if (newVal['err']) this.$notify({
                    group: 'weatherApp',
                    title: 'Application Error',
                    text: `
                        The following error was encountered: <strong>${newVal['err']}</strong>
                    `,
                    type: 'error'
                });
            }
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        width: 100%;
    }

    h1, h2 {
        font-weight: normal;
    }

    a {
        color: #42b983;
    }

    .image-background {
        text-shadow: #333333;
        height: 100%;
        width: 100%;
    }
</style>
