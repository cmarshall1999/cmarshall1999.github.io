d3.json('data/top_goal_scorers_cumulative_goals_by_year.json').then(data => {
    console.log("Loaded data:", data);  // Debugging

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

    const yearDisplay = d3.select("#yearDisplay");
    const annotation = d3.select("#annotation");

    const years = [1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2024];
    let yearIndex = 0;
    let isPaused = false;

    function update(year) {
        yearDisplay.text(`Year: ${year}`);

        // Example annotations for each year
        const annotations = {
            1920: "The early years of organized football.",
            1930: "First FIFA World Cup held in Uruguay.",
            1940: "World War II impacts global sports.",
            1950: "Post-war recovery and football resurgence.",
            1960: "Football becomes a global phenomenon.",
            1970: "Pele's final World Cup appearance.",
            1980: "Rise of European football clubs.",
            1990: "Football globalization and commercial success.",
            2000: "The era of modern football stars.",
            2010: "Rise of social media and football.",
            2020: "Football during the COVID-19 pandemic.",
            2024: "Upcoming major tournaments and events."
        };

        const annotationText = annotations[year] || "No annotation for this year.";
        annotation.text(annotationText);

        console.log("Updating for year:", year);

        const yearDataEntry = data.find(d => d.year === year);
        if (!yearDataEntry) {
            console.error(`No data found for year: ${year}`);
            return;
        }
        const yearData = yearDataEntry.top_scorers;

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

    d3.select("#prevYear").on("click", prevYear);
    d3.select("#nextYear").on("click", nextYear);
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
    d3.select("#prevPage").on("click", () => {
        window.location.href = "games_per_year.html";
    });
    d3.select("#nextPage").on("click", () => {
        window.location.href = "index.html";
    });

    update(years[yearIndex]);
    play();
}).catch(showError);
