let idx = 0
let metaBox;
let lineBox;
let contentBox;

console.log(actions_obj[0])

function load_frame(){
    metaBox.innerHTML = actions_obj[idx]["file"]+'<br>'+actions_obj[idx]["username"]+"<br>"+actions_obj[idx]["timestamp"]

    contentBox.innerHTML = revisions_obj[idx]["diff_html"]

    let lineNums = revisions_obj[idx]["line_nums"]
    for (var i=0; i< lineNums.length; i++){
        lineBox.innertext = lineNums+'<br>'
    }
}

window.addEventListener('load', function() {
    metaBox = document.querySelector('#meta');
    lineBox = document.querySelector('#displayLines');
    contentBox = document.querySelector('#displayContent');

    document.querySelector('#prev').addEventListener("click", function(){
        idx = idx - 1;
        load_frame()
    })
    document.querySelector('#next').addEventListener("click", function(){
        idx = idx + 1;
        load_frame()
    })

    console.log("here");
    metaBox.innerHTML = actions_obj[idx]["file"]+'<br>'+actions_obj[idx]["username"]+"<br>"+actions_obj[idx]["timestamp"]
    contentBox.innerHTML = revisions_obj[idx]["diff_html"]
    let lineNums = revisions_obj[idx]["line_nums"]
    let line_text = ""
    for (var i=0; i< lineNums.length; i++){
        line_text = line_text + lineNums[i] + "\n";
    }
    console.log(line_text)
    lineBox.textContent = line_text;
})
