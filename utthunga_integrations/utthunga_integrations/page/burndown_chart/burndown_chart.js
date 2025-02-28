// HARDCODED VALUES IN THE BURN DOWN CHART 

// frappe.pages['burndown-chart'].on_page_load = function(wrapper) {
//     // Create the page layout
//     var page = frappe.ui.make_app_page({
//     parent: wrapper,title: 'Sprint Burndown Chart',single_column: true
//     });
    
//     // Insert a canvas element into the page for Chart.js to draw the chart
//     $(wrapper).find('.layout-main-section').html('<canvas id="burndownChart" style="height:400px;"></canvas>');
    
//     // Load Chart.js and then render the chart
//     frappe.require(["https://cdn.jsdelivr.net/npm/chart.js"], function() {renderBurndownChart('burndownChart');
//     });
        
//     };
    
//     function renderBurndownChart(chartId) {
//     // Sample Data: Days and Remaining Work (Story Points)
//     var data = {labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Sprint Days
//     datasets: [
//     {
//     label: 'Actual Work Remaining',
//     data: [100, 90, 75, 65, 50, 40, 30, 20, 10, 0], // Work left
//     borderColor: 'red',
//     backgroundColor: 'rgba(255, 0, 0, 0.1)',
//     borderWidth: 2,
//     fill: true,
//     tension: 0.1
//     },
//     {
//     label: 'Ideal Work Remaining',
//     data: [100, 90, 80, 70, 60, 50, 40, 30, 20, 10], // Ideal linear decrease
//     borderColor: 'blue',
//     backgroundColor: 'rgba(0, 0, 255, 0.1)',
//     borderWidth: 2,
//     borderDash: [5, 5],
//     fill: false,
//     tension: 0
//     }
//     ]
//     };
    
//     var config = {
//         type: 'line',
//         data: data,
//         options: {
//             responsive: true,
//             plugins: {
//                 legend: {
//                     position: 'top',
//                 },
//                 title: {
//                     display: true,
//                     text: 'Sprint Burndown Chart'
//                 }
//             },
//             scales: {
//                 x: {
//                     title: {
//                         display: true,
//                         text: 'Day'
//                     }
//                 },
//                 y: {
//                     title: {
//                         display: true,
//                         text: 'Work Remaining'
//                     }
//                 }
//             }
//         }
//     };
    
//     // Get the canvas element and render the chart
//     var ctx = document.getElementById(chartId);
//     if (ctx) {
//         new Chart(ctx, config);
//     }
//     }    
// #######################################################################################################
// BURNDOWN CHART TAKES VALUES FROM A DOCTYPE 

frappe.pages['burndown-chart'].on_page_load = function(wrapper) {
    // Create the page layout
    var page = frappe.ui.make_app_page({
    parent: wrapper,
    title: 'Sprint Burndown Chart',
    single_column: true
    });
    
    // Insert a canvas element into the page for Chart.js to draw the chart
    $(wrapper).find('.layout-main-section').html('<canvas id="burndownChart" style="height:400px;"></canvas>');
    
    // Load Chart.js and then render the chart
    frappe.require(["https://cdn.jsdelivr.net/npm/chart.js"], function() {
        renderBurndownChart('burndownChart');
    });
    
    };
    
    function renderBurndownChart(chartId) {
    frappe.call({
    method: "frappe.client.get_list",
    args: {
    doctype: "Burn Down Chart", // Change this to your Doctype name
    fields: ["estimated_hours", "logged_hours"],
    order_by: "creation asc",
    limit_page_length: 100
    },
    callback: function(response) {
    var data = response.message;
    var labels = [];
    var estimated = [];
    var logged = [];
    
            data.forEach(function(item, index) {
                labels.push('Day ' + (index + 1));  // Using Day number instead of date
                estimated.push(item.estimated_hours);
                logged.push(item.logged_hours);
            });
    
            var chartData = {
                labels: labels,
                datasets: [
                    {
                        label: 'Estimated Hours',
                        data: estimated,
                        borderColor: 'blue',
                        backgroundColor: 'rgba(0, 0, 255, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.1
                    },
                    {
                        label: 'Logged Hours',
                        data: logged,
                        borderColor: 'red',
                        backgroundColor: 'rgba(255, 0, 0, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.1
                    }
                ]
            };
    
            var config = {
                type: 'line',
                data: chartData,
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
                                text: 'Hours'
                            }
                        }
                    }
                }
            };
    
            var ctx = document.getElementById(chartId);
            if (ctx) {
                new Chart(ctx, config);
            }
        }
    });
    
    }    

// ############################################################################################
// frappe.pages['burndown-chart'].on_page_load = function(wrapper) {
//     // Create the page layout
//     var page = frappe.ui.make_app_page({
//     parent: wrapper,
//     title: 'Sprint Burndown Chart',
//     single_column: true
//     });
    
//     // Insert a canvas element into the page for Chart.js to draw the chart
//     $(wrapper).find('.layout-main-section').html('<canvas id="burndownChart" style="height:400px;"></canvas>');
    
//     // Load Chart.js and then render the chart
//     frappe.require(["https://cdn.jsdelivr.net/npm/chart.js"], function() {
//         renderBurndownChart('burndownChart');
//     });
    
//     };
    
//     function renderBurndownChart(chartId) {
//     frappe.call({
//     method: "frappe.client.get_list",
//     args: {
//     doctype: `Timesheet Detail`,
//     fields: ["expected_hours", "hours", "creation"],
//     filters: {
//     "parenttype": "Timesheet" // Ensures it fetches data linked to Timesheet
//     },
//     order_by: "creation asc",
//     limit_page_length: 100
//     },
//     no_cache: 1, // Disable caching to get fresh data
//     callback: function(response) {
//     console.log(response)
//     var data = response.message;
//     var labels = [];
//     var estimated = [];
//     var logged = [];
    
//             data.forEach(function(item, index) {
//                 labels.push('Day ' + (index + 1));
//                 estimated.push(item.expected_hours);
//                 logged.push(item.hours);
//             });
    
//             var chartData = {
//                 labels: labels,
//                 datasets: [
//                     {
//                         label: 'Expected Hours',
//                         data: estimated,
//                         borderColor: 'blue',
//                         backgroundColor: 'rgba(0, 0, 255, 0.1)',
//                         borderWidth: 2,
//                         fill: true,
//                         tension: 0.1
//                     },
//                     {
//                         label: 'Logged Hours',
//                         data: logged,
//                         borderColor: 'red',
//                         backgroundColor: 'rgba(255, 0, 0, 0.1)',
//                         borderWidth: 2,
//                         fill: true,
//                         tension: 0.1
//                     }
//                 ]
//             };
    
//             var config = {
//                 type: 'line',
//                 data: chartData,
//                 options: {
//                     responsive: true,
//                     plugins: {
//                         legend: {
//                             position: 'top',
//                         },
//                         title: {
//                             display: true,
//                             text: 'Sprint Burndown Chart'
//                         }
//                     },
//                     scales: {
//                         x: {
//                             title: {
//                                 display: true,
//                                 text: 'Day'
//                             }
//                         },
//                         y: {
//                             title: {
//                                 display: true,
//                                 text: 'Hours'
//                             }
//                         }
//                     }
//                 }
//             };
    
//             var ctx = document.getElementById(chartId);
//             if (ctx) {
//                 new Chart(ctx, config);
//             }
//         }
//     });
    
//     }
    