const autocolors = window['chartjs-plugin-autocolors'];
Chart.register(autocolors);

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