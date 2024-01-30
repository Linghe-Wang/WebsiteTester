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
function getFileNames(data) {
  const fileNamesSet = new Set();

  // Iterate through the original data and add unique file names to the Set
  data.forEach(item => {
    fileNamesSet.add(item.file);
  });

  // Convert the Set to an array and return it
  return Array.from(fileNamesSet);
}
function generateButtons(fileNamesArray) {
  const btnGroup = document.querySelector('.fileButtons');

  // Clear existing buttons
  while (btnGroup.firstChild) {
    btnGroup.removeChild(btnGroup.firstChild);
  }

  // Create and append buttons based on the file names array
  fileNamesArray.forEach((fileName, index) => {
    const radioId = `btnradio${index + 1}`;

    // Create radio input
    const radioInput = document.createElement('input');
    radioInput.type = 'radio';
    radioInput.className = 'btn-check';
    radioInput.name = 'btnradio';
    radioInput.id = radioId;
    radioInput.autocomplete = 'off';

    // Create label
    const label = document.createElement('label');
    label.className = 'btn btn-outline-primary rounded';
    label.setAttribute('for', radioId);
    label.textContent = `${fileName}`;

    // Check the radio button based on the condition
    if (actions_obj[idx]["file"] == fileName) {
      radioInput.checked = true;
    }

    // Add a click event listener to prevent default behavior
    radioInput.addEventListener('click', function(event) {
      event.preventDefault();
    });

    // Append radio input and label to the button group
    btnGroup.appendChild(radioInput);
    btnGroup.appendChild(label);
  });

  // Add the flex div
  const flexDiv = document.createElement('div');
  flexDiv.style.flex = '1';
  btnGroup.appendChild(flexDiv);
}

window.addEventListener('load', function() {
    metaBox = document.querySelector('#meta');
    lineBox = document.querySelector('#displayLines');
    contentBox = document.querySelector('#displayContent');
    let slider = document.getElementById("myRange");

    // Get the output element where the value will be displayed
    let output = document.getElementById("sliderValue");

    // generates names of the .tex
    const fileNamesArray = getFileNames(actions_obj);
    console.log(fileNamesArray)
    generateButtons(fileNamesArray);

    document.querySelector('#prev').addEventListener("click", function(){
    if (idx  >0)
    {
        idx = idx - 1;
        load_frame()
        slider.value = idx
        generateButtons(fileNamesArray);
        }

    })
    document.querySelector('#next').addEventListener("click", function(){
        if (idx  < 500)
        {
            idx = idx + 1;
            load_frame()
            slider.value = idx
            generateButtons(fileNamesArray);
        }
    })
    document.querySelector('#jump').addEventListener("click", function(){
        let jump = document.getElementById("jumpIndex").value;
        jump = parseInt(jump)

        if (jump > 500 )
        {
            alert("Please choose a smaller value!")
        }
        else if (jump < 0)
        {
            alert("Please choose a positive value!")
        }
        else{
            idx = jump
            slider.value= idx
            generateButtons(fileNamesArray);
        }
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

    // slider
    slider.oninput = function() {
    onChangeFunction(this.value);
    };

    // Custom onchange function for slider
    function onChangeFunction(value) {
        let setIndex = parseInt(value)
        idx = setIndex
        console.log(idx)
        // generate a new button group
        generateButtons(fileNamesArray);
        load_frame()
  }
})