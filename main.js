"use strict";

var qz = new quiz();
var sv = new overpass();
var map;

window.onload = function () {

    // initialize leaflet
    map = new maplibregl.Map({
        container: 'map',
        style: 'https://k-sakanoshita.github.io/community_mapmaker/tiles/osmfj.json', // スタイル
        center: [135.457188, 34.451391], // 座標
        zoom: 15, // ズームレベル
        pitch: 30 // 傾き
    });
    sv.getData().then((json) => { qz.setQuiz(json) })
}



