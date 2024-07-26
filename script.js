// Set up the initial state
let currentScene = 0;
const scenes = ['#scene1', '#scene2', '#scene3', '#scene4'];

// Function to show a scene
function showScene(index) {
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
    const formattedData = Object.keys(data).map(year => ({
        year: new Date(year),
        number_of_games: data[year].number_of_games
    }));

    drawScene1(formattedData);
});

// Load the JSON data for unique teams per year
d3.json('unique_teams_per_year.json').then(data => {
    const formattedData = Object.keys(data).map(year => ({
        year: new Date(year),
        number_of_unique_teams: data[year].number_of_unique_teams
    }));

    drawScene2(formattedData);
});

// Function to draw the first scene
function drawScene1(data) {
    const svg = d3.select('#scene1');
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime().rangeRound([0, width]);
    const y = d3.scaleLinear().rangeRound([height, 0]);

    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.number_of_games));

    x.domain(d3.extent(data, d => d.year));
    y.domain(d3.extent(data, d => d.number_of_games));

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

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);
}

// Function to draw the second scene
function drawScene2(data) {
    const svg = d3.select('#scene2');
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime().rangeRound([0, width]);
    const y = d3.scaleLinear().rangeRound([height, 0]);

    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.number_of_unique_teams));

    x.domain(d3.extent(data, d => d.year));
    y.domain(d3.extent(data, d => d.number_of_unique_teams));

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

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);
}
