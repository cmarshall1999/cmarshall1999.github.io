d3.json('data/unique_teams_per_year.json').then(data => {
    const formattedData = Object.keys(data).map(year => ({
        year: new Date(year),
        number_of_unique_teams: data[year].number_of_unique_teams
    }));

    const svg = d3.select('#uniqueTeamsPerYear');
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.number_of_unique_teams));

    x.domain(d3.extent(formattedData, d => d.year));
    y.domain([0, d3.max(formattedData, d => d.number_of_unique_teams)]);

    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .select(".domain")
        .remove();

    g.append("g")
        .call(d3
