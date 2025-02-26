frappe.pages['burndown-chart'].on_page_load = function(wrapper) {
    // Create the page layout
    var page = frappe.ui.make_app_page({
    parent: wrapper,title: 'Sprint Burndown Chart',single_column: true
    });
    
    // Insert a canvas element into the page for Chart.js to draw the chart
    $(wrapper).find('.layout-main-section').html('<canvas id="burndownChart" style="height:400px;"></canvas>');
    
    // Load Chart.js and then render the chart
    frappe.require(["https://cdn.jsdelivr.net/npm/chart.js"], function() {renderBurndownChart('burndownChart');
    });
        
    };
    
    function renderBurndownChart(chartId) {
    // Sample Data: Days and Remaining Work (Story Points)
    var data = {labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Sprint Days
    datasets: [
    {
    label: 'Actual Work Remaining',
    data: [100, 90, 75, 65, 50, 40, 30, 20, 10, 0], // Work left
    borderColor: 'red',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderWidth: 2,
    fill: true,
    tension: 0.1
    },
    {
    label: 'Ideal Work Remaining',
    data: [100, 90, 80, 70, 60, 50, 40, 30, 20, 10], // Ideal linear decrease
    borderColor: 'blue',
    backgroundColor: 'rgba(0, 0, 255, 0.1)',
    borderWidth: 2,
    borderDash: [5, 5],
    fill: false,
    tension: 0
    }
    ]
    };
    
    var config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Sprint Burndown Chart'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Day'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Work Remaining'
                    }
                }
            }
        }
    };
    
    // Get the canvas element and render the chart
    var ctx = document.getElementById(chartId);
    if (ctx) {
        new Chart(ctx, config);
    }
    }    