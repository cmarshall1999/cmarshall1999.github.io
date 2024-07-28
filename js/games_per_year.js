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

    const years = [1880, 1890, 1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2024];
    let yearIndex = 0;
    let isPaused = false;

    function update(year) {
        yearDisplay.text(`Year: ${year}`);

        console.log("Updating for year:", year);

        // Filter the data up to the current year
        const yearData = data.filter(d => d.year.getFullYear() <= year);
        console.log("Filtered year data:", yearData);  // Debugging

        x.domain(d3.extent(yearData, d => d.year));
        y.domain([0, d3.max(yearData, d => d.number_of_games)]);

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
            .datum(yearData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        g.selectAll("circle")
            .data(yearData)
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
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
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

    // Home button functionality
    d3.select("#home").on("click", () => {
        window.location.href = "index.html";
    });

    update(years[yearIndex]);  // Initial update with a starting year
    play();
}).catch(showError);
