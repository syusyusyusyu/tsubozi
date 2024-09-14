"use strict";

var qz = new quiz();
var sv = new overpass();

window.onload = function () {

    // initialize leaflet
    var map = new maplibregl.Map({
        container: 'map',
        style: 'https://k-sakanoshita.github.io/community_mapmaker/tiles/osmfj.json', // スタイル
        center: [135.457188, 34.451391], // 座標
        zoom: 15, // ズームレベル
        pitch: 30 // 傾き
    });
    sv.getData(map).then((json) => { qz.setQuiz(json) })
    sv.getData(map).then((json) => { qz.setKumo(json) })
}


