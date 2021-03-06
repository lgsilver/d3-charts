'use strict';

angular.module('socCharts')
  .directive('columnchart', function () {
    return {
      templateUrl: _SocChartsConfig.path+'views/charts/bar.html',
      restrict: 'A',
      scope: {
	  	'columnchart': '=',
	  	'options': '=',
	  	'loading': '='  
      },
      link: function (scope, element, attrs) {
		  
		scope.$watch("columnchart", function () { 
			scope.create();
		}, true);

		scope.$watch("options", function () { 
			scope.update();
		}, true);
				  
		scope.data = scope.columnchart;
		
		scope.options = angular.extend({ 
			label: "label",
			stack: [
				{ 
					key: "v1",
					label: "Impressions",
					color: "#006699"
				}, {
					key: "v2",
					label: "Comments",
					color: "#996600"
				}, {
					key: "v3",
					label: "Likes",
					color: "#FF0099"
				}
			], 
			height: 400,
			legend: true,
			axis: {
				x: {
					show: true
				},
				y: {
					show: false,
					label: "Traffic"
				}
			},
			sort: "desc"
		}, scope.options);

        $(window).on("resize", function () { 
	    	scope.update();
        });
        		
		scope.create = function () { 

		  	var self = this;
		  
			var container = d3.selectAll(element);
	
			var margin = {top: 20, right: 0, bottom: 30, left: 0};
			
			// Legend fix
			if (scope.options.axis.y.show) { margin.left += 40; };
			
			var width = scope.options.width || element.width();
			
			width = width - margin.left - margin.right;
			var height = scope.options.height - margin.top - margin.bottom;
			
			var x = d3.scale.ordinal()
			    .rangeRoundBands([0, width], .1);			
			
			var y = d3.scale.linear()
			    .rangeRound([height, 0]);
			
			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom");
			
			var yAxis = d3.svg.axis()
			    .scale(y)
			    .orient("left")
			    .tickFormat(d3.format(".2s"));
		 
		  container.selectAll(".chart").selectAll("svg").remove();

		  var svg = container.selectAll(".chart").append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			
		  var data = [];
		  		  			
		  scope.columnchart.forEach(function(d, i) {
		    var y0 = 0;
			data[i] = {
				label: d.label
			};
			
			if (scope.options.stack) { 
			    scope.options.stack.forEach(function (v) { 
			    	data[i].values = data[i].values || [];
			    	
				    if (d[v.key]) { 
				    	var value = {
					    	label: v.label,
					    	color: v.color
				    	};
				    	value.y0 = y0;
				    	value.y1 = y0 += +d[v.key];
					    data[i].values.push(value);
				    }
			    });
		    } else { 
			    data[i].values = [{
				    label: data.label,
				    color: data.color || "black",
				    y0: 0,
				    y1: d.value
			    }];
		    }
		    
		    data[i].total = data[i].values[data[i].values.length - 1].y1;
		    
		  });
		  
		  if (scope.options.sort) {
		  	data.sort(function(a, b) { 
		  		if (scope.options.sort == "desc") { 
		  			return b.total - a.total; 
		  		} else { 
			  		return a.total - b.total;
		  		}
		  	});
		  }
		  
		  x.domain(data.map(function(d) { return d.label; }));
		  y.domain([0, d3.max(data, function(d) { return d.total; })]);
		  
		  if (scope.options.axis.x.show) {
			  svg.append("g")
			      .attr("class", "x axis")
			      .attr("transform", "translate(0," + height + ")")
			      .call(xAxis);
		 }
		 
		 if (scope.options.axis.y.show) { 
			 svg.append("g")
			      .attr("class", "y axis")
			      .call(yAxis)
			    .append("text")
			      .attr("transform", "rotate(-90)")
			      .attr("y", 6)
			      .attr("dy", ".71em")
			      .style("text-anchor", "end")
			      .text(scope.options.axis.y.label);
		 }
		
		  var bar = svg.selectAll(".state")
		      .data(data)
		    .enter().append("g")
		      .attr("class", "g")
		      .attr("transform", function(d) { return "translate(" + x(d.label) + ",0)"; });
		
		  bar.selectAll("rect")
		      .data(function(d) { return d.values; })
		    .enter().append("rect")
		      .attr("width", x.rangeBand())
		      .attr("y", function(d) { return y(d.y1); })
		      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
		      .style("fill", function(d) { return d.color; });
		
		  if (scope.options.legend) { 
			  var legend = svg.selectAll(".legend")
			      .data(scope.options.stack)
			    .enter().append("g")
			      .attr("class", "legend")
			      .attr("transform", function(d, i) { return "translate(-20," + i * 20 + ")"; });
			
			  legend.append("rect")
			      .attr("x", width - 18)
			      .attr("width", 18)
			      .attr("height", 18)
			      .style("fill", function (d) { return d.color; });
			
			  legend.append("text")
			      .attr("x", width - 24)
			      .attr("y", 9)
			      .attr("dy", ".35em")
			      .style("text-anchor", "end")
			      .text(function(d) { return d.label; });
		  }
		};
		
		scope.update = function () { 
			scope.create();
		}

		scope.create();
		
      }
    };
  });
