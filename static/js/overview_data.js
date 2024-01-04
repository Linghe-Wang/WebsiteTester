document.addEventListener('DOMContentLoaded', function() {

    var ctx = document.getElementById('overviewChart').getContext('2d');
    var stackedBarChart = new Chart(ctx, {
        type: 'bar',
        data: overview_json,
        options: {
            scales: {
                x: { stacked: true },
                y: { stacked: true }
            }
        }
    });

    var ctx = document.getElementById('topProjectsChart').getContext('2d');
    var stackedBarChart = new Chart(ctx, {
        type: 'bar',
        data: top_projects_json,
        options: {
            indexAxis: 'y',
            scales: {
                x: { stacked: true },
                y: { stacked: true }
            }
        }
    });

    var ctx = document.getElementById('topUsersChart').getContext('2d');
    var stackedBarChart = new Chart(ctx, {
        type: 'bar',
        data: top_users_json,
        options: {
            indexAxis: 'y',
            scales: {
                x: { stacked: true },
                y: { stacked: true }
            }
        }
    });
})