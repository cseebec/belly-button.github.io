// Read in the json data. The rest of the code will be in this huge function
d3.json("samples.json").then((jsondata) =>{
    let = DropdownLocation = d3.select("#selDataset")
    //Add the json data to the dropdown menu 
    jsondata.names.forEach(function(options) {
            DropdownLocation.append("option").text(options).property("value");
    });

    //Create smaller datasets that will be used to create graphs and display demographic info
    let alldata = jsondata.samples;
    let metadata = jsondata.metadata;
    
    //Inititializes the webpage with default plots
    function init() {
        //Select the first id to use as the basis for the initial charts
        let sampledata = alldata[0];
        //Reorganize data from object to an array so that I can sort it
        let organizedsampledata = [];
        for (let j = 0; j < sampledata.otu_ids.length; j++) {
            let each = {
                sample_values: sampledata.sample_values[j],
                otu_ids: sampledata.otu_ids[j],
                labels: sampledata.otu_labels[j]
            };
            organizedsampledata.push(each)
        }
        //Sort the data by sample values in descending order
        let sortedData = organizedsampledata.sort((a, b) => b.sample_values - a.sample_values);
        // Slice the first 10 objects for plotting
        slicedData = sortedData.slice(0, 10);
        // Reverse the array to accommodate Plotly's defaults
        reversedData = slicedData.reverse();
        // Trace1 for the Belly Button Data
        let trace1 = {
            x: reversedData.map(object => object.sample_values),
            y: reversedData.map(object => `OTU ${object.otu_ids}`),
            text: reversedData.map(object => object.labels),
            name: "Bacteria",
            type: "bar",
            orientation: "h"
        };
        let traceData = [trace1];
        let layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 50,
                b: 30
            }
        };
        // create the horizontal bar plot
        Plotly.newPlot("bar", traceData, layout);

        //Now onto the bubble chart 
        let trace2 = {
            x: sampledata.otu_ids,
            y: sampledata.sample_values,
            mode: "markers",
            marker: {
                size: sampledata.sample_values,
                color: sampledata.otu_ids
            },
            text: sampledata.otu_labels
        };
        let layout_bub = {
            xaxis:{title: "OTU ID"},
            height: 500,
            width: 1000
        };
        let tracedata_bub = [trace2];
        //Create a bubble chart that displays each sample with size based on sample values and color based on otu ids
        Plotly.newPlot("bubble", tracedata_bub, layout_bub);


        //Now to fill in the Demographics Panel
        function selectID(belly) {
            return belly.id == "940";
        };
        let DemographicResult = metadata.filter(selectID);
        // Use d3 to select the Demographics Info Panel on the website using an id from the html
        let DemographicPanel = d3.select("#sample-metadata");
        DemographicPanel.html("");
        // Add demographic to the panel on the website based on the id selected 
        DemographicPanel.append("h5").text("id: " + DemographicResult[0].id);
        DemographicPanel.append("h5").text("ethnicity: " + DemographicResult[0].ethnicity);
        DemographicPanel.append("h5").text("gender: " + DemographicResult[0].gender);
        DemographicPanel.append("h5").text("location: " + DemographicResult[0].location);
        DemographicPanel.append("h5").text("bbtype: " + DemographicResult[0].bbtype);
        DemographicPanel.append("h5").text("wfreq: " + DemographicResult[0].wfreq);
    }

    init();

    // Listen for the event of the dropdown selection changing and update the plots
	d3.selectAll("#selDataset").on("change", updateCharts);

    function updateCharts() {
        //Read in what id the user selected from the dropdown menu
        var dropdown = d3.select("#selDataset");
        var userSelection = dropdown.property("value");
        console.log(userSelection);


        //Update the Demographics Panel
        function selectID(belly) {
            return belly.id == userSelection;
        };
        let DemographicResult = metadata.filter(selectID);
        let DemographicPanel = d3.select("#sample-metadata");
        DemographicPanel.html("");
        // Add demographic to the panel on the website based on the id selected 
        DemographicPanel.append("h5").text("id: " + DemographicResult[0].id);
        DemographicPanel.append("h5").text("ethnicity: " + DemographicResult[0].ethnicity);
        DemographicPanel.append("h5").text("gender: " + DemographicResult[0].gender);
        DemographicPanel.append("h5").text("location: " + DemographicResult[0].location);
        DemographicPanel.append("h5").text("bbtype: " + DemographicResult[0].bbtype);
        DemographicPanel.append("h5").text("wfreq: " + DemographicResult[0].wfreq);


        //Update the bar and bubble charts
        let sampledata = alldata.filter(sample => sample.id === userSelection)[0];
        console.log(sampledata);
        //This is the same code from the first function


        //Reorganize data from object to an array so that I can sort it
        let organizedsampledata = [];
        for (let j = 0; j < sampledata.otu_ids.length; j++) {
            let each = {
                sample_values: sampledata.sample_values[j],
                otu_ids: sampledata.otu_ids[j],
                labels: sampledata.otu_labels[j]
            };
            organizedsampledata.push(each)
        }
        //Sort the data by sample values in descending order
        let sortedData = organizedsampledata.sort((a, b) => b.sample_values - a.sample_values);
        // Slice the first 10 objects for plotting
        slicedData = sortedData.slice(0, 10);
        // Reverse the array to accommodate Plotly's defaults
        reversedData = slicedData.reverse();
        
        // Restyle the Bar Chart with new values
        Plotly.restyle("bar", "x", [reversedData.map(object => object.sample_values)]);
        Plotly.restyle("bar", "y", [reversedData.map(object => `OTU ${object.otu_ids}`)]);
        Plotly.restyle("bar", "text", [reversedData.map(object => object.labels)]);

        //Restyle the Bubble Chart with new values


        //Now onto the bubble chart 
        let trace2 = {
            x: sampledata.otu_ids,
            y: sampledata.sample_values,
            mode: "markers",
            marker: {
                size: sampledata.sample_values,
                color: sampledata.otu_ids
            },
            text: sampledata.otu_labels
        };
        let layout_bub = {
            xaxis:{title: "OTU ID"},
            height: 500,
            width: 1000
        };
        let tracedata_bub = [trace2];
        //Create a bubble chart that displays each sample with size based on sample values and color based on otu ids
        Plotly.newPlot("bubble", tracedata_bub, layout_bub);
    }
});
