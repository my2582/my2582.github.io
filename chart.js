var margin = {top: 30, right: 25, bottom: 20, left: 23},
	width = 565 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;

var parseDate = d3.time.format("%m-%d-%Y").parse,
	formatPercent = d3.format(".0"),
	formatPercentDetailed = d3.format(".1%"),
	numberFormat = d3.format(",.0f");

var x = d3.time.scale()
	.range([0, width]);

var y0 = d3.scale.linear()
	.range([height, 0]);

var y1 = d3.scale.linear()
	.range([height, 0]);

var xAxis = d3.svg.axis()
	.scale(x)
	.tickFormat(d3.time.format("%Y"))
	.ticks(5)
	.orient("bottom");

var yAxisRight = d3.svg.axis()
	.scale(y1)
	.orient("right")
	.tickFormat(formatPercent)
	.tickSize(width);

var yAxisLeft = d3.svg.axis()
	.scale(y0)
	.orient("left")
	.ticks(5)
	.tickFormat(formatPercent);

var empLine = d3.svg.line()
	.x(function(d) { return x(d.date); })
	.y(function(d) { return y1(d.employment); });

var unempLine = d3.svg.line()
	.x(function(d) { return x(d.date); })
	.y(function(d) { return y0(d.unemploymentrate); });

var svg = d3.select("#chart").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var areaUnder25 = d3.svg.area()
	.x(function(d) { return x(d.date); })
	.y0(height)
	.y1(function(d) { return y1(d.jobgainsunder25); });

var area2554 = d3.svg.area()
	.x(function(d) { return x(d.date); })
	.y0(function(d) { return y1(d.jobgainsunder25); })
	.y1(function(d) { return y1(d.jobgainsunder25+d.jobgains2554); });

var areaOver54 = d3.svg.area()
	.x(function(d) { return x(d.date); })
	.y0(function(d) { return y1(d.jobgainsunder25+d.jobgains2554); })
	.y1(function(d) { return y1(d.jobgainsunder25+d.jobgains2554+d.jobgainsover54)+1.5; });

var lineUnder25 = d3.svg.line()
	.x(function(d) { return x(d.date); })
	.y(function(d) { return y1(d.jobgainsunder25); });

var line2554 = d3.svg.line()
	.x(function(d) { return x(d.date); })
	.y(function(d) { return y1(d.jobgainsunder25+d.jobgains2554); });

var unempLineTwo = d3.svg.line()
	.x(function(d) { return x(d.date); })
	.y(function(d) { return y0(d.unemployment2554); });

var slideValue;

d3.csv("data.csv", function(error, data) {
	data.forEach(function(d) {
		d.date = parseDate(d.date);
		d.employment = +d.employment;
		d.unemploymentrate = +d.unemploymentrate;
		d.idnumber = +d.idnumber;
		d.jobgainsunder25 = +d.jobgainsunder25;
		d.jobgains2554 = +d.jobgains2554;
		d.jobgainsover54 = +d.jobgainsover54;
		d.jobgrowthunder25 = +d.jobgrowthunder25;
		d.jobgrowth2554 = +d.jobgrowth2554;
		d.jobgrowthover54 = +d.jobgrowthover54;
		d.unemployment2554 = +d.unemployment2554;
	});

	var filteredData = data.filter(function(d) { return d.idnumber > 201001; });

	x.domain([parseDate("1-1-2010"),parseDate("9-31-2014")]);
	y1.domain([0,d3.max(data,function (d) { return 1.05*d.jobgrowthover54})]);
	y0.domain([d3.min(data,function (d) { return 0.9*d.unemploymentrate}),d3.max(data,function (d) { return 1.1*d.unemploymentrate})]);

	svg.append("g")
		.attr("class", "right axis")
		.call(yAxisRight);

	svg.append("g")
		.attr("class", "left axis")
		.style("fill", "#772210")
		.call(yAxisLeft);

	svg.append("text")
		.attr("class", "left label")
		.text("Unemployment rate, %")
		.attr("x", -margin.left)
		.attr("y", 10)
		.style("opacity", 0);

	svg.append("text")
		.attr("class", "right label")
		.text("Employment growth by age, %")
		.attr("x", width-148)
		.attr("y", -15)
		.style("fill", "#333");

	d3.selectAll(".left.axis")
		.style("opacity", 0);

	var employmentPath = svg.append("path")
		.attr("class", "employment");

	var unemploymentPath = svg.append("path")
		.attr("class", "unemploymentrate");

	var growthUnder25 = d3.svg.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y1(d.jobgrowthunder25); });

	var growth2554 = d3.svg.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y1(d.jobgrowth2554); });

	var growthOver54 = d3.svg.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y1(d.jobgrowthover54); });

	svg.append("path")
		.attr("class", "growthlineUnder25")
		.datum(filteredData)
		.style("stroke", "#648d9e")
		.attr("d", growthUnder25);

	svg.append("path")
		.attr("class", "growthline2554")
		.datum(filteredData)
		.style("stroke", "#00485d")
		.attr("d", growth2554);

	svg.append("path")
		.attr("class", "jobgains")
		.datum(filteredData)
		.style("stroke", "#00a1ce")
		.attr("d", growthOver54);

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	var group = svg.selectAll(".group")
		.data(data)
		.enter().append("g")
		.attr("class", "group")
		.attr("id", function(d) { return "group" + [d.idnumber]; });

	group.append("circle")
		.attr("class", "circleUnder25")
		.attr("transform", function(d) { return "translate(" + x(d.date) + "," + y1(d.jobgrowthunder25) + ")"; } )
		.attr("r", 4)
		.style("opacity", 0)
		.attr("id", function(d) { return "circleUnder25" + [d.idnumber]; });

	group.append("circle")
		.attr("class", "circle2554")
		.attr("transform", function(d) { return "translate(" + x(d.date) + "," + y1(d.jobgrowth2554) + ")"; } )
		.attr("r", 4)
		.style("opacity", 0)
		.attr("id", function(d) { return "circle2554" + [d.idnumber]; });

	group.append("circle")
		.attr("class", "circleOver54")
		.attr("transform", function(d) { return "translate(" + x(d.date) + "," + y1(d.jobgrowthover54) + ")"; } )
		.attr("r", 4)
		.style("opacity", 0)
		.attr("id", function(d) { return "circleOver54" + [d.idnumber]; });

	d3.selectAll("#group201407 circle")
		.style("opacity", 1);

	svg.append("text")
		.text("Under 25")
		.attr("class", "areaLabel")
		.attr("id", "areaLabelUnder25")
		.attr("x", 455)
		.attr("y", 179)
		.style("fill", "#648d9e");

	svg.append("text")
		.text("25-54")
		.attr("class", "areaLabel")
		.attr("id", "areaLabel2554")
        .attr("x", 471)
		.attr("y", 310)
		.style("fill", "#00485d");

	svg.append("text")
		.text("Over 54")
		.attr("class", "areaLabel")
		.attr("id", "areaLabelOver54")
		.attr("x", 460)
		.attr("y", 5)
		.style("fill", "#00a1ce");

	d3.select("#next").on("click", function(){
		slideValue = d3.select("#next").attr("value");
		if (slideValue=="start") {
			employmentLine();
		} else if (slideValue=="one") {
			jobGains();
		} else if (slideValue=="two") {
			jobGrowthByAge();
		} else if (slideValue=="three") {
			fadeOut();
		} else if (slideValue=="four") {
			employmentLine();
		}
	});


	function animateLine() {
		var l = this.getTotalLength();
		i = d3.interpolateString("0," + l, l + "," + l);
		return function(t) { return i(t); };
	}

	function highlight(marker) {
		d3.select(marker)
			.style("opacity", 1)
			.transition()
			.duration(250)
			.attr("r", 6)
			.style("stroke-width",3.75)
			.transition()
			.duration(250)
			.attr("r", 4)
			.style("stroke-width",2.5);
	}

	function employmentLine() {

		setTimeout(function(){
		d3.select("#next").html("Next<span class='fa fa-caret-right'></span>");
		}, 500);

		d3.select("#next").on('click', null);

		setTimeout(function(){
		d3.select("#text")
			.style("padding-top", "25px");
		}, 500);

		d3.select("svg")
			.transition()
			.duration(500)
			.style("opacity", 1);

		d3.selectAll(".dot")
			.transition()
			.duration(250)
			.style("color", "#ccc");

		d3.select("#dotone")
			.transition()
			.duration(250)
			.style("color", "#747474");

		d3.selectAll(".group circle")
			.style("opacity", 0);

		d3.selectAll("#slides")
			.transition()
			.duration(500)
			.style("opacity", 0)
			.transition()
			.delay(500)
			.duration(500)
			.style("opacity", 1);

		d3.selectAll("#buttons")
			.transition()
			.delay(500)
			.style("opacity", 0)
			.style("display", "none");

		d3.selectAll(".slideintro")
			.transition()
			.delay(500)
			.style("opacity", 0)
			.style("display", "none");

		d3.selectAll(".slideseven")
			.transition()
			.delay(500)
			.style("opacity", 0)
			.style("display", "none");

		d3.selectAll(".slideone")
			.transition()
			.delay(500)
			.style("opacity", 1)
			.style("display", "block");

		d3.select(".growthlineUnder25")
			.transition()
			.duration(500)
			.style("opacity", 0);

		d3.select(".growthline2554")
			.transition()
			.duration(500)
			.style("opacity", 0);

		d3.select(".jobgains")
			.transition()
			.duration(500)
			.style("opacity", 0);

		d3.selectAll(".areaLabel")
			.transition()
			.duration(500)
			.style("opacity", 0)
			.remove();

		x = d3.time.scale()
			.range([0, width])
			.domain([parseDate("1-1-2008"),parseDate("12-31-2014")]);

		xAxis = d3.svg.axis()
			.scale(x)
			.tickFormat(d3.time.format("%Y"))
			.ticks(7)
			.orient("bottom");

		d3.select(".x.axis")
			.transition()
        	.delay(500)
			.duration(500)
			.ease("linear")
			.call(xAxis);

		y1 = d3.scale.linear()
			.range([height, 0])
			.domain([d3.min(data,function (d) { return 0.98*d.employment}),d3.max(data,function (d) { return 1.02*d.employment})]);

		yAxisRight = d3.svg.axis()
			.scale(y1)
			.orient("right")
			.tickSize(width);

		d3.select(".right.axis")
			.transition()
			.duration(500)
			.style("opacity", 0)
			.transition()
			.duration(50)
			.style("fill", "#00a1ce")
			.call(yAxisRight)
			.transition()
			.delay(550)
			.duration(500)
			.style("opacity", 1);

		d3.selectAll(".circleUnder25")
			.attr("class", "empcircle")
			.attr("transform", function(d) { return "translate(" + x(d.date) + "," + y1(d.employment) + ")"; } )
			.attr("r", 4)
			.attr("id", function(d) { return "empCircle" + [d.idnumber]; });

		d3.selectAll(".circle2554")
			.attr("class", "unempcircle")
			.attr("transform", function(d) { return "translate(" + x(d.date) + "," + y0(d.unemploymentrate) + ")"; } )
			.attr("r", 4)
			.attr("id", function(d) { return "unempCircle" + [d.idnumber]; });

		d3.select("#group201407").append("text")
			.attr("x", function(d) { return x(d.date) + 10; })
			.attr("y", function(d) { return y1(d.employment) + 4; })
			.attr("id", function(d) { return "empSlide" + [d.idnumber]; });

		d3.select("#group201407").append("text")
			.attr("x", function(d) { return x(d.date) + 10; })
			.attr("y", function(d) { return y0(d.unemploymentrate) + 4; })
			.attr("id", function(d) { return "unempSlide" + [d.idnumber]; });

		d3.select("#empSlide201407")
			.text(function(d) { return numberFormat([d.employment]); })
			.style("fill", "#00a1ce");

		d3.select("#unempSlide201407")
			.text(function(d) { return formatPercentDetailed([d.unemploymentrate]/100); })
			.style("fill", "#772210");

		d3.select(".right.label")
			.transition()
			.duration(500)
			.style("opacity", 0)
			.transition()
			.duration(50)
			.style("fill", "#00a1ce")
			.text("Total non-farm employment, m")
			.attr("x", width-145)
			.attr("y", 10)
			.transition()
			.delay(550)
			.duration(500)
			.style("opacity", 1);

		d3.select(".employment")
			.datum(data)
			.attr("d", empLine)
			.transition()
			.duration(2500)
			.ease("linear")
			.attrTween("stroke-dasharray", animateLine)
			.each("start", function() {
				d3.select(".employment")
					.style("opacity", 1);
			})
			.each("end", function() {
				marker = "#empCircle201407";
				highlight(marker);
				d3.select("#empSlide201407")
					.transition()
					.duration(500)
					.style("opacity", 1);

			setTimeout(unemploymentLine, 4000);
			});
		d3.timer.flush();
	}

	function unemploymentLine() {

		document.getElementById("next").setAttribute("value", "one");

		d3.select("#dottwo")
			.transition()
			.duration(250)
			.style("color", "#747474");

		d3.selectAll(".slidetwo")
			.transition()
			.delay(500)
			.style("opacity", 1)
			.style("display", "block");

		d3.select(".unemploymentrate")
			.datum(data)
			.attr("d", unempLine)
			.transition()
			.duration(2500)
			.ease("linear")
			.attrTween("stroke-dasharray", animateLine)
			.each("start", function() {
				d3.select(".unemploymentrate")
					.style("opacity", 1);
				d3.selectAll(".left.axis")
					.transition()
					.duration(750)
					.style("opacity", 1);
				d3.selectAll(".left.label")
					.transition()
					.duration(750)
					.style("opacity", 1)
			})
			.each("end", function() {
				marker = "#unempCircle201407";
				highlight(marker);
				d3.select("#unempSlide201407")
					.transition()
					.duration(500)
					.style("opacity", 1);

			});

		setTimeout(function(){
			d3.select("#next").on("click", function(){jobGains();});
			d3.selectAll("#buttons")
				.transition()
				.delay(1000)
				.duration(750)
				.style("opacity", 1)
				.style("display", "block");
		}, 4000);
	}


	function jobGains() {
		d3.select("#next").on('click', null);

		setTimeout(function(){
		d3.select("#text")
			.style("padding-top", "15px");
		}, 500);

		d3.select("#dotthree")
			.transition()
			.duration(250)
			.style("color", "#747474");

		d3.selectAll("#slides")
			.transition()
			.duration(500)
			.style("opacity", 0)
			.transition()
			.delay(1500)
			.duration(500)
			.style("opacity", 1);

		d3.selectAll("#buttons")
			.transition()
			.delay(500)
			.style("opacity", 0)
			.style("display", "none");

		d3.selectAll(".slideone")
			.transition()
			.delay(500)
			.style("opacity", 0)
			.style("display", "none");

		d3.selectAll(".slidetwo")
			.transition()
			.delay(500)
			.style("opacity", 0)
			.style("display", "none");

		d3.selectAll(".slidethree")
			.transition()
			.delay(2000)
			.style("opacity", 1)
			.style("display", "block");

		d3.select(".employment")
			.transition()
			.duration(750)
			.style("opacity", 0);

		d3.select(".right.label")
			.transition()
			.duration(500)
			.style("opacity", 0)
			.transition()
			.duration(0)
			.style("fill", "#333")
			.text("Employment gains, m")
			.attr("x", width-110)
			.attr("y", 0)
			.transition()
			.delay(1950)
			.duration(500)
			.style("opacity", 1);

		d3.select(".left.label")
			.transition()
			.duration(500)
			.style("opacity", 0);

		d3.select(".unemploymentrate")
			.transition()
        	.duration(500)
			.style("opacity", 0);

		d3.selectAll(".left.axis")
			.transition()
        	.duration(500)
			.style("opacity", 0);

		d3.selectAll(".group circle")
			.style("opacity", 0);

		d3.selectAll(".group text")
			.style("opacity", 0)
			.remove();

		d3.select(".jobgains")
			.style("opacity", 1)
			.datum(filteredData)
			.attr("d", empLine);

		x = d3.time.scale()
			.range([0, width])
			.domain([parseDate("1-1-2010"),parseDate("7-1-2014")]);

		xAxis = d3.svg.axis()
			.scale(x)
			.tickFormat(d3.time.format("%Y"))
			.ticks(5)
			.orient("bottom");

		d3.select(".x.axis")
			.transition()
        	.delay(500)
			.duration(1500)
			.ease("linear")
			.call(xAxis);

		y1 = d3.scale.linear()
			.range([height, 0])
			.domain([0,d3.max(filteredData,function (d) { return 1.05*d.jobgains})]);

		yAxisRight = d3.svg.axis()
			.scale(y1)
			.orient("right")
			.tickSize(width);

		d3.select(".right.axis")
			.transition()
			.duration(500)
			.style("opacity", 0)
			.style("fill", "#333")
			.transition()
			.delay(1500)
			.call(yAxisRight)
			.transition()
			.duration(500)
			.style("opacity", 1);

		var jobgains = d3.svg.line()
			.x(function(d) { return x(d.date); })
			.y(function(d) { return y1(d.jobgains); });

		d3.select(".jobgains")
			.transition()
        	.delay(500)
        	.duration(1500)
        	.ease("linear")
			.attr("d", jobgains);

		setTimeout(jobGainsByAge, 6000);
	}


	function jobGainsByAge() {

		document.getElementById("next").setAttribute("value", "two");

		var delay = 5500;

		d3.select("#dotfour")
			.transition()
			.delay(delay)
			.duration(250)
			.style("color", "#747474");

		d3.select("#dotfive")
			.transition()
			.delay(2*delay)
			.duration(250)
			.style("color", "#747474");

		d3.select("#dotsix")
			.transition()
			.delay(3*delay)
			.duration(250)
			.style("color", "#747474");

		d3.selectAll("#slides")
			.transition()
			.delay(delay)
			.duration(500)
			.style("opacity", 0)
			.transition()
			.delay(delay)
			.duration(500)
			.style("opacity", 1);

		d3.selectAll(".slidefourone")
			.transition()
			.delay(delay)
			.duration(500)
			.style("opacity", 1)
			.style("display", "block");

		d3.selectAll(".slidefourtwo")
			.transition()
			.delay(2*delay)
			.duration(500)
			.style("opacity", 1)
			.style("display", "block");

		d3.selectAll(".slidefourthree")
			.transition()
			.delay(3*delay)
			.duration(500)
			.style("opacity", 1)
			.style("display", "block");

		svg.append("path")
			.style("opacity", 0)
			.datum(filteredData)
			.attr("class", "areaUnder25")
			.attr("d", areaUnder25)
			.transition()
        	.delay(500)
        	.duration(1000)
			.style("opacity", 1)
			.transition()
        	.delay(2*delay)
        	.duration(500)
			.style("opacity", 0.5)
			.transition()
        	.delay(4*delay)
        	.duration(500)
			.style("opacity", 1);

		svg.append("path")
			.style("opacity", 0)
			.datum(filteredData)
			.attr("class", "area2554")
			.attr("d", area2554)
			.transition()
        	.delay(500)
        	.duration(1000)
			.style("opacity", 1)
			.transition()
        	.delay(delay)
        	.duration(500)
			.style("opacity", 0.5)
			.transition()
        	.delay(2*delay)
        	.duration(500)
			.style("opacity", 1)
			.transition()
        	.delay(3*delay)
        	.duration(500)
			.style("opacity", 0.5)
			.transition()
        	.delay(4*delay)
        	.duration(500)
			.style("opacity", 1);

		svg.append("path")
			.style("opacity", 0)
			.datum(filteredData)
			.attr("class", "areaOver54")
			.attr("d", areaOver54)
			.transition()
        	.delay(500)
        	.duration(1000)
			.style("opacity", 1)
			.transition()
        	.delay(delay)
        	.duration(500)
			.style("opacity", 0.5)
			.transition()
        	.delay(3*delay)
        	.duration(500)
			.style("opacity", 1);

		svg.append("path")
			.style("opacity", 0)
			.attr("class", "stackedlineUnder25")
			.datum(filteredData)
			.attr("d", lineUnder25)
			.transition()
        	.delay(500)
        	.duration(1000)
			.style("opacity", 1);

		svg.append("path")
			.style("opacity", 0)
			.attr("class", "stackedline2554")
			.datum(filteredData)
			.attr("d", line2554)
			.transition()
        	.delay(500)
        	.duration(1000)
			.style("opacity", 1);

		d3.select(".jobgains")
			.transition()
        	.delay(500)
        	.duration(1000)
			.style("stroke", "#151515");

		svg.append("text").text("Under 25")
			.style("opacity", 0)
			.attr("class", "areaLabel")
			.attr("id", "areaLabelUnder25")
			.attr("x", 440)
			.attr("y", 333)
			.transition()
        	.delay(delay)
        	.duration(1000)
			.style("opacity", 1);

		svg.append("text").text("25-54")
			.style("opacity", 0)
			.attr("class", "areaLabel")
			.attr("id", "areaLabel2554")
			.attr("x", 465)
			.attr("y", 264)
			.transition()
        	.delay(2*delay)
        	.duration(1000)
			.style("opacity", 1);

		svg.append("text").text("Over 54")
			.style("opacity", 0)
			.attr("class", "areaLabel")
			.attr("id", "areaLabelOver54")
			.attr("x", 448)
			.attr("y", 140)
			.transition()
        	.delay(3*delay)
        	.duration(1000)
			.style("opacity", 1);

		d3.select(".growthlineUnder25")
			.datum(filteredData)
			.attr("d", lineUnder25)
			.transition()
        	.delay(4*delay)
			.style("opacity", 1);

		d3.select(".growthline2554")
			.datum(filteredData)
			.attr("d", line2554)
			.transition()
        	.delay(4*delay)
			.style("opacity", 1);

		setTimeout(function(){
			d3.select("#next").on("click", function(){jobGrowthByAge();});
			d3.selectAll("#buttons")
				.transition()
				.delay(1000)
				.duration(750)
				.style("opacity", 1)
				.style("display", "block");
		}, 4*delay+750);

	}


	function jobGrowthByAge() {
		d3.select("#next").on('click', null);

		setTimeout(function(){
		d3.select("#text")
			.style("padding-top", "0px");
		}, 500);

		document.getElementById("next").setAttribute("value", "three");

		d3.select("#dotseven")
			.transition()
			.duration(250)
			.style("color", "#747474");

		d3.select("#doteight")
			.transition()
			.delay(10000)
			.duration(250)
			.style("color", "#747474");

		d3.selectAll("#slides")
			.transition()
			.duration(500)
			.style("opacity", 0)
			.transition()
			.delay(2000)
			.duration(500)
			.style("opacity", 1);

		d3.selectAll("#buttons")
			.transition()
			.delay(500)
			.style("opacity", 0)
			.style("display", "none");

		d3.selectAll(".slidethree")
			.transition()
			.delay(500)
			.style("opacity", 0)
			.style("display", "none");

		d3.selectAll(".slidefourone")
			.transition()
			.delay(500)
			.style("opacity", 0)
			.style("display", "none");

		d3.selectAll(".slidefourtwo")
			.transition()
			.delay(500)
			.style("opacity", 0)
			.style("display", "none");

		d3.selectAll(".slidefourthree")
			.transition()
			.delay(500)
			.style("opacity", 0)
			.style("display", "none");

		d3.selectAll(".slidefive")
			.transition()
			.delay(2000)
			.style("opacity", 1)
			.style("display", "block");

		d3.selectAll(".slidesix")
			.transition()
			.delay(10000)
        	.duration(500)
			.style("opacity", 1)
			.style("display", "block");

		d3.select(".stackedlineUnder25")
			.remove();

		d3.select(".stackedline2554")
			.remove();

		d3.select(".areaUnder25")
			.transition()
        	.duration(500)
			.style("opacity", 0)
			.remove();

		d3.select(".area2554")
			.transition()
        	.duration(500)
			.style("opacity", 0)
			.remove();

		d3.select(".areaOver54")
			.transition()
        	.duration(500)
			.style("opacity", 0)
			.remove();

		d3.select(".right.label")
			.transition()
        	.duration(500)
			.style("opacity", 0)
			.transition()
			.duration(0)
			.text("Employment growth by age, %")
			.attr("x", width-148)
			.attr("y", -15)
			.transition()
        	.delay(2000)
        	.duration(500)
			.style("opacity", 1);

		d3.select("#areaLabelUnder25")
			.style("opacity", 0)
			.attr("x", 455)
			.attr("y", 179)
			.style("fill", "#648d9e")
			.text("Under 25")
			.transition()
        	.delay(2000)
        	.duration(500)
			.style("opacity", 1);

		d3.select("#areaLabel2554")
			.style("opacity", 0)
        	.attr("x", 471)
			.attr("y", 310)
			.style("fill", "#00485d")
			.text("25-54")
			.transition()
        	.delay(2000)
        	.duration(500)
			.style("opacity", 1);

		d3.select("#areaLabelOver54")
			.style("opacity", 0)
			.attr("x", 460)
			.attr("y", 5)
			.style("fill", "#00a1ce")
			.text("Over 54")
			.transition()
        	.delay(2000)
        	.duration(500)
			.style("opacity", 1);

		x = d3.time.scale()
			.range([0, width])
			.domain([parseDate("1-1-2010"),parseDate("9-31-2014")]);

		xAxis = d3.svg.axis()
			.scale(x)
			.tickFormat(d3.time.format("%Y"))
			.ticks(5)
			.orient("bottom");

		y1 = d3.scale.linear()
			.range([height, 0])
			.domain([0,d3.max(data,function (d) { return 1.05*d.jobgrowthover54})]);

		yAxisRight = d3.svg.axis()
			.scale(y1)
			.orient("right")
			.tickFormat(formatPercent)
			.tickSize(width);

		d3.select(".right.axis")
			.transition()
			.duration(500)
			.style("opacity", 0)
			.style("fill", "#333")
			.transition()
			.duration(1500)
			.call(yAxisRight)
			.transition()
			.duration(500)
			.style("opacity", 1);

		var growthUnder25 = d3.svg.line()
			.x(function(d) { return x(d.date); })
			.y(function(d) { return y1(d.jobgrowthunder25); });

		var growth2554 = d3.svg.line()
			.x(function(d) { return x(d.date); })
			.y(function(d) { return y1(d.jobgrowth2554); });

		var growthOver54 = d3.svg.line()
			.x(function(d) { return x(d.date); })
			.y(function(d) { return y1(d.jobgrowthover54); });

		d3.select(".growthlineUnder25")
			.datum(filteredData)
			.transition()
        	.duration(2000)
        	.ease("linear")
			.style("stroke", "#648d9e")
			.attr("d", growthUnder25);

		d3.select(".growthline2554")
			.transition()
        	.duration(2000)
        	.ease("linear")
			.style("stroke", "#00485d")
			.attr("d", growth2554);

		d3.select(".jobgains")
			.transition()
        	.duration(2000)
        	.ease("linear")
			.style("stroke", "#00a1ce")
			.attr("d", growthOver54);

		d3.select(".x.axis")
			.transition()
        	.delay(500)
			.duration(1500)
			.ease("linear")
			.call(xAxis);

		d3.selectAll(".empcircle")
			.attr("class", "circleUnder25")
			.attr("transform", function(d) { return "translate(" + x(d.date) + "," + y1(d.jobgrowthunder25) + ")"; } )
			.attr("r", 4)
			.style("opacity", 0)
			.attr("id", function(d) { return "circleUnder25" + [d.idnumber]; });

		d3.selectAll(".unempcircle")
			.attr("class", "circle2554")
			.attr("transform", function(d) { return "translate(" + x(d.date) + "," + y1(d.jobgrowth2554) + ")"; } )
			.attr("r", 4)
			.style("opacity", 0)
			.attr("id", function(d) { return "circle2554" + [d.idnumber]; });

		d3.selectAll(".circleOver54")
			.attr("transform", function(d) { return "translate(" + x(d.date) + "," + y1(d.jobgrowthover54) + ")"; } )
			.attr("r", 4)
			.style("opacity", 0)
			.attr("id", function(d) { return "circleOver54" + [d.idnumber]; });

		d3.selectAll("#group201407 circle")
			.transition()
        	.delay(2000)
        	.duration(500)
			.style("opacity", 1);

		setTimeout(function(){
			d3.select("#next").on("click", function(){fadeOut();});
			d3.selectAll("#buttons")
				.transition()
				.delay(1000)
				.duration(750)
				.style("opacity", 1)
				.style("display", "block");
		}, 17000);

	}

	function fadeOut() {

		d3.select("#next").on('click', null);

		setTimeout(function(){
		d3.select("#text")
			.style("padding-top", "0px");
		}, 500);

		document.getElementById("next").setAttribute("value", "four");

		d3.select("svg")
			.transition()
			.duration(500)
			.style("opacity", 0.5);

		d3.select("#dotnine")
			.transition()
			.duration(250)
			.style("color", "#747474");

		d3.selectAll("#slides")
			.transition()
			.duration(500)
			.style("opacity", 0)
			.transition()
			.delay(500)
			.duration(500)
			.style("opacity", 1);

		d3.selectAll("#buttons")
			.transition()
			.delay(500)
			.style("opacity", 0)
			.style("display", "none");

		d3.selectAll(".slidefive")
			.transition()
			.delay(500)
			.style("opacity", 0)
			.style("display", "none");

		d3.selectAll(".slidesix")
			.transition()
			.delay(500)
			.style("opacity", 0)
			.style("display", "none");

		d3.selectAll(".slideseven")
			.transition()
			.delay(500)
        	.duration(500)
			.style("opacity", 1)
			.style("display", "block");

		d3.select(".slideseven")
			.transition()
			.delay(500)
        	.duration(500)
			.style("font-weight", "bold")
			.style("opacity", 1)
			.style("display", "block");

		setTimeout(function(){
			d3.select("#next").on("click", function(){employmentLine();});
			d3.select("#next").html("Again<span class='fa fa-repeat'></span>");
			d3.selectAll("#buttons")
				.transition()
				.delay(1000)
				.duration(750)
				.style("opacity", 1)
				.style("display", "block");
		}, 4000);


	}

});

d3.select(self.frameElement).style("height", "615px");

