var generations = [1, 2, 3];
const width = window.innerWidth;
const height = window.innerHeight;

let scatterLeft = 0, scatterTop = 500;
let scatterMargin = {top: 40, right: 30, bottom: 10, left: 70},
    scatterWidth = 500 - scatterMargin.left - scatterMargin.right,
    scatterHeight = height-600 - scatterMargin.top - scatterMargin.bottom;

let distrLeft = 400, distrTop = 0;
let distrMargin = {top: 10, right: 30, bottom: 40, left: 60},
    distrWidth = 400 - distrMargin.left - distrMargin.right,
    distrHeight = 350 - distrMargin.top - distrMargin.bottom;

let teamLeft = 0, teamTop = 50;
let teamMargin = {top: 50, right: 100, bottom: 70, left: 70},
    teamWidth = width-500 - teamMargin.left - teamMargin.right,
    teamHeight = height-600 - teamMargin.top - teamMargin.bottom;

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

    console.log("r", r);
//plot 1
// SCATTERPLOT
// INTERACTION: PAN AND ZOOM
// TRANSITION: VIEW TRANSITION
    const svg = d3.select("svg")

    const g1 = svg.append("g")
                .attr("width", scatterWidth + scatterMargin.left + scatterMargin.right)
                .attr("height", scatterHeight + scatterMargin.top + scatterMargin.bottom)
                .attr("transform", `translate(${scatterMargin.left}, ${scatterTop})`)
    
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
    let x1 = d3.scaleLinear()
    .domain([0, d3.max(rawData, d => d.Catch_Rate)])
    .range([0, scatterWidth])

    // Y ticks
    let y1 = d3.scaleLinear()
    .domain([0, d3.max(rawData, d => d.Total)])
    .range([scatterHeight, 0])

    var xScaleOri = x1.copy();
    var yScaleOri = y1.copy();

    const xAxisCall = d3.axisBottom(x1)
    const yAxisCall = d3.axisLeft(y1)

    const rectsG = g1.append("g");
    const rects = rectsG.selectAll("circle").data(rawData)
        .enter().append("circle")
         .attr("cx", function(d){
             return x1(d.Catch_Rate);
         })
         .attr("cy", function(d){
             return y1(d.Total);
         })
         .attr("r", 3)
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

    const axisG = g1.append('g');
    const axisXG = axisG.append("g")
                    .attr("transform", "translate(0," + scatterHeight + ")")
                    .call(xAxisCall);
    
    const axisYG = axisG.append("g")
                    .call(yAxisCall);

    var zoom = d3.zoom()
         .scaleExtent([1, 10])
         .on("zoom", zoomed);
    
    svg.call(zoom);

    function zoomed() {
        var t = d3.event.transform;

        rectsG.attr("transform", t);
        x1 = t.rescaleX(xScaleOri);
        y1 = t.rescaleY(yScaleOri);
        axisXG.call(xAxisCall.scale(x1))
        axisYG.call(yAxisCall.scale(y1))

        rects
            .attr('display', function(d) {
                if(x1(d.Catch_Rate) < 0 || x1(d.Catch_Rate) > scatterWidth ||
                  y1(d.Total) < 0 || y1(d.Total) > scatterHeight) {
                    return 'none';
                }
                return '';
            });
    }

//space
    const g2 = svg.append("g")
        .attr("width", distrWidth + distrMargin.left + distrMargin.right)
        .attr("height", distrHeight + distrMargin.top + distrMargin.bottom)
        .attr("transform", `translate(${distrLeft}, ${distrTop})`)

//plot 2
// BAR GRAPH
// INTERACTION: SELECTION
// TRANSITION ORDERING
// NOTE: NOT SURE WHY BUT THE BAR GRAPH RESIZES HERE AND THERE WHEN WE REFRESH OR MAKE A CHANGE
    const color2 = d3.scaleOrdinal(r.map(d => d.Type_1), d3.schemeCategory10);

    const g3 = svg.append("g")
                .attr("width", teamWidth + teamMargin.left + teamMargin.right)
                .attr("height", teamHeight + teamMargin.top + teamMargin.bottom)
                .attr("transform", `translate(${teamMargin.left}, ${teamTop})`)

    g3.append("text")
    .attr("x", teamWidth / 2)
    .attr("y", -10)
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
    const x2Axis = g3.append("g")
        .attr("transform", `translate(0, ${teamHeight})`)
        .call(xAxisCall2)
        .selectAll("text")
            .attr("y", "10")
            .attr("x", "2")
            .attr("text-anchor", "end")

    // Y ticks
    const y2 = d3.scaleLinear()
    .domain([0, d3.max(r, d => d.count)])
    .range([teamHeight, 0])

    const yAxisCall2 = d3.axisLeft(y2)
                        .ticks(6)
    const y2Axis = g3.append("g").call(yAxisCall2)

    const rects2 = g3.selectAll("rect").data(r)

    var s = rects2.enter().append("rect")
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
        .attr("y", function(d,i){ return 30 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", d => color2(d.Type_1))

    g3.selectAll("mylabels")
    .data(r)
    .enter()
    .append("text")
        .attr("x", 800 + size*1.2)
        .attr("y", function(d,i){ return 30 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", d => color2(d.Type_1))
        .text(d => d.Type_1)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

    document.getElementById("ascending").addEventListener("click", function() {
        const sortedA = r.sort((a,b) => parseInt(a.count) - parseInt(b.count));
        console.log(sortedA);
        var t = d3.transition()
            .delay(1000)
            .duration(1000);

        var newx = d3.scaleBand()
            .domain(r.map(d => parseInt(d.Type_1)))
            .range([0, teamWidth])
            .paddingInner(0.3)
            .paddingOuter(0.2)

        var newxAxisCall = d3.axisBottom(newx)
        x2Axis.transition(t).call(newxAxisCall);

        var newy = d3.scaleLinear()
            .domain([0, d3.max(r, d => d.count)])
            .range([teamHeight, 0]);

        var newyAxisCall = d3.axisLeft(newy).ticks(3)

        y2Axis.transition(t).call(newyAxisCall);

        s.transition(t)
            .attr("x", (d) => newx(d.Type_1))
            .attr("y", d => newy(d.count))
            .attr("height", d => teamHeight - newy(d.count));
    })

    document.getElementById("descending").addEventListener("click", function() {
        const sortedB = r.sort((a, b) => parseInt(b.count) - parseInt(a.count));
        var t = d3.transition()
            .delay(1000)
            .duration(1000);

        var newy = d3.scaleLinear()
            .domain([0, d3.max(r, d => d.count)])
            .range([teamHeight, 0]);

        var newyAxisCall = d3.axisLeft(newy).ticks(3)

        y2Axis.transition(t).call(newyAxisCall);

        var newx = d3.scaleBand()
            .domain(r.map(d => d.Type_1))
            .range([0, teamWidth])
            .paddingInner(0.3)
            .paddingOuter(0.2)

        var newxAxisCall = d3.axisBottom(newx).ticks(3);
        x2Axis.transition(t).call(newxAxisCall);

        s.transition(t)
            .attr("x", (d) => newx(d.Type_1))
            .attr("y", (d) => newy(d.count))
            .attr("height", (d) => teamHeight - newy(d.count));
    })


}).catch(function(error){
    console.log(error);
});

