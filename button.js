document.getElementById('submit-answer').addEventListener('click', function() {
    var selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (selectedAnswer) {
        var map = selectedAnswer.nextElementSibling.textContent;
        if(selectedAnswer.nextElementSibling.id === "ans1"){
            Swal.fire({
                title: "正解！",
                text: map + "です！",
                icon: "success"
            });
        }
        else {
        Swal.fire({
            title: "不正解！",
            text: map + "ではありません！",
            icon: "error"
        });
    }
    }
    else {
        Swal.fire({
            title: "エラー！",
            text: "選択肢を選んでください！",
            icon: "warning"
        });
    }
});