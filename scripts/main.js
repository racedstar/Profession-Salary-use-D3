$(document).ready(function(){
    var svgWidth = 800;
    var svgHeight = 400;
    var margin = 50;
    var data = getData('Recurring');
    var yMax = salaryMax(data);

    drawCharts(data, svgWidth, svgHeight, margin, yMax);

    $('#btnRecurring').click(function(){
        data = getData('Recurring');
        yMax = salaryMax(data);
        updateChart(data, svgWidth, svgHeight, margin, yMax);
    })
    $('#btnSecondary').click(function(){
        data = getData('Secondary');
        yMax = salaryMax(data);
        updateChart(data, svgWidth, svgHeight, margin, yMax);
    })
    $('#btnHighSchool').click(function(){
        data = getData('HighSchool');
        yMax = salaryMax(data);
        updateChart(data, svgWidth, svgHeight, margin, yMax);
    })
    $('#btnSpecialist').click(function(){
        data = getData('Specialist');
        yMax = salaryMax(data);
        updateChart(data, svgWidth, svgHeight, margin, yMax);
    })
    $('#btnUniversity').click(function(){
        data = getData('University');
        yMax = salaryMax(data);
        updateChart(data, svgWidth, svgHeight, margin, yMax);
    })
    $('#btnGraduateSchool').click(function(){
        data = getData('GraduateSchool');
        yMax = salaryMax(data);
        updateChart(data, svgWidth, svgHeight, margin, yMax);
    })
})

var getData = function(type){
    $.ajaxSettings.async = false;
    var rawData = new Array();
    var category = 2;

    switch(type){
        case 'Recurring':  //經常性薪資
            category = 2;
            break;
        case 'Secondary':  //學歷中學以下薪資
            category = 4;
            break;
        case 'HighSchool':  //學歷高中薪資
            category = 6;
            break;
        case 'Specialist':  //學歷專科薪資
            category = 8;
            break;
        case 'University': //'學歷大學薪資'
            category = 10;
            break;
        case 'GraduateSchool':  //'學歷研究所薪資'
            category = 12;
            break;
    }

    $.getJSON('./A17000000J-020066-mAH.json', function(data){
        var keys = Object.getOwnPropertyNames(data[0]);
        for(var i = 0; i < data.length; i++){
            if(data[i][keys[1]].indexOf('-') >= 0){
                continue;
            }
            var seriesData = {
                profession: data[i][keys[1]],//set職業名稱
                salary: parseInt(data[i][keys[category]])//set薪資(int)
            }
            rawData.push(seriesData);
        }
    })
    return rawData;
}

//拿到薪水最高的值
var salaryMax = function(data){
    var yMax = d3.max(data, function(data){
        return data.salary;
    });
    return yMax;
}

//(chartdata, svg寬度, svg高度, 間距)
var drawCharts = function(rawData, svgWidth, svgHeight, margin, yMax){    
    svgWidth = svgWidth - margin;
    svgHeight = svgHeight - margin;    

    //算出x的位置
    var xScale = d3.scaleBand()
                    .domain(rawData.map(function(d){
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
                });
    
    //在body內畫出svg
    var svg = d3.select('#divCharts')
        .append('svg')
        .attrs({
            width: svgWidth + margin,
            height: svgHeight + margin + 50,
            'style': 'padding-top: 50px; '
        });

    //畫出長條圖
    svg.selectAll('.bar')
        .data(rawData)
        .enter()
        .append('rect')
        .call(tip)
        .classed('bar', true)
        .attrs({
            x: function(data){
                return xScale(data.profession);
            },
            y: function(data){
                return svgHeight - yScale(data.salary);
            },
            width: xScale.bandwidth(),
            //width: 0,
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
            'class': 'yAxis',
            'transform': 'translate(' + (margin - 10) + ', ' + 0 + ')'
        })       
        .call(yAxis);
}



//(chartdata, svg寬度, svg高度, 間距)
var updateChart = function(rawData, svgWidth, svgHeight, margin, yMax){    
    svgWidth = svgWidth - margin;
    svgHeight = svgHeight - margin;

    //算出x的位置
    var xScale = d3.scaleBand()
                    .domain(rawData.map(function(d){
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
                });
    
    //畫出長條圖
    var bars = d3.select('svg');
    
        bars.selectAll('.bar')
        .remove()
        .exit()
        .data(rawData)
        .enter()   
        .append('rect')
        .call(tip)
        .transition()
        .duration(2500)
        .attrs({
            'class': 'bar',
            x: function(data){
                return xScale(data.profession);
            },
            y: function(data){                
                return svgHeight - yScale(data.salary);
            },
            width: xScale.bandwidth(),
            // width: 0,
            height: function(data){
                return yScale(data.salary);
            }
        })            
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
}