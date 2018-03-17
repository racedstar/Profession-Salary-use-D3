$(document).ready(function(){
    var data = getData(2);
    charts(data);

    $('#changeData').click(function(){
        data = getData(4);
        charts(data);
    })
})

var getData = function(type){
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
                salary: parseInt(data[i][keys[type]])//set薪資(int)
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
    
    //testData
    // var dataset = [{
    //     profession: 'A',
    //     salary: 10
    // },{
    //     profession: 'B',
    //     salary: 20
    // },{
    //     profession: 'C',
    //     salary: 30
    // }];
    
    //取得最高的薪資
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
    
    //算出所有薪水的長條圖                    
    var yScale = d3.scaleLinear()
                    .domain([0, yMax])
                    .range([0, svgHeight]);

    //給yAxis用
    var yScaleAxis = d3.scaleLinear()
                        .domain([0, yMax])                    
                        .range([svgHeight, 0])

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScaleAxis);

    //tooltip
    var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d){
                    return "<strong>Profession: </strong><sapn style=color: blue>" + d.profession + "</span><br />" + "<strong>Salary: </strong><span style='color: red'>" + d.salary + '</span>'
                })
    
    //在body內畫出svg
    var svg = d3.select('body')
        .append('svg')
        .attrs({
            width: svgWidth + margin,
            height: svgHeight + margin + 50,
            'style': 'padding-top: 50px; '
        });    

    //Call tooltip
    svg.call(tip);

    //畫出長條圖
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
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
     
    //畫出X軸
    svg.append('g')
        .attrs({
            'transform': 'translate(0,' + (svgHeight) + ')',
            'class': 'xAxis'
        })
        .call(xAxis);
    
    //畫出Y軸
    svg.append('g') 
        .attrs({
            'transform': 'translate(' + (margin - 10) + ', ' + 0 + ')'
        })       
        .call(yAxis);
}