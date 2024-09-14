class overpass {

    getData(map) {
        const OvServer = "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
        const ovpass = 'nwr["leisure"="park"]'//;nwr["name"="	宮の上公園"];nwr["name"="いおり公園"]'

        return new Promise((resolve, reject) => {
            let LL = { "NW": map.getBounds().getNorthWest(), "SE": map.getBounds().getSouthEast() };
            let maparea = '[bbox:' + LL.SE.lat + ',' + LL.NW.lng + ',' + LL.NW.lat + ',' + LL.SE.lng + '];';
            let query = OvServer + '?data=[out:json][timeout:30]' + maparea + '(' + ovpass + ';);out body;>;out skel qt;'
            const headers = { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' };
            console.log(query)
            fetch(query, { "mode": 'cors', "headers": headers })
                .then((response) => {
                    return response.json()
                })
                .then((osmxml) => {
                    let data = osmtogeojson(osmxml, { flatProperties: true })
                    let json = [];
                    data.features.forEach(element => {
                        let ll = flat2single(element.geometry.coordinates, element.geometry.type)
                        let NM = element.properties.name;
                        json.push({ lat: ll[1], lng: ll[0], name: NM, id: element.properties.id })

                        let NW = ll[0];
                        let SE = ll[1];
                        
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
                            // .setPopup(popup)
                            .addTo(map)
                        });
                        resolve(json);
                })
    
        });

    }

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

