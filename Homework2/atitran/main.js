const width = window.innerWidth;
const height = window.innerHeight;

let scatterLeft = 0, scatterTop = 0;
let scatterMargin = {top: 40, right: 30, bottom: 20, left: 70},
    scatterWidth = 500 - scatterMargin.left - scatterMargin.right,
    scatterHeight = 350 - scatterMargin.top - scatterMargin.bottom;

let distrLeft = 400, distrTop = 0;
let distrMargin = {top: 10, right: 30, bottom: 40, left: 60},
    distrWidth = 400 - distrMargin.left - distrMargin.right,
    distrHeight = 350 - distrMargin.top - distrMargin.bottom;

let teamLeft = 0, teamTop = 500;
let teamMargin = {top: 50, right: 100, bottom: 70, left: 70},
    teamWidth = width-1000 - teamMargin.left - teamMargin.right,
    teamHeight = height-450 - teamMargin.top - teamMargin.bottom;

let distr2Left = 600, distr2Top = 0;
let distr2Margin = {top: 10, right: 30, bottom: 30, left: 60},
    distr2Width = 400 - distr2Margin.left - distr2Margin.right,
    distr2Height = 350 - distr2Margin.top - distr2Margin.bottom;

let fireLeft = 1000, fireTop = 0;
let fireMargin = {top: 40, right: 60, bottom: 50, left: 60},
    fireWidth = 500 - fireMargin.left - fireMargin.right,
    fireHeight = 350 - fireMargin.top - fireMargin.bottom;


d3.csv("pokemon.csv").then(rawData =>{
    console.log("rawData", rawData);
    
    rawData.forEach(function(d){
        d.type = Number(d.type)
        d.Total = Number(d.Total);
        d.Catch_Rate = Number(d.Catch_Rate);
        d.Generation = Number(d.Generation);
    });
    
    rawData = rawData.map(d=>{
                          return {
                              "Name":d.Name,
                              "Type_1":d.Type_1,
                              "Type_2":d.Type_2,
                              "Catch_Rate":d.Catch_Rate,
                              "Generation":d.Generation,
                              "Total":d.Total,
                          };
    });
    console.log(rawData);

    q = rawData.reduce((s, { Generation }) => (s[Generation] = (s[Generation] || 0) + 1, s), {});
    r = Object.keys(q).map((key) => ({ Type_1: key, count: q[key] }));
    const color1 = d3.scaleOrdinal(rawData.map(d => d.Generation), d3.schemeCategory10);

//plot 1
    const svg = d3.select("svg")

    const g1 = svg.append("g")
                .attr("width", scatterWidth + scatterMargin.left + scatterMargin.right)
                .attr("height", scatterHeight + scatterMargin.top + scatterMargin.bottom)
                .attr("transform", `translate(${scatterMargin.left}, ${scatterMargin.top})`)
    
    g1.append("text")
    .attr("x", scatterWidth / 2)
    .attr("y", 0)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Catch Rate VS Total Stats By Generation")

    // X label
    g1.append("text")
    .attr("x", scatterWidth / 2)
    .attr("y", scatterHeight + 50)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Catch Rate")
    

    // Y label
    g1.append("text")
    .attr("x", -(scatterHeight / 2))
    .attr("y", -40)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Total Stats")

    // X ticks
    const x1 = d3.scaleLinear()
    .domain([0, d3.max(rawData, d => d.Catch_Rate)])
    .range([0, scatterWidth])

    const xAxisCall = d3.axisBottom(x1)
                        .ticks(7)
    g1.append("g")
    .attr("transform", `translate(0, ${scatterHeight})`)
    .call(xAxisCall)
    .selectAll("text")
        .attr("y", "10")
        .attr("x", "-5")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)")

    // Y ticks
    const y1 = d3.scaleLinear()
    .domain([0, d3.max(rawData, d => d.Total)])
    .range([scatterHeight, 0])

    const yAxisCall = d3.axisLeft(y1)
                        .ticks(13)
    g1.append("g").call(yAxisCall)

    const rects = g1.selectAll("circle").data(rawData)

    rects.enter().append("circle")
         .attr("cx", function(d){
             return x1(d.Catch_Rate);
         })
         .attr("cy", function(d){
             return y1(d.Total);
         })
         .attr("r", 3)
        //  .attr("fill", "#69b3a2")
        .attr("fill", d => color1(d.Type_1))

    g1.selectAll("mydots")
         .data(r)
         .enter()
         .append("circle")
            .attr("cx", 600)
            .attr("cy", function(d, i) { return 100 + i*25})
            .attr("r", 7)
            .style("fill", d => color1(d.Type_1))
    
    g1.selectAll("mylabels")
         .data(r)
         .enter()
         .append("text")
            .attr("x", 620)
            .attr("y", function(d, i) { return 106 + i*25})
            .style("fill", d => color1(d.Type_1))
            .text(d => d.Type_1)
            .attr("text-anchor", "left")
            .style("allignment-baseline", "middle")

//space
    const g2 = svg.append("g")
                .attr("width", distrWidth + distrMargin.left + distrMargin.right)
                .attr("height", distrHeight + distrMargin.top + distrMargin.bottom)
                .attr("transform", `translate(${distrLeft}, ${distrTop})`)

//plot 2
    const color2 = d3.scaleOrdinal(rawData.map(d => d.Type_1), d3.schemeCategory10);

    // q = rawData.reduce((s, { Generation }) => (s[Generation] = (s[Generation] || 0) + 1, s), {});
    // r = Object.keys(q).map((key) => ({ Type_1: key, count: q[key] }));
    console.log(r);    

    const g3 = svg.append("g")
                .attr("width", teamWidth + teamMargin.left + teamMargin.right)
                .attr("height", teamHeight + teamMargin.top + teamMargin.bottom)
                .attr("transform", `translate(${teamMargin.left}, ${teamTop})`)

    g3.append("text")
    .attr("x", teamWidth / 2)
    .attr("y", 0)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("# of Pokemon In Each Generation")

    // X label
    g3.append("text")
    .attr("x", teamWidth / 2)
    .attr("y", teamHeight + 40)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Generation")
    

    // Y label
    g3.append("text")
    .attr("x", -(teamHeight / 2))
    .attr("y", -40)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Number of Pokemon")

    // X ticks
    const x2 = d3.scaleBand()
    .domain(r.map(d => d.Type_1))
    .range([0, teamWidth])
    .paddingInner(0.3)
    .paddingOuter(0.2)

    const xAxisCall2 = d3.axisBottom(x2)
    g3.append("g")
    .attr("transform", `translate(0, ${teamHeight})`)
    .call(xAxisCall2)
    .selectAll("text")
        .attr("y", "10")
        .attr("x", "2")
        .attr("text-anchor", "end")
        // .attr("transform", "rotate(-40)")

    // Y ticks
    const y2 = d3.scaleLinear()
    .domain([0, d3.max(r, d => d.count)])
    .range([teamHeight, 0])

    const yAxisCall2 = d3.axisLeft(y2)
                        .ticks(6)
    g3.append("g").call(yAxisCall2)

    const rects2 = g3.selectAll("rect").data(r)

    rects2.enter().append("rect")
    .attr("y", d => y2(d.count))
    .attr("x", (d) => x2(d.Type_1))
    .attr("width", x2.bandwidth)
    .attr("height", d => teamHeight - y2(d.count))
    .attr("fill", d => color2(d.Type_1))

    var size = 20
    g3.selectAll("mydots")
    .data(r)
    .enter()
    .append("rect")
        .attr("x", 800)
        .attr("y", function(d,i){ return 100 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        // .style("fill", function(d){ return color(d)})
        .style("fill", d => color2(d.Type_1))

    g3.selectAll("mylabels")
    .data(r)
    .enter()
    .append("text")
        .attr("x", 800 + size*1.2)
        .attr("y", function(d,i){ return 100 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        // .style("fill", function(d){ return color(d)})
        .style("fill", d => color2(d.Type_1))
        // .text(function(d){ return d})
        .text(d => d.Type_1)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

//space
    const g4 = svg.append("g")
        .attr("width", distr2Width + distr2Margin.left + distr2Margin.right)
        .attr("height", distr2Height + distr2Margin.top + distr2Margin.bottom)
        .attr("transform", `translate(${distr2Left}, ${distr2Top})`)

// Plot 3
    // Gets the fire pokemons
    function getFirePokemonSecondType(rawData) {
        const secondType = {};
        rawData.forEach(element => {
            const type1 = element.Type_1;

            if (type1 == 'Fire') {
                secondType[element.Name] = element.Type_2;
            }
        });

        return secondType;
    }

    const fireSecondType = getFirePokemonSecondType(rawData);

    console.log(fireSecondType);

    const g5 = svg.append("g")
        .attr("width", fireWidth + fireMargin.left + fireMargin.right)
        .attr("height", fireHeight + fireMargin.top + fireMargin.bottom)
        .attr("transform", `translate(${fireMargin.left}, ${fireTop})`)
    




}).catch(function(error){
    console.log(error);
});

