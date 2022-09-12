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
    // console.log(metadata)
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
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples_array = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filt_samples = samples_array.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = filt_samples[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // Create a variable that filters the metadata array 
    var metadata = data.metadata;
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that holds the first sample in the metadata array
    var metaResult = metadataArray[0];
    // Create a variable that holds the washing frequency
    var washingFreq = parseInt(metaResult.wfreq);

    ////////// 7. Create the yticks for the bar chart.
    var sorted_result = result.sample_values.sort((a, b) => b - a);
    var top_ten = sorted_result.otu_ids;

    // 8. Create the trace for the bar chart. 
    var trace = {
      x: sample_values.slice(0, 10).reverse(),
      y: otu_ids
        .slice(0, 10)
        .map((otuID) => `OTU ${otuID}`)
        .reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: 'h',
    };
    var data = [trace];

    // 9. Create the layout for the bar chart. 
    var layout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Count" },
      yaxis: { title: "ID" }
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", data, layout);



    /////////// Create the trace for the bubble chart.
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        color_scale: "Portland",
      }
    };

    var bubbleData = [trace1];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "" }
    };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);



      
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washingFreq,
        title: { text: "Belly Buutton Wash Frequency" },
        type: "indicator",
        mode: "gauge+number",
        delta: { reference: 10 },
        gauge: {
          axis: { range: [null, 9] },
          bar: { color: "black" },
          steps: [
            { range: [0, 3], color: "rgb(255, 0, 0)" },
            { range: [3, 6], color: "rgb(255, 255, 0)" },
            { range: [6, 9], color: "rgb(0, 255, 0)" },
          ],
        },
      },
    ];



    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 600,
      height: 500,
      margin: { t: 0, b: 0 }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
