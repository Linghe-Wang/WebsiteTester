const autocolors = window['chartjs-plugin-autocolors'];
Chart.register(autocolors);
let projectBox;
let contributorsBox;

//after load
document.addEventListener('DOMContentLoaded', function() {
    var ctx = document.getElementById('verticalChart').getContext('2d');
    var stackedBarChart = new Chart(ctx, {
        type: 'bar',
        data: dataArray[0],
        options: {
            scales: {
                x: { stacked: true },
                y: { stacked: true }
            }
        }
    });
    var ctx = document.getElementById('horizontalChart1').getContext('2d');
    var stackedBarChart = new Chart(ctx, {
        type: 'bar',
        data: dataArray[1],
        options: {
            indexAxis: 'y',
            scales: {
                x: { stacked: true },
                y: { stacked: true }
            }
        }
    });
    // shows the charts after loading
    projectBox.style.display = ""
    contributorsBox.style.display = ""

    // shows the loaders after loading
    projectLoader.style.display = "none"
    contributorsLoader.style.display = "none"

    var ctx = document.getElementById('horizontalChart2').getContext('2d');
    var stackedBarChart = new Chart(ctx, {
        type: 'bar',
        data: dataArray[2],
        options: {
            indexAxis: 'y',
            scales: {
                x: { stacked: true },
                y: { stacked: true }
            }
        }
    });
})

window.onbeforeunload = function () {
    console.log("Loading Projects")
     projectBox = document.getElementById("verticalChart");
     contributorsBox = document.getElementById("horizontalChart1");
    let projectLoader = document.getElementById("projectLoader");
    let contributorsLoader = document.getElementById("contributorsLoader");

    // hides the charts while loading
    projectBox.style.display = "none"
    contributorsBox.style.display = "none"

    // shows the loaders while loading
    projectLoader.style.display = ""
    contributorsLoader.style.display = ""
    }
