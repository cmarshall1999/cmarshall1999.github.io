// Set up the initial state
let currentScene = 0;
const scenes = ['#scene1', '#scene2', '#scene3', '#scene4'];

// Function to show a scene
function showScene(index) {
    console.log("Showing scene:", index);  // Debugging
    d3.selectAll('.scene').classed('active', false);
    d3.select(scenes[index]).classed('active', true);
}

// Function to handle the next button click
function nextScene() {
    currentScene = (currentScene + 1) % scenes.length;
    showScene(currentScene);
}

// Function to handle the previous button click
function prevScene() {
    currentScene = (currentScene - 1 + scenes.length) % scenes.length;
    showScene(currentScene);
}

// Attach event listeners to buttons
document.getElementById('next').addEventListener('click', nextScene);
document.getElementById('prev').addEventListener('click', prevScene);

// Initially show the first scene
showScene(currentScene);

// Load the JSON data for games per year
d3.json('games_per_year.json').then(data => {
    try {
        const formattedData = Object.keys(data).map(year => ({
            year: new Date(year),
            number_of_games: data[year].number_of_games
        }));
        console.log("Games per year data loaded:", formattedData);  // Debugging
        drawScene1(formattedData);
    } catch (error) {
        console.error("Error processing games per year data:", error);
    }
}).catch(error => {
    console.error("Error loading games per year data:", error);
});

// Load the JSON data for unique teams per year
d3.json('unique_teams_per_year.json').then(data => {
    try {
        const formattedData = Object.keys(data).map(year => ({
            year: new Date(year),
            number_of_unique_teams: data[year].number_of_unique_teams
        }));
        console.log("Unique teams per year data loaded:", formattedData);  // Debugging
        drawScene2(formattedData);
    } catch (error) {
        console.error("Error processing unique teams per year data:", error);
    }
}).catch(error => {
    console.error("Error loading unique teams per year data:", error);
});

// Load the JSON data for top goal scorers by year
d3.json('top_goal_scorers_cumulative_goals_by_year.json').then(data => {
    try {
        console.log("Top goal scorers data loaded:", data);  // Debugging
        drawScene3(data);
    } catch (error) {
        console.error("Error processing top goal scorers data:", error);
    }
}).catch(error => {
    console.error("Error loading top goal scorers data:", error);
});

// Function to draw the first scene
function drawScene1(data) {
    console.log("Drawing scene 1");  // Debugging
    const svg = d3.select('#scene1');
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.number_of_games));

    x.domain(d3.extent(data, d => d.year));
    y.domain([0, d3.max(data, d => d.number_of_games)]);

    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .select(".domain")
        .remove();

    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Number of Games");

    const path = g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    // Add transitions
    const totalLength = path.node().getTotalLength();
    path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
}

// Function to draw the second scene
function drawScene2(data) {
    console.log("Drawing scene 2");  // Debugging
    const svg = d3.select('#scene2');
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.number_of_unique_teams));

    x.domain(d3.extent(data, d => d.year));
    y.domain([0, d3.max(data, d => d.number_of_unique_teams)]);

    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .select(".domain")
        .remove();

    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Number of Unique Teams");

    const path = g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    // Add transitions
    const totalLength = path.node().getTotalLength();
    path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
}

// Function to draw the third scene
function drawScene3(data) {
    console.log("Drawing scene 3");  // Debugging
    const svg = d3.select('#scene3');
    const margin = { top: 20, right: 20, bottom: 30, left: 150 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleBand().range([0, height]).padding(0.1);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    g.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${height})`);

    g.append("g")
        .attr("class", "y axis");

    function update(year) {
        const yearData = data.find(d => d.year === year).top_scorers;

        x.domain([0, d3.max(yearData, d => d.cumulative_goals)]);
        y.domain(yearData.map(d => d.player));

        const bars = g.selectAll(".bar")
            .data(yearData, d => d.player);

        bars.exit()
            .transition()
            .duration(100)
            .attr("width", 0)
            .remove();

        bars.transition()
            .duration(100)
            .attr("y", d => y(d.player))
            .attr("width", d => x(d.cumulative_goals))
            .attr("height", y.bandwidth());

        bars.enter().append("rect")
            .attr("class", "bar")
            .attr("x", 0)
            .attr("y", d => y
