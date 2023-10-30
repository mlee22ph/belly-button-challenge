const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise pending
const dataPromise = d3.json(url);

// Initial global variables
let mainData = [];
let names = [];
let metadata = [];
let samples = [];

const idDropDown = document.getElementById("selDataset");
let selectedID = '940';

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {

    mainData = data;
    createPage(mainData);

});


// Function to fill up Demographic Info box
function populateDemoInfo(meta) {
    let metaText = d3.select("#sample-metadata");
    //metaText.removeChild();// = "";

    for (let key in meta) {
        let row = key+": "+meta[key];
        metaText.append("div").append("strong").text(row);

        console.log(row);
    }
    
}

// Function to populate Test Subject ID No.
function populateSubjectID(data) {
    for (let i=0; i<data.length; i++) {
        let option = document.createElement("option");
        option.setAttribute('value', data[i]);
      
        let optionText = document.createTextNode(data[i]);
        option.appendChild(optionText);
      
        idDropDown.appendChild(option);
    }
    
}

// Event function to catch change in dropdown selection and update the webpage
function optionChanged(id) {
    selectedID = id;

    // Call function to update the chart
    createPage(mainData);
}

// Create a custom filtering function to filter based on selected dropdown "selectedID"
function selectSubjectID(sample) {
    return sample.id === selectedID;
}

function selectMetaID(sample) {
    return sample.id == parseInt(selectedID);
}

// Create Bar Chart for top 10 OTU for selected ID
function createBarChart(selectedSample) {
    // Assemble data for bar plot
    let sampleLabels = selectedSample.otu_ids.slice(0, 10).reverse();
    let sampleValues = selectedSample.sample_values.slice(0, 10).reverse();
    let sampleOtuLabels = selectedSample.otu_labels.slice(0, 10).reverse();
    console.log("otu_ids: ", sampleLabels);
    console.log("sample_values: ", sampleValues);
    console.log("otu_labels: ", sampleOtuLabels);

    // Trace 
    let trace1 = {
        x: sampleValues,
        y: sampleLabels.map(object => "OTU "+object),
        text:sampleOtuLabels,
        type: "bar",
        orientation: "h"
    };

    // Data trace array
    let traceData = [trace1];

    // Apply title to the layout
    let layout = {
    //title: "Popular Roman gods search results"
    margin: {
        l:100,
        t: 20,
        pad: 10
      }
    };

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", traceData, layout);
}

// Create bubble chart for all sample OTU in selected ID
function createBubbleChart(selectedSample) {
    // Assemble data for bar plot
    let sampleOTUID = selectedSample.otu_ids;
    let sampleValues = selectedSample.sample_values;
    let sampleOtuLabels = selectedSample.otu_labels.slice(0, 10).reverse();
    console.log("otu_ids: ", sampleOTUID);
    console.log("sample_values: ", sampleValues);
    console.log("otu_labels: ", sampleOtuLabels);

    // Trace 
    let trace1 = {
        x: sampleOTUID,
        y: sampleValues,
        text:sampleOtuLabels,
        mode: "markers",
        marker: {
            size: sampleValues,
            color: sampleOTUID
        }
    };

    // Data trace array
    let traceData = [trace1];

    // Apply title to the layout
    let layout = {
        showlegend: false,
        //title: 
        margin: {
            l:100,
            t: 0,
            pad: 10
          }
        
        };

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bubble", traceData, layout);
}

function createGauge() {
    var data = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: 0,
            title: { text: "Scrubs per Week" },
            gauge: { 
                borderwidth: 0,
                axis: { visible: true, range: [0, 9] },
                steps: [
                    { range: [0, 1], color: "#f7f2ec", text: "0-1" },
                    { range: [1, 2], color: "#f3f0e5", name: "1-2" },
                    { range: [2, 3], color: "#e9e7c9" },
                    { range: [3, 4], color: "#e5e9b0" },
                    { range: [4, 5], color: "#d5e595" },
                    { range: [5, 6], color: "#b7cd8b" },
                    { range: [6, 7], color: "#87c080" },
                    { range: [7, 8], color: "#85bc8b" },
                    { range: [8, 9], color: "#80b586" }
                ],

            },
            type: "indicator",
            mode: "gauge+number"

        }
    ];
    
    var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', data, layout);
}


// Create initial page
function createPage(data) {
    // Save JSON data in lists
    names = data.names;
    metadata = data.metadata;
    samples = data.samples;

    console.log("names: ", names);
    console.log("metadata: ", metadata);
    console.log("samples: ", samples);
   
    // Populate dropdown list
    populateSubjectID(names);

    // populate Demographic Info
    let selectedMeta = metadata.filter(selectMetaID);
    console.log("selectedMeta: ",selectedMeta);
    populateDemoInfo(selectedMeta[0]);
 
    // filter() uses the custom function as its argument
    let selectedSample = samples.filter(selectSubjectID);
    console.log("selectedSample: ", selectedSample);

    // Plot bar chart
    createBarChart(selectedSample[0]);

    // Plot bubble chart
    createBubbleChart(selectedSample[0]);

    // Plot gauge
    createGauge();
}

