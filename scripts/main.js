$(document).ready(function(){
    var data = getData();
    charts(data);
})

var getData = function(){
    $.ajaxSettings.async = false;
    var rawData = new Array();
    $.getJSON('./A17000000J-020066-mAH.json', function(data){
        var keys = Object.getOwnPropertyNames(data[0]);
        for(var i = 0; i < data.length; i++){
            if(data[i][keys[1]].indexOf('-') >= 0){
                continue;
            }
            var seriesData = {
                profession: data[i][keys[1]],//set職業名稱
                salary: parseInt(data[i][keys[2]])//set薪資(int)
            }
            rawData.push(seriesData);
        }
    })
    return rawData;
}

var charts = function(rawData){
    var margin = 50;
    var svgWidth = 1600 - margin;
    var svgHeight =500 - margin;
    var dataset = rawData;    
    var yMax = d3.max(dataset, function(data){
        return data.salary;
    });

    //算出x的位置
    var xScale = d3.scaleBand()
                    .domain(dataset.map(function(d){
                        return d.profession;
                    }))
                    .range([margin, svgWidth])
                    .paddingInner(0.3);
    
    var yScale = d3.scaleLinear()
                    .domain([0, yMax])
                    .range([0, svgHeight]);

    var yScaleAxis = d3.scaleLinear()
                        .domain([0, yMax])                    
                        .range([svgHeight, 0])

    var xAxis = d3.axisBottom(xScale);

    var yAxis = d3.axisLeft(yScaleAxis);

    var svg = d3.select('body')
        .append('svg')
        .attrs({
            width: svgWidth + 50,
            height: svgHeight + 100
        });    

    svg.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attrs({
            class: 'bar',
            x: function(data){
                return xScale(data.profession);
            },
            y: function(data){
                return svgHeight - yScale(data.salary);
            },
            width: xScale.bandwidth(),
            height: function(data){
                return yScale(data.salary);
            }
        });

    svg.selectAll('text')
    .data(dataset)
    .enter()
    .append('text')
    .text(function(data){
        return data.salary;
    })
    .attrs({
        x: function(data){
            return xScale(data.profession);
        },
        y: function(data){
            return svgHeight - yScale(data.salary) + 20;
        },
        fill: 'black',
        'font-size': '14px',
        'text-anchor':'right'
    });           

    svg.append('g')
        .attrs({
            'transform': 'translate(0,' + (svgHeight) + ')'            
        })
        .call(xAxis);
    
    svg.append('g') 
        .attrs({
            'transform': 'translate(' + (margin) + ', ' + 10 + ')'
        })       
        .call(yAxis);

 
}