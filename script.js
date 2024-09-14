"use strict";

// Global Variable
var LL = {};								// 緯度(latitude)と経度(longitude)
// const OvServer = 'https://overpass.openstreetmap.jp/api/interpreter';	// or 'https://overpass-api.de/api/interpreter'
const OvServer = "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
const ovpass = 'nwr["leisure"="park"]'

window.onload = function () {

	// initialize leaflet
	var map = new maplibregl.Map({
		container: 'map',
		style: 'https://k-sakanoshita.github.io/community_mapmaker/tiles/osmfj.json', // スタイル
		center: [135.49453, 34.70429], // 座標
		zoom: 15, // ズームレベル
		pitch: 30 // 傾き
	});

	LL = { "NW": map.getBounds().getNorthWest(), "SE": map.getBounds().getSouthEast() };
	let maparea = '(' + LL.SE.lat + ',' + LL.NW.lng + ',' + LL.NW.lat + ',' + LL.SE.lng + ');';
	let query = OvServer + '?data=[out:json][timeout:30];(' + ovpass + maparea + ');out body;>;out skel qt;'
	const headers = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' };
	console.log(query)
	fetch(query, { "mode": 'cors', "headers": headers })
		.then((response) => {
			return response.json()
		})
		.then((osmxml) => {
			let data = osmtogeojson(osmxml, { flatProperties: true })
			data.features.forEach(element => {
				let ll = flat2single(element.geometry.coordinates, element.geometry.type)

				let NW = ll[0];
				let SE = ll[1];
				let NM = element.properties.name;

				// アイコンの設定
				var icon = document.createElement('div');
				icon.innerHTML = "<img src='kumo.png' style='width: 192px'>";

				// ポップアップの設定
				let popup = new maplibregl.Popup({
					offset: 25, // ポップアップの位置
					closeButton: false, // 閉じるボタンの表示
				}).setText(NM);

				// マーカーの作成
				new maplibregl.Marker({ element: icon })
					.setLngLat([NW, SE])
					.setPopup(popup)
					.addTo(map)
				//L.marker([NW, SE]).bindPopup(NM).addTo(map);
			});
		})
		.catch((error) => {
			console.log(error)
		})
}

function flat2single(cords, type) {  // flat cordsの平均値(Poiの座標計算用)
	let cord;
	const calc_cord = function (cords) {
		let lat = 0, lng = 0, counts = cords.length;
		for (let cord of cords) {
			lat += cord[0];
			lng += cord[1];
		};
		return [lat / counts, lng / counts];
	};
	switch (type) {
		case "Point":
			cord = [cords[0], cords[1]];
			break;
		case "LineString":
			cord = calc_cord(cords);
			break;
		default:
			let lat = 0, lng = 0;
			for (let idx in cords) {
				cord = calc_cord(cords[idx]);
				lat += cord[0];
				lng += cord[1];
			}
			cord = [lat / cords.length, lng / cords.length];
			break;
	};
	return cord;
};
