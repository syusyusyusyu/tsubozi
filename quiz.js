class quiz {
    constructor() {
        this.quizes = [];
        this.makers = {};
        this.answer;
    }

    setQuiz(json) {
        this.quizes = json;
        json.forEach(el => {

            // アイコンの設定
            var icon = document.createElement('div');
            icon.innerHTML = `<img src='kumo.png' style='width: 192px' onclick='qz.selQuiz("${el.id}")'>`;

            // マーカーの作成
            let marker = new maplibregl.Marker({ element: icon })
                .setLngLat([el.lng, el.lat])
                .addTo(map);
            this.makers[el.id] = marker;
        });
        let quizid = parseInt(Math.random() * json.length)
        qz.selQuiz(json[quizid].id);
    }

    selQuiz(id) {
        this.quizes.forEach(el => {
            if (el.id === id) {
                this.answer = id;
                this.makers[id].remove();

                // アイコンの設定
                var icon = document.createElement('div');
                icon.innerHTML = `<img src='ab56091d8087590f.png' style='width: 192px' onclick='qz.selQuiz("${el.id}")'>`;

                // マーカーの作成
                let marker = new maplibregl.Marker({ element: icon })
                    .setLngLat([el.lng, el.lat])
                    .addTo(map);
                this.makers[el.id] = marker;

                map.flyTo({ center: [el.lng, el.lat] });

                ans1.innerHTML = el.name;
                id1.value = el.id;

                let rnd2 = parseInt(Math.random() * this.quizes.length)
                ans2.innerHTML = this.quizes[rnd2].name;
                id2.value = this.quizes[rnd2].id;

                let rnd3 = parseInt(Math.random() * this.quizes.length)
                ans3.innerHTML = this.quizes[rnd3].name;
                id3.value = this.quizes[rnd3].id;

                let rnd4 = parseInt(Math.random() * this.quizes.length)
                ans4.innerHTML = this.quizes[rnd4].name;
                id4.value = this.quizes[rnd4].id;
            }
        })
    }

    chkQuiz(no) {
        let id = document.getElementById("id" + no).value;
        if (id == this.answer) {
            Swal.fire({
                title: "正解！",
                text: "おめでとうございます！",
                icon: "success"
            });
            qz.makers[id].remove();
            qz.quizes.filter(el => el.id !== id);

        } else {
            Swal.fire({
                title: "不正解！",
                text: "残念！",
                icon: "error"
            });
        }
    }
}

