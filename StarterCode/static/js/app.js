// function to retrieve/build data from json.
function buildDataTable(sample){
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;

    // filter the data for the object with the targeted sample number
    var target = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = target[0];

    //select the panel on html page
    var panel = d3.select("#sample-metadata");
    //clear the panel
    panel.html("")

    // iterate through with keys and values, add tags
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    }
  )
}
// function used to build the tables on the web page.
function buildWebTables(sample) {

  //variables from the json; the id(key), the values, and the labels.
  d3.json("samples.json").then((data) => {

    var samples = data.samples;
    var targets = samples.filter(sampleObj => sampleObj.id == sample);
    var result = targets[0];

    var sample_values = result.sample_values;
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;

    //bubble chart data and layout
    var bubbleData = [
        {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
          }
        }
      ];

    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30 }
  };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);


    //------------------------------------------------------------------------------------------------------------------------------------------------

    var yticks = otu_ids.slice(0 , 10).map(otuID => `OUT ${otuID}`).reverse(); //reverse is VERY IMPORTANT, otherwise data can be all mixed up.

    //data and layout for the bar chart
    var barChartData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
      }
    ];
    
    var barChartLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {t:30, l:150}
    };

    //create the bar chart
    Plotly.newPlot("bar", barChartData, barChartLayout);
  });
}

//function to initial the dashboard
function initializeDash() {
  // dropdown elements
  var selector = d3.select("#selDataset");

  //list of samples to populate the options
  d3.json("samples.json").then((data) => {
    var names = data.names;

    // iterate through the date for names.
    names.forEach((sample) => {
      selector
      .append("option")
      .text(sample)
      .property("value", sample);
    });

    //using the first name for the plots
    var firstName = names[0];
    buildDataTable(firstName);
    buildWebTables(firstName);
  });
}
// function that uses the other functions to get the data each time there's a new sample and build the table with that.
function optionChanged(newSample) {
  buildDataTable(newSample);
  buildWebTables(newSample);
}


initializeDash();
