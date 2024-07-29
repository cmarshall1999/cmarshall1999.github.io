d3.json("data/top_goal_scorers_cumulative_goals_by_year.json").then(data => {
    const margin = { top: 40, right: 20, bottom: 50, left: 100 };
    const width = 960 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleBand().range([0, height]).padding(0.1);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${height})`);

    svg.append("g")
        .attr("class", "y axis");

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    function update(year) {
        const yearData = data.find(d => d.year === year).top_scorers;

        x.domain([0, d3.max(yearData, d => d.cumulative_goals)]);
        y.domain(yearData.map(d => d.player));

        const bars = svg.selectAll(".bar")
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
            .attr("y", d => y(d.player))
            .attr("height", y.bandwidth())
            .attr("width", 0)
            .style("fill", "steelblue")
            .on("mouseover", (event, d) => {
                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(`Player: ${d.player}<br/>Goals: ${d.cumulative_goals}`)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => {
                tooltip.transition().duration(500).style("opacity", 0);
            })
            .transition()
            .duration(100)
            .attr("width", d => x(d.cumulative_goals));

        svg.select(".x.axis")
            .transition()
            .duration(100)
            .call(xAxis);

        svg.select(".y.axis")
            .transition()
            .duration(100)
            .call(yAxis);
    }

    const years = Array.from(new Set(data.map(d => d.year))).sort((a, b) => a - b);
    let yearIndex = 0;
    let interval;

    function play() {
        interval = setInterval(() => {
            update(years[yearIndex]);
            d3.select("#yearDisplay").text(`Year: ${years[yearIndex]}`);
            yearIndex = (yearIndex + 1) % years.length;
        }, 2000);
    }

    function pause() {
        clearInterval(interval);
    }

    d3.select("#play").on("click", play);
    d3.select("#pause").on("click", pause);
    d3.select("#prevYear").on("click", () => {
        yearIndex = (yearIndex - 1 + years.length) % years.length;
        update(years[yearIndex]);
        d3.select("#yearDisplay").text(`Year: ${years[yearIndex]}`);
    });
    d3.select("#nextYear").on("click", () => {
        yearIndex = (yearIndex + 1) % years.length;
        update(years[yearIndex]);
        d3.select("#yearDisplay").text(`Year: ${years[yearIndex]}`);
    });

    d3.select("#home").on("click", () => window.location.href = "index.html");
    d3.select("#prevPage").on("click", () => window.location.href = "games_per_year.html");
    d3.select("#nextPage").on("click", () => window.location.href = "index.html");

    play();
});
