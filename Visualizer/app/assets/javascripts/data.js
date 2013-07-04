var chart;
var xAxisColumn
var yAxisColumns = Array.new
var series = Array.new

$(document).ready(function () { 
    // initial chart
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

var reloadData = function() {
    if ($('#ySettings .btn').length > 0 && $('#xSettings .btn').length > 0) {
        var columns = [];
        var table;

        var collectFunction = function(){
            var data = {};
            data["mode"] = $(this).data("mode");
            data["column"] = $(this).data("column");
            columns.push(data);

            table = $(this).data("table");
        };

        $('#ySettings .btn.disabled').each(collectFunction);
        $('#xSettings .btn.disabled').each(collectFunction);

        xAxisColumn = $('#xSettings .btn.disabled').data("column");
        yAxisColumn = $('#ySettings .btn.disabled').data("column");


        $.ajax({
            url: 'getContent?tablename='+table,
            type: "POST",
            data: {columns: columns},
            dataType: "script",
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            },
            complete: function(jqXHR, textStatus ){
                json = $.parseJSON(jqXHR.responseText);
                if(json.hasOwnProperty("error")){
                    alert(json["error"]);
                }else{
                    //load the graph!
                    chart.setTitle({text:table});

                    chart.xAxis[0].setCategories(json[xAxisColumn], true);
                    chart.xAxis[0].setTitle({text:xAxisColumn}, true);
                    chart.yAxis[0].setTitle({text:yAxisColumn}, true);

                    chart.addSeries({name: yAxisColumn,
                                            data: json[yAxisColumn]
                                            }, true);

                    //load the simple data table on top of the graph
                    $('#dataTable').children().each(function(){
                        $(this).remove();
                    });
                    console.log(Object.keys(json).constructor);
                    var keys = Object.keys(json);
                    var headers = '<tr>';

                    $.each(keys,function(index,val){
                        if(val != 'rows')
                            headers = headers + '<th>'+val+'</th>';
                    })

                    headers = headers + '</tr>';
                    $('#dataTable').append(headers);

                    for(var i = 0; i < json['rows'].length; i++){
                        var html = '<tr class="dataTableRow">';

                        for(var j = 0; j < json['rows'][i].length; j++){
                            html = html + '<td>' + json['rows'][i][j] + '</td>';
                        }

                        html = html + '</tr>';
                        $('#dataTable').append(html);
                    }

                }
            }
        });
    }
};

