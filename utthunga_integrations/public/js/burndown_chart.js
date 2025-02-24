frappe.pages['burndown-chart'].on_page_load = function(wrapper) {
    var page = frappe.ui.make_app_page({
    parent: wrapper,
    title: 'Sprint Burndown Chart',
    single_column: true
    });
    
    // Create a canvas element for the chart
    $(wrapper).find('.layout-main-section').html('<canvas id="burndownChart"></canvas>');
    
    var ctx = document.getElementById('burndownChart').getContext('2d');
    
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // X Axis (Days)
            datasets: [{
                label: 'Actual Work Remaining',
                data: [100, 90, 75, 65, 50, 40, 30, 20, 10, 0], // Y Axis (Actual Work)
                borderColor: 'red',
                fill: false
            },
            {
                label: 'Ideal Work Remaining',
                data: [100, 90, 80, 70, 60, 50, 40, 30, 20, 10], // Y Axis (Ideal Work)
                borderColor: 'blue',
                fill: false,
                borderDash: [5, 5]
            }]
        },
        options: {
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
    });
    
    };