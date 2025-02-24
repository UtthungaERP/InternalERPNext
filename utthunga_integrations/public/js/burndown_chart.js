frappe.pages['burndown-chart'].on_page_load = function(wrapper) {
    var page = frappe.ui.make_app_page({
    parent: wrapper,
    title: 'Sprint Burndown Chart', single_column: true
    });
    
    // Add a container for the chart
    $(wrapper).find('.layout-main-section').html('<div id="burndown-chart" style="height: 400px;"></div>');
    
    // Data for the chart
    let data = {
        labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10"],
        datasets: [
            {
                name: "Actual Work Remaining",
                values: [100, 90, 75, 65, 50, 40, 30, 20, 10, 0],
                chartType: 'line'
            },
            {
                name: "Ideal Work Remaining",
                values: [100, 90, 80, 70, 60, 50, 40, 30, 20, 10],
                chartType: 'line'
            }
        ]
    };
    
    // Render the chart using Frappe Charts
    new frappe.Chart("#burndown-chart", {
        title: "Sprint Burndown Chart",
        data: data,
        type: 'line',
        height: 400,
        colors: ['red', 'blue']
    });
    
    }