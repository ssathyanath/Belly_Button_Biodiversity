function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;

    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()} : ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // 3. Create a variable that holds the samples array. 
    var sampledata = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = sampledata.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    otuIds = result.otu_ids;
    otuLabels = result.otu_labels;
    sampleValues = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    topTenIDs = otuIds.slice(0,10);
    var yticks = topTenIDs.map(a => ("OTU" + a)).reverse();
    topTenSamples = sampleValues.slice(0,10).reverse();
    var xticks = topTenSamples;
    topTenLabels = otuLabels.slice(0,10).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = {
      x: xticks,
      y: yticks,
      type: "bar",
      orientation: 'h',
      text: topTenLabels
    };

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: {
        text: '<b>Top 10 Bacteria Cultures Found</b>',
        font: {
          family: 'Courier New, monospace',
          size: 22
        }
      }
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout);
    
    // Create Bubble Chart
    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x:otuIds,
      y:sampleValues,
      mode:"markers",
      text: otuLabels,
      hovertemplate: '( %{x}, %{y} )<br> %{text}<extra></extra>', 
      marker: {
        color:otuIds,
        colorscale: 'Earth',
        size:sampleValues
      }
    };
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {
        text: '<b>Bacteria Cultuers per Sample</b>',
        font: {
          family: 'Courier New, monospace',
          size: 22
        }
      },
      xaxis: {title:"OTU ID"},
      showlegend: false,
      height: 600,
      width: 1200
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", [bubbleData], bubbleLayout);

    // Create Gauge Chart 
    // 4. Create the trace for the gauge chart.
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    wfreq = result.wfreq;
    console.log(wfreq)
    var gaugeData = {
      value:wfreq,
      type: "indicator",
      mode:"gauge+number",
      title: { text: "Scrubs per Week" },
      gauge: {
        axis: { range: [0,10],tickvals: [0, 2, 4, 6, 8, 10]},
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "green" },
        ]
      }
    };
  
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: {
        text: '<b>Belly Button Washing Frequency</b>',
        font: {
          family: 'Courier New, monospace',
          size: 22
        }
      },
      height: 400
    }

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", [gaugeData], gaugeLayout);
  });
}