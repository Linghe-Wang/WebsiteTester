let windowWidth;
let windowHeight;
let projectChart;
let chartHeight;
let idButton;
let serverURL;
let project_dict;
let loader;
// Chart configuration options
const options = {
    scales: {
        y: {
            beginAtZero: true
        }
    },
    maintainAspectRatio: false,
};

function prevChart(event){
    var currentPos = Number(event.target.parentNode.childNodes[0].value);
    if (currentPos >= 15){
        event.target.parentNode.childNodes[0].value = currentPos - 15;
        var canvas = event.target.parentNode.nextSibling.childNodes[0].getContext('2d');
        const chartInstance = Chart.getChart(canvas);
        chartInstance.data.labels = dates.slice(currentPos-15, currentPos);
        chartInstance.data.datasets[0].data = data.slice(currentPos-15, currentPos);
        chartInstance.update();
    }
}

function nextChart(event){
     var currentPos = Number(event.target.parentNode.childNodes[0].value);
     var pid = event.target.parentNode.childNodes[0].value.textContent;
     var length = project_dict[pid][0].length;
     if (currentPos < (length - 15)){
        event.target.parentNode.childNodes[0].value = currentPos + 15;
        var canvas = event.target.parentNode.nextSibling.childNodes[0].getContext('2d');
        const chartInstance = Chart.getChart(canvas);
        chartInstance.data.labels = project_dict[projectID][0].slice(currentPos+15, currentPos+30);
        chartInstance.data.datasets[0].data = project_dict[projectID][1].slice(currentPos+15, currentPos+30);
        chartInstance.update();
     }
}

function createButton(projectID){
    var buttonContainer = document.createElement('div')
    buttonContainer.className = "button-container";

    var section = (chartHeight-10)/4
    idButton = document.createElement('button');
    idButton.innerText = projectID;
    idButton.style.height = section+"px";
    idButton.value = 0;
    idButton.addEventListener('click',function(){
        sessionStorage.setItem('projectID', projectID);
        window.location.href = "monitor.html";
    });

    var prevButton = document.createElement('button');
    prevButton.innerText = "prev";
    prevButton.style.height = (3*section)+"px";
    prevButton.addEventListener('click',prevChart);

    var nextButton = document.createElement('button');
    nextButton.innerText = "next";
    nextButton.style.height = (3*section)+"px";
    nextButton.addEventListener('click', nextChart);

    buttonContainer.appendChild(idButton);
    buttonContainer.appendChild(prevButton);
    buttonContainer.appendChild(nextButton);

    projectChart.appendChild(buttonContainer);
    document.body.appendChild(projectChart);
    prevButton.style.width = ((idButton.clientWidth)/2) +"px";
    nextButton.style.width = ((idButton.clientWidth)/2) +"px";
}

function createChart(projectID){
    var capsule = document.createElement('div');
    var chartElement = document.createElement('canvas');
    chartElement.innerHTML=" ";
    chartElement.id = projectID;
    chartElement.className = "chart-canvas";
    chartElement.style.height = chartHeight+"px";

    capsule.appendChild(chartElement);
    projectChart.appendChild(capsule);
    chartElement.style.width = (windowWidth - idButton.offsetWidth - 10)+"px";

    var canvas = document.getElementById(projectID).getContext('2d');

    const data1 = {
        labels: project_dict[projectID][0].slice(0, 15),
        datasets: [{
            label: 'Number of Edits',
            data: project_dict[projectID][1].slice(0, 15),
            hoverBackgroundColor: 'rgb(93, 173, 226)'
        }]
    };

    new Chart(canvas, {
        type: 'bar',
        data: data1,
        options: options
    });
}

document.addEventListener('DOMContentLoaded', async function () {
    serverURL = sessionStorage.getItem('serverURL');
    console.log(serverURL);
    sessionStorage.setItem('projectID', "");

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    const head = document.getElementById('head');
    const divider1 = document.getElementById('divider1');
    const button = document.getElementById('goto');
    const divider2 = document.getElementById('divider2');
    const spinner = document.getElementById('spinner');

    button.addEventListener('click', function(){
        window.location.href = "monitor.html";
    })

    const heightOffset = head.offsetHeight + divider1.offsetHeight + button.offsetHeight + divider2.offsetHeight;
    chartHeight = ((windowHeight - heightOffset)/5);
    console.log(head.offsetHeight, divider1.offsetHeight, button.offsetHeight, divider2.offsetHeight);

    project_dict = await retrieveProject();
    document.body.removeChild(spinner);
    console.log(project_dict);
    for(var id in project_dict){
        projectChart = document.createElement('div');
        projectChart.className = "project-chart";
        var this_project = project_dict[id]
        createButton(id);
        createChart(id);
    }
});


async function retrieveProject() {
  try {
       const response = await fetch(serverURL + "/list", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({message: "Give me project overview"}),
       });
      const message = await response.json();
      console.log(message);
      return message.data;
  }
  catch (err){
      console.log(err);
      console.log('failed to fetch');
      return "failed";
  }
};