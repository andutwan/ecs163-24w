const width = window.innerWidth;
const height = window.innerHeight;

let scatterLeft = 0, scatterTop = 0;
let scatterMargin = {top: 40, right: 30, bottom: 20, left: 70},
    scatterWidth = 400 - scatterMargin.left - scatterMargin.right,
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

d3.csv("pokemon.csv").then(rawData =>{
    console.log("rawData", rawData);
    
    rawData.forEach(function(d){
        d.type = Number(d.type)
        d.Total = Number(d.Total);
        d.Catch_Rate = Number(d.Catch_Rate);
        d.Generation = Number(d.Generation);
    });
    

    // rawData = rawData.filter(d=>d.AB>abFilter);
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
    .text("Catch Rate V.S. Total Stats")

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
    .text("Total")

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
         .attr("fill", "#69b3a2")

//space
    const g2 = svg.append("g")
                .attr("width", distrWidth + distrMargin.left + distrMargin.right)
                .attr("height", distrHeight + distrMargin.top + distrMargin.bottom)
                .attr("transform", `translate(${distrLeft}, ${distrTop})`)

//plot 2
    
    q = rawData.reduce((s, { Type_1 }) => (s[Type_1] = (s[Type_1] || 0) + 1, s), {});
    r = Object.keys(q).map((key) => ({ Type_1: key, count: q[key] }));
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
    .text("Number of Pokemon in each type")

    // X label
    g3.append("text")
    .attr("x", teamWidth / 2)
    .attr("y", teamHeight + 60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Pokemon Type")
    

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
        .attr("x", "-5")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)")

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
    .attr("fill", "lightblue")

// Plot 3




























}).catch(function(error){
    console.log(error);
});

