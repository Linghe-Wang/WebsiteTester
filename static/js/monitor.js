let idx = 0
let metaBox;
let lineBox;
let contentBox;
let currentTex = 0;
let currentIndex = 0
let indexObj = {}

let fileBox
let timeStampBox
let userNameBox

console.log(actions_obj)
console.log(revisions_obj)

let separated = separateByTex(actions_obj)
console.log("Separated: ", separated)

const organizedData = organizeByTex(revisions_obj, actions_obj);
console.log("Organized: ", organizedData);

indexObj = generateIndexObj(actions_obj)

function separateByTex (data) {
    const separatedData = {};
    // Iterate through the original data
    data.forEach(item => {
    const { file, ...rest } = item;

    // If the file is not in the separatedData object, create an array for it
    if (!separatedData[file]) {
        separatedData[file] = [];
    }

    // Add the item to the corresponding file array
    separatedData[file].push({ file, ...rest });
    });

    // Convert the separatedData object values into an array
    const result = Object.values(separatedData);
    return result
    // Log the result
    //    console.log(result);
    }

function generateIndexObj(data) {
  const fileNamesSet = new Set();
  const fileNameObj = {}

  // Iterate through the original data and add unique file names to the Set
  data.forEach(item => {
    fileNamesSet.add(item.file);
  });

  for (const value of fileNamesSet) {
    if (!fileNameObj[value])
    {
        fileNameObj[value] = 0
    }
}

  console.log(fileNameObj)
  // Convert the Set to an array and return it
  return fileNameObj
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

function load_frame(data, revision){
    metaBox.innerHTML = revision[currentTex][indexObj[currentTex]]["file"]+'<br>'+revision[currentTex][indexObj[currentTex]]["username"]+"<br>"+revision[currentTex][indexObj[currentTex]]["timestamp"]
    userNameBox = revision[currentTex][indexObj[currentTex]]["username"]
    contentBox.innerHTML = revision[currentTex][indexObj[currentTex]]["diff_html"]
    let lineNums = revision[currentTex][indexObj[currentTex]]["line_nums"]
    let line_text = ""
    for (var i=0; i< lineNums.length; i++){
        line_text = line_text + lineNums[i] + "<br>";
    }
    lineBox.innerHTML = line_text;
}

function generateButtons(fileNamesArray) {
  const btnGroup = document.querySelector('.btn-group');

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

    if (index === 0) {
      radioInput.checked = true;
      currentTex = label.textContent
    }

    // Append radio input and label to the button group
    btnGroup.appendChild(radioInput);
    btnGroup.appendChild(label);

    label.onclick = function() {
      // Call a custom function when the button is clicked
      handleTabClick(index, label.textContent);
    };
  });

  // Add the flex div
  const flexDiv = document.createElement('div');
  flexDiv.style.flex = '1';
  btnGroup.appendChild(flexDiv);
}

function handleTabClick(index, fileName) {
  // Add your logic here when a button is clicked
  currentIndex = index
  currentTex = fileName
  // re-sets the value of the slider to appropriate index
   // Get the slider element
    var slider = document.getElementById('myRange');
    // Set the new value
    console.log(indexObj)
//    slider.value = indexObj[fileName];
//    alert(indexObj[fileName])
    // Set the new max value
    slider.setAttribute('data-slider-max', organizedData[currentTex].length - 1);
    slider.max = organizedData[currentTex].length - 1;

    var inputEvent = new Event('input', { bubbles: true });
    slider.dispatchEvent(inputEvent);

  load_frame(separated, organizedData)
  // You can perform actions like updating the content based on the clicked button, etc.
}

function organizeByTex(data, fileData) {
  const result = {};

  // Iterate through the data and organize by key
  data.forEach((obj, index) => {
    const fileName = fileData[index].file
    const timestamp = fileData[index].timestamp;
    const username = fileData[index].username;

    // Add timestamp to diff_html and line_nums
    obj.timestamp = timestamp;
    obj.username = username;
    obj.file = fileName;

    if (!result[fileName]) {
      result[fileName] = [];
    }
    result[fileName].push(obj);
  });

  return result;
}

window.addEventListener('load', function() {
    metaBox = document.querySelector('#meta');
//    fileBox = document.querySelector('#file');
//    userNameBox= document.querySelector('#userName');
//    timeStamp= document.querySelector('#timeStamp');
    lineBox = document.querySelector('#displayLines');
    contentBox = document.querySelector('#displayContent');

    // Get the range slider element
    let slider = document.getElementById("myRange");

    // Get the output element where the value will be displayed
    let output = document.getElementById("sliderValue");

    // generates names of the .tex
    const fileNamesArray = getFileNames(actions_obj);
    console.log(fileNamesArray)
    indexArr = Array(fileNamesArray.length).fill(0)
    generateButtons(fileNamesArray);

    //separate data by .tex
    document.querySelector('#prev').addEventListener("click", function(){
        idx = idx - 1;
        indexArr[currentIndex] = indexArr[currentIndex] - 1

        if (indexObj[currentTex] - 1 <= 0)
        {
            alert("This is the start of current file!")
        }
        else{
            indexObj[currentTex] = indexObj[currentTex] - 1
            slider.value= indexObj[currentTex]
        }
        console.log("Current Index: ", indexObj[currentTex])

        load_frame(separated, organizedData)
    })
    document.querySelector('#next').addEventListener("click", function(){
        idx = idx + 1;
        indexArr[currentIndex] = indexArr[currentIndex] + 1


        if (indexObj[currentTex] + 1 >= organizedData[currentTex].length)
        {
            alert("This is the end of current file!")
        }
        else{
            indexObj[currentTex] = indexObj[currentTex] + 1
            slider.value= indexObj[currentTex]
        }
        console.log("Current Index: ", indexObj[currentTex])

//        slider.value= idx
        load_frame(separated, organizedData)
    })
    document.querySelector('#jump').addEventListener("click", function(){
        let jump = document.getElementById("jumpIndex").value;
        jump = parseInt(jump)


        idx = idx + jump;

        if (jump >= organizedData[currentTex].length )
        {
            alert("Please choose a smaller value!")
        }
        else if (jump < 0)
        {
            alert("Please choose a positive value!")
        }
        else{
            indexObj[currentTex] = jump
            slider.value= indexObj[currentTex]
        }
        console.log("Current Index: ", indexObj[currentTex])
//        slider.value= idx
        load_frame(separated, organizedData)
    })
    console.log("here");

    metaBox.innerHTML = separated[currentIndex][0]["file"]+'<br>'+separated[currentIndex][0]["username"]+"<br>"+separated[currentIndex][0]["timestamp"]

    contentBox.innerHTML = revisions_obj[idx]["diff_html"]
    let lineNums = revisions_obj[idx]["line_nums"]
    console.log(idx)
    let index = indexArr[currentIndex]
    console.log(index)

//    metaBox.innerHTML = separated[currentIndex][0]["file"]+'<br>'+separated[currentIndex][0]["username"]+"<br>"+separated[currentIndex][0]["timestamp"]
//    contentBox.innerHTML = revisions_obj[index]["diff_html"]
//    let lineNums = revisions_obj[index]["line_nums"]

    let line_text = ""
    for (var i=0; i< lineNums.length; i++){
        line_text = line_text + lineNums[i] + "<br>";
    }
    console.log(line_text)
    lineBox.innerHTML = line_text;

    // Display the initial value
//    output.innerHTML = slider.value;

    // Add an onchange event listener to the slider
    slider.oninput = function() {
        // Update the value displayed
//        output.innerHTML = this.value;

    // Call your custom function here
    onChangeFunction(this.value);
    };

  // Custom onchange function for slider
  function onChangeFunction(value) {
    let setIndex = parseInt(value)
    idx = setIndex
    console.log(idx)

    indexObj[currentTex] = setIndex

    load_frame(separated, organizedData)
  }
})


