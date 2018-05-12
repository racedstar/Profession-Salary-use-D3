$(document).ready(function(){
    var svgWidth = 800;
    var svgHeight = 400;
    var margin = 50;
    var data = getData('Recurring');

    drawCharts('Recurring', data, svgWidth, svgHeight, margin, true, false, null, null);

    $('.btn').click(function(){        
        education = $(this).data('education');
        data = getData(education);
        drawCharts(education, data, svgWidth, svgHeight, margin, true, false, null, null);
    })
})

var getData = function(education, profession){
    $.ajaxSettings.async = false;
    var rawData = new Array();    
    var objType = {
        Recurring: 2,
        Secondary: 4,
        HighSchool: 6,
        Specialist: 8,
        University: 10,
        GraduateSchool: 12
    };
    var category = 2;
    category = objType[education];

    $.getJSON('./A17000000J-020066-mAH.json', function(data){
        var keys = Object.getOwnPropertyNames(data[0]);
        for(var i = 0; i < data.length; i++){
            if(profession == null){ //主類別走這條
                if(data[i][keys[1]].indexOf('-') >= 0){
                    continue;
                }                
            }
            else if(data[i][keys[1]].indexOf('-') == -1 || data[i][keys[1]].indexOf(profession) == -1){//子類別走這條
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

//(學歷程度, chartdata, svg寬度, svg高度, 間距)
var drawCharts = function(education, rawData, svgWidth, svgHeight, margin, ifMainData, ifChange, x, y){
    var color = d3.scaleOrdinal(d3.schemeCategory20);  
    var yMax = d3.max(rawData, function(data){
        return data.salary;
    });


    rawData = rawData.sort(function(a, b){
        return d3.ascending(a.salary, b.salary);
    });

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
    var svg = d3.select('svg')        
        .attrs({
            width: svgWidth + margin,
            height: svgHeight + margin + 50,
            'style': 'padding-top: 50px; '
        });

    //畫出x,y軸
    if($('.xAxis').length == 0 && $('.yAxis').length == 0){
        svg.append('g')
        .attrs({
            'class': 'xAxis',
            'transform': 'translate(0,' + (svgHeight) + ')'        
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
    
    //畫出長條圖
    if(ifChange == true){
        svg.selectAll('.bar').remove()
                             .exit()
    }

    var delay = function(d, i) { return i * 50; };

    var bar = svg.selectAll('.bar')
    .data(rawData, function(d){
        return d.profession;
    })
    .enter()
    .append('rect')
    .classed('bar', true)
    .attrs({
        x: function(d){
            if(x != null){
                return x;
            }
            return xScale(d.profession);
        },
        y: function(){
            if(y != null){
                return y;
            }
            return svgHeight;
        },
        height: 0,
        'data-profession': function(d){
            return d.profession;
        },
        'data-education': education
    });
    
    svg.selectAll('.bar')
        .transition()
        .delay(delay)
        .duration(750)
        .attrs({
            x: function(d){
                return xScale(d.profession);
            } ,
            width: xScale.bandwidth(),
            y: function(d){
                return svgHeight - yScale(d.salary);
            },
            height: function(d){                
                return yScale(d.salary);
            },
            fill: function(d, i){
                return color(i);
            }
        });

    //x軸與y軸的動畫
    svg.selectAll('.xAxis').transition().duration(750).call(xAxis).selectAll("g").delay(delay);
    svg.selectAll('.yAxis').transition().delay(delay).duration(750).call(yAxis);    
    
    //給長條圖event
    svg.selectAll('.bar')
    .call(tip)
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
    .on('click', function(){
        $('.d3-tip').remove();
        
        if(ifMainData == true){
            $('#btnMenu').hide();
            var profession = $(this).data('profession');
            var childData = getData(education, profession);
            drawCharts(education, childData, svgWidth, svgHeight, margin, false, true, $(this).attr('x'), $(this).attr('y'));
        }
        if(ifMainData == false){
            $('#btnMenu').show();
            var childData = getData(education);
            drawCharts(education, childData, svgWidth, svgHeight, margin, true, true, $(this).attr('x'), $(this).attr('y'));
        }

    })        
}

