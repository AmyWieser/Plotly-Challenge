function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.sampledata;
      var resultArray = metadata.filter(sampleobject => sampleobject.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-sampledata");
  
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key}: ${value}`);
      });
    });
  }
  
  function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
      var samples = data.samples;
      var resultsArray = samples.filter(sampleobject => sampleobject.id == sample);
      var result = resultsArray[0];
  
      var ids = result.otu_ids;
      var labels = result.otu_labels;
      var values = result.sample_values;
  
      // Build a Bubble Chart
      var Layout_Bubble = {
        title: "Bacteria Cultures",
        margin: { t: 0 },
        hovermode: "nearest",
        xaxis: { title: "OTU ID" },
        margin: { t: 30}
      };
      var Data_Bubble = [
        {
          x: ids,
          y: values,
          text: labels,
          mode: "markers",
          marker: {
            color: ids,
            size: values,
            colorscale: "Earth"
          }
        }
      ];
  
      Plotly.newPlot("bubble", Data_Bubble, Layout_Bubble);
  
      var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      var barData = [
        {
          y: yticks,
          x: sample_values.slice(0, 10).reverse(),
          text: otu_labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h",
        }
      ];
  
      var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: { t: 30, l: 150 }
      };
  
      Plotly.newPlot("bar", barData, barLayout);
    });
  }
  
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
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();
  