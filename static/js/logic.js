// Resolves CORS error:  https://web.dev/cross-origin-resource-sharing/
//var url = fetch("http://127.0.0.1:5000/api/v1.0/bubbles/allow-cors", {mode:'cors'});
 var url = "http://127.0.0.1:5000/api/v1.0/bubbles";
// // let = url = "http://127.0.0.1:5000/api/v1.0/bubbles";
 d3.json(url, function (response) {
    // console.log(response);
    for (var i = 0; i < 10; i++) {
        var mass = response[i].mass;
        var mtrid = response[i].id;
        var station = response[i].name;
        console.log(mass + " " + mtrid + " " + station)
    }
    var data = [{
        values: mass,
        labels: station,
        type: 'pie'
      }];
      var layout = {
        height: 400,
        width: 500
      };
      Plotly.newPlot('pie', data, layout);
//     var trace = {
//         x: [1, 2, 3],
//         y: [10, 20, 30],
//         mode: 'markers',
//         marker: {
//             color: [1, 2, 3],
//             colorscale: "Electric",
//             size: [10, 20, 30],
//             sizeref: 0.05,
//             sizemode: 'area'
//         }
//     // };
//     // var trace = {
//     //     x: mtrid,
//     //     y: [60000000,24000000,23000000,16000000,15500000,9500000,4000000,3000000,3000000],
//     //     mode: 'markers',
//     //     marker: {
//     //         color: mtrid,
//     //         colorscale: "Electric",
//     //         size: [60000000,24000000,23000000,16000000,15500000,9500000,4000000,3000000,3000000],
//     //         sizeref: 0.02,
//     //         sizemode: 'area'
//     //     }, text: station
//     // };
//     // var bubble = [trace];
//     // var bbleLayout = {
//     //     title: 'Bubble',
//     //     showlegend: false,
//     //     height: 600,
//     //     width: 600
//     // };
//     Plotly.newPlot('bubble', bubble, bbleLayout);
 });