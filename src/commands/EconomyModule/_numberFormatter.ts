function millisToMinutesAndSeconds(millis: number) {
    var minutes = Math.floor(millis / 60000);
    var seconds: number = Math.floor(((millis % 60000) / 1000))
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default {
    msToMandS: millisToMinutesAndSeconds,
    numberWithCommas: numberWithCommas
}