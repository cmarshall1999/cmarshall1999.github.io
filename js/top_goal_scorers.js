d3.json('data/top_goal_scorers_cumulative_goals_by_year.json').then(data => {
    const svg = d3.select('#topGoalScorers');
    const margin = { top: 40, right: 20, bottom: 50, left: 100 };
    const width = 960 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
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

    const yearDisplay = d3.select("#yearDisplay").style("text-align", "center").style("font-size", "24px");

    const years = [1872, 1880, 1890, 1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2024];
    let yearIndex = 0;
    let isPaused = false;

    function update(year) {
        yearDisplay.text(`Year: ${year}`);
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
            .attr("y", d => y(d.player))
            .attr("height", y.bandwidth())
            .attr("width", 0)
            .transition()
            .duration(100)
            .attr("width", d => x(d.cumulative_goals));

        g.select(".x.axis")
            .transition()
            .duration(100)
            .call(xAxis);

        g.select(".y.axis")
            .transition()
            .duration(100)
            .call(yAxis);
    }

    function nextYear() {
        yearIndex = (yearIndex + 1) % years.length;
        update(years[yearIndex]);
    }

    function prevYear() {
        yearIndex = (yearIndex - 1 + years.length) % years.length;
        update(years[yearIndex]);
    }

    let interval;
    function play() {
        if (interval) clearInterval(interval);
        interval = setInterval(() => {
            if (!isPaused) {
                nextYear();
            }
        }, 2000);
    }

    function pause() {
        isPaused = !isPaused;
        d3.select("#pause").text(isPaused ? "Resume" : "Pause");
    }

    d3.select("#prev").on("click", prevYear);
    d3.select("#next").on("click", nextYear);
    d3.select("#pause").on("click", pause);
    d3.select("#play").on("click", () => {
        isPaused = false;
        d3.select("#pause").text("Pause");
        play();
    });

    update(years[yearIndex]);
    play();
}).catch(showError);
