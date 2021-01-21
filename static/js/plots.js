//Declare meteor and give it a path so that the flask can later find the json file
var meteor = "/static/data/bigmeteorite.json"
function buildMetadata(mass) {
  d3.json(meteor).then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired mass number
    var resultArray = metadata.filter(Mass => Mass.name == mass);
    var result = resultArray[0];
    var PANEL = d3.select("#mass-metadata");
    // clear any existing results
    PANEL.html("");
    //Append the input json so the results are capitalized
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}
function init() {
  // Use seldataset for a refernce to the dropdown
  var selector = d3.select("#selDataset");
  // Use the list of mass names to populate the select options
  d3.json(meteor).then((data) => {
    var massNames = data.names;
    massNames.forEach((mass) => {
      selector
        .append("option")
        .text(mass)
        .property("value", mass);
    });
    // Use the first mass from the list to build the initial plots
    var firstmass = massNames[0];
    buildMetadata(firstmass);
  });
}
    // Append so that new output is generated for the selected 
function optionChanged(newmass) {buildMetadata(newmass);}
// Init
init();
//Some Citations
//Html centering from https://stackoverflow.com/questions/42403629/how-to-align-bootstrap-panel-center-of-a-web-page
//Styling from https://getbootstrap.com/docs/3.3/getting-started/