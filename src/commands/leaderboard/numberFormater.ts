// Not my code 
// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
// Luv you stack overflow <3


function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function millisToMinutesAndSeconds(millis: number) {
    var minutes = Math.floor(millis / 60000);
    var seconds: number = Math.floor(((millis % 60000) / 1000))
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

export default {
    numberWithCommas: numberWithCommas,
    msToMandS: millisToMinutesAndSeconds
}