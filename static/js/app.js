// Place url in a constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Load and display the JSON data
d3.json(url).then(data => console.log(data));

// Initialize the dashboard
function init() {
    const dropdownMenu = d3.select("#selDataset");  // Select dropdown menu
    
    // Populate the dropdown with sample names
    d3.json(url).then(data => {
        const names = data.names;  // Get sample names
        names.forEach(id => {
            dropdownMenu.append("option")
                        .text(id)
                        .property("value", id);
        });

        const firstSample = names[0];  // Select the first sample
        updateDashboard(firstSample);  // Update dashboard with the first sample
    });
};

// Update metadata panel
function buildMetadata(sample) {
    d3.json(url).then(data => {
        const metadata = data.metadata.filter(result => result.id == sample)[0];
        const panel = d3.select("#sample-metadata").html("");  // Clear existing metadata

        // Populate metadata panel
        Object.entries(metadata).forEach(([key, value]) => {
            panel.append("h5").text(`${key}: ${value}`);
        });
    });
}

// Generate bar chart
function buildBarChart(sample) {
    d3.json(url).then(data => {
        const sampleData = data.samples.filter(result => result.id == sample)[0];
        const { otu_ids, otu_labels, sample_values } = sampleData;  // Destructure properties

        const trace = {
            x: sample_values.slice(0, 10).reverse(),
            y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        };

        const layout = {};
        Plotly.newPlot("bar", [trace], layout);
    });
}

// Generate bubble chart
function buildBubbleChart(sample) {
    d3.json(url).then(data => {
        const sampleData = data.samples.filter(result => result.id == sample)[0];
        const { otu_ids, otu_labels, sample_values } = sampleData;  // Destructure properties

        const trace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        const layout = { 
            hovermode: "closest", 
            xaxis: { title: "OTU ID" } 
        };

        Plotly.newPlot("bubble", [trace], layout);
    });
}

// Update dashboard based on selected sample
function optionChanged(newSample) {
    updateDashboard(newSample);
}

// Update all dashboard components
function updateDashboard(sample) {
    buildMetadata(sample);
    buildBarChart(sample);
    buildBubbleChart(sample);
    // Add any more chart updates here (e.g., buildGaugeChart(sample))
}

// Initialize dashboard
init();
