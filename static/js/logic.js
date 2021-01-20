// Resolves CORS error:  https://web.dev/cross-origin-resource-sharing/
// var url = fetch("http://127.0.0.1:5000/api/v1.0/bubbles/allow-cors", {mode:'cors'});
​
var url = "http://127.0.0.1:5000/api/v1.0/bubbles";
​
d3.json(url, function (response) {
    // console.log(response);
    var massarray = [];
    var yeararray = [];
    var stationarray = [];
    var idarray = [];
    for (var i = 0; i < 10; i++) {
​
        var mass = response[i].mass;
        var mtrid = response[i].id;
        var station = response[i].name;
        var year = response[i].year;
​
        massarray.push(mass / 1000000);
        yeararray.push(year);
        stationarray.push(station);
        idarray.push(mtrid);
    }
​
    var trace = {
        x: stationarray,
        y: massarray,
        mode: 'markers',
        marker: {
            color: idarray,
            colorscale: "Viridis",
            size: massarray,
        }, text: yeararray
    };
    // Source:  https://community.plotly.com/t/what-colorscales-are-available-in-plotly-and-which-are-the-default/2079
​
    var bubble = [trace];
​
    var bbleLayout = {
        title: '10 Largest Meteorites (in metric tons)',
        showlegend: false,
        height: 600,
        width: 600
    };
    Plotly.newPlot('bubble', bubble, bbleLayout);
​
})
Collapse



