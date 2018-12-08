function timelineChart() {
    var margin = { top: 20, right: 20, bottom: 50, left: 50 },
        width = 350,
        height = 350,
        parseTime = d3.timeParse("%m/%Y"),
        timeValue = function(d) { return parseTime(d.month); },
        dataValue = function (d) { return +d.value; },
        color = "steelblue";

    // From https://bl.ocks.org/mbostock/5649592
    function transition(path) {
        path.transition()
            .duration(2000)
            .attrTween("stroke-dasharray", tweenDash);
    }
    function tweenDash() {
        var l = this.getTotalLength(),
            i = d3.interpolateString("0," + l, l + "," + l);
        return function (t) { return i(t); };
    }

    function chart(selection) {
        selection.each(function (data) {
            data = data.map(function (d, i) {
                return { time: timeValue(d), value: dataValue(d) };
            });
            var x = d3.scaleTime()
                .rangeRound([0, width - margin.left - margin.right])
                .domain(d3.extent(data, function(d) { return d.time; }));
            var y = d3.scaleLinear()
                .rangeRound([height - margin.top - margin.bottom, 0])
                .domain(d3.extent(data, function(d) { return d.value; }));
            
            var line = d3.line()
                .x(function(d) { return x(d.time); })
                .y(function(d) { return y(d.value); });

            var svg = d3.select(this).selectAll("svg").data([data]);
            var gEnter = svg.enter().append("svg").append("g");

            gEnter.append("path")
                .datum(data)
                .attr("class", "data")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 4);
    
            gEnter.append("g").attr("class", "axis x");
            gEnter.append("g").attr("class", "axis y")
                .append("text")
                .attr("fill", "#000")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .text("Data");
            gEnter.append("path")
                .attr("class", "data");

            var svg = selection.select("svg");
            svg.attr('width', width).attr('height', height);
            var g = svg.select("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            g.select("g.axis.x")
                .attr("transform", "translate(0," + (height - margin.bottom) + ")")
                .call(d3.axisBottom(x).ticks(5))
                .select(".domain")
                .remove();

            g.select("g.axis.y")
                .attr("class", "axis y")
                .call(d3.axisLeft(y));

            g.select("path.data")
                .datum(data)
                .attr("d", line)
                .call(transition);
        });
    }

    chart.margin = function (_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.width = function (_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
    };

    chart.height = function (_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
    };

    chart.parseTime = function (_) {
        if (!arguments.length) return parseTime;
        parseTime = _;
        return chart;
    };

    chart.timeValue = function (_) {
        if (!arguments.length) return timeValue;
        timeValue = _;
        return chart;
    };

    chart.dataValue = function (_) {
        if (!arguments.length) return dataValue;
        dataValue = _;
        return chart;
    };

    return chart;
}
