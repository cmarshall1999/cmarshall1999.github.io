d3.csv('data/games_per_year.csv').then(data => {
    console.log("Loaded data:", data);  // Debugging

    // Process the CSV data
    data.forEach(d => {
        d.year = new Date(d.year);
        d.number_of_games = +d.number_of_games;
    });
    console.log("Processed data:", data);  // Debugging

    const svg = d3.select('#gamesPerYear');
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.number_of_games));

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    const yearDisplay = d3.select("#yearDisplay");

    // Create a dropdown for team selection
    const teams = Array.from(new Set(data.map(d => d.team)));
    const teamDropdown = d3.select("#teamDropdown");

    teams.forEach(team => {
        teamDropdown.append("option").attr("value", team).text(team);
    });

    function update(selectedTeam = "Overall") {
        console.log("Updating for team:", selectedTeam);

        // Filter the data for the selected team
        let filteredData;
        if (selectedTeam === "Overall") {
            const overallData = d3.groups(data, d => d.year)
                .map(([key, values]) => ({
                    year: new Date(key),
                    number_of_games: d3.sum(values, v => v.number_of_games)
                }));
            filteredData = overallData;
        } else {
            filteredData = data.filter(d => d.team === selectedTeam);
        }
        console.log("Filtered data:", filteredData);  // Debugging

        x.domain(d3.extent(filteredData, d => d.year));
        y.domain([0, d3.max(filteredData, d => d.number_of_games)]);

        g.selectAll("*").remove();  // Clear previous content

        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

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
            .datum(filteredData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        g.selectAll("circle")
            .data(filteredData)
            .enter().append("circle")
            .attr("cx", d => x(d.year))
            .attr("cy", d => y(d.number_of_games))
            .attr("r", 3)
            .attr("fill", "red")
            .on("mouseover", function(event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`Year: ${d.year.getFullYear()}<br>Games: ${d.number_of_games}`)
                    .style("left", (event.pageX + 15) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    }

    // Update chart on team selection change
    teamDropdown.on("change", () => {
        update(teamDropdown.node().value);
    });

    d3.select("#home").on("click", () => {
        window.location.href = "index.html";
    });
    d3.select("#prevPage").on("click", () => {
        window.location.href = "unique_teams_per_year.html";
    });
    d3.select("#nextPage").on("click", () => {
        window.location.href = "top_goal_scorers.html";
    });

    update();  // Initial update with "Overall" selected
}).catch(error => {
    console.error("Error loading the data:", error);
});
