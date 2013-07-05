var chart;
var loadedColumns = []; //contains column id and the data, needed?
var loadedSeries = []; //contains the series with refernces to columns and the charts series used for altering

$(document).ready(function () { 
    // create initial chart
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'graph'
        },
        title: {
            text: 'Your Graph'
        },
        xAxis: {
            title: {
                text: 'Reference'
            }
        },
        yAxis: {
            title: {
                text: 'Values'
            }
        }
    });
});

var changeChartType = function(columnId, type, axis) {
    for (var i = 0; i < loadedSeries.length; i++) {
        if (loadedSeries[i]['yColumn']['id'] == columnId && loadedSeries[i]['yColumn']['axis'] == axis) {
            chart.series[i].update({type: type});
        }
    }
}

var removeSeriesWithColumn = function(columnId, axis) {
    console.log(axis);
    if (axis == 'x') {
        while (chart.series.length) {
            chart.series[0].remove();
        }
        loadedSeries = [];
    } else {
        var indicesToRemove = [];
        for (var i = 0; i < loadedSeries.length; i++) {
            if (loadedSeries[i]['yColumn']['id'] == columnId && loadedSeries[i]['yColumn']['axis'] == axis) {
                indicesToRemove.push(i);
            }
        }
        for (var i = 0; i < indicesToRemove.length; i++) {
            chart.series[i].remove();
            loadedSeries[i].splice(i, 1);
        }
    }  
};

var reloadData = function() {

    //collect necessary data
    //remove old series (later check for changes)
    //update chart (add series)

    if (($('#ySettings .column').length > 0 || $('#oppositeYSettings .column').length > 0) && $('#xSettings .column').length > 0) {
        var newSeries = [];
        var xAxisColumn = $('#xSettings .btn.disabled');
        var seriesCount = 0;
        var xAxis = {
            "mode": xAxisColumn.data("mode"),
            "column": xAxisColumn.data("column"),
            "type": xAxisColumn.data("type"),
            "table": xAxisColumn.data("table")
        };

        var collectFunction = function(){
            var data = {};
            data["aggregation"] = $(this).data("aggregation");
            data["column"] = $(this).data("column");
            data["type"] = $(this).data("type");
            data["table"] = $(this).data("table");
            data["id"] = $(this).data("id");

            series = {
                'yColumn': data,
                'id': seriesCount,
                'axis': 'y' //later add 'o' for the opposite y axis
            };
            newSeries.push(series);
            seriesCount++;
        };

        $('#ySettings .column').each(collectFunction);
        $('#oppositeYSettings .column').each(collectFunction);


        $.ajax({
            url: 'getContentForSeries',
            type: "POST",
            data: {series: newSeries, xaxis: xAxis},
            dataType: "script",
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            },
            complete: function(jqXHR, textStatus ){
                json = $.parseJSON(jqXHR.responseText);
                if (json.hasOwnProperty("error")){
                    alert(json["error"]);
                }else{

                    console.log(json)
                    // update x-axis
                    if (json[0].hasOwnProperty("categories")) {
                        chart.xAxis[0].setCategories(json[xAxisColumn], true);
                    }
                    chart.xAxis[0].setTitle({text:xAxis['column']}, true);

                    //remove old series from chart
                    while (chart.series.length) {
                        chart.series[0].remove();
                    }

                    for (var i = 0; i < json.length; i++) {

                        // update y-Axis with series
                        chart.addSeries({
                            name: json[i]['name'],
                            data: json[i]['data']
                        }, true);
                    }

                    // load the simple data table on bottom of page

                    $('#dataTable').children().each(function(){
                        $(this).remove();
                    });

                    var headers = '<tr>'
                    headers += '<th>' + xAxis['column'] + '</th>';
                    $.each(json, function(index,val) {
                        if(val != 'rows')
                            headers = headers + '<th>' + val['name'] + '</th>';
                    });
                    headers += '</tr>';

                    $('#dataTable').append(headers);

                    for(var i = 0; i < json[0]['data'].length; i++) {
                        var html = '<tr class="dataTableRow">';

                        if (json[0].hasOwnProperty("categories")) {
                            html += '<td>' + json[0]['categories'][i] + '</td>'; 

                            $.each(json, function(index,val) {
                                if(val != 'rows')
                                    html += '<td>' + val['data'][i] + '</td>';
                            });
                        } else {
                            html += '<td>' + json[0]['data'][i][0] + '</td>';

                            $.each(json, function(index,val) {
                                if(val != 'rows')
                                    html += '<td>' + val['data'][i][1] + '</td>';
                            });
                        }

                        html += '</tr>';
                        $('#dataTable').append(html);
                    }

                    // save created series in global variable
                    loadedSeries = newSeries;
                }   
            }
        });
    }
};

