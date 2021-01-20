function buildMetadata(mass) {
    d3.json("bigmeteorite.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired mass number
      var resultArray = metadata.filter(massObj => massObj.name == mass);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#mass-metadata`
      var PANEL = d3.select("#mass-metadata");
  ​
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  ​
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  ​
      
    });
  }
  ​
  ​
  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  ​
    // Use the list of mass names to populate the select options
    d3.json("bigmeteorite.json").then((data) => {
      var massNames = data.names;
  ​
      massNames.forEach((mass) => {
        selector
          .append("option")
          .text(mass)
          .property("value", mass);
      });
  ​
      // Use the first mass from the list to build the initial plots
      var firstmass = massNames[0];
      buildMetadata(firstmass);
    });
  }
  ​
  function optionChanged(newmass) {
    // Fetch new data each time a new mass is selected
    buildMetadata(newmass);
  }
  ​
  // Initialize the dashboard
  init();
  ​
  ​
  //Some Citations
  //Html centering from https://stackoverflow.com/questions/42403629/how-to-align-bootstrap-panel-center-of-a-web-page