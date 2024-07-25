// Load the JSON data
d3.json('data/top_goal_scorers_cumulative_goals_by_year.json').then(data => {
    // Set up the SVG canvas dimensions
    const margin = { top: 40, right: 20, bottom: 50, left: 100 };
    const width = 960 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up the scales
    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleBand().range([0, height]).padding(0.1);

    // Set up the axes
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    // Add the axes to the SVG
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${height})`);

    svg.append("g")
        .attr("class", "y axis");

    // Function to update the chart for a given year
    function update(year) {
        const yearData = data.find(d => d.year === year).top_scorers;

        // Update the scales
        x.domain([0, d3.max(yearData, d => d.cumulative_goals)]);
        y.domain(yearData.map(d => d.player));

        // Join the data
        const bars = svg.selectAll(".bar")
            .data(yearData, d => d.player);

        // Exit
        bars.exit()
            .transition()
            .duration(100)
            .attr("width", 0)
            .remove();

        // Update
        bars.transition()
            .duration(100)
            .attr("y", d => y(d.player))
            .attr("width", d => x(d.cumulative_goals))
            .attr("height", y.bandwidth());

        // Enter
        bars.enter().append("rect")
            .attr("class", "bar")
            .attr("x", 0)
            .attr("y", d => y(d.player))
            .attr("height", y.bandwidth())
            .attr("width", 0)
            .transition()
            .duration(100)
            .attr("width", d => x(d.cumulative_goals));

        // Update the axes
        svg.select(".x.axis")
            .transition()
            .duration(100)
            .call(xAxis);

        svg.select(".y.axis")
            .transition()
            .duration(100)
            .call(yAxis);
    }

    // Function to loop through the years and update the chart
    let yearIndex = 0;
    function loopYears() {
        update(data[yearIndex].year);
        yearIndex = (yearIndex + 1) % data.length;
        setTimeout(loopYears, 2000);
    }

    // Start the loop
    loopYears();
});
