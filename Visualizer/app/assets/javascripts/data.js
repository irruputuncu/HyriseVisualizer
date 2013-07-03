var chart;

$(document).ready(function () { 
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'graph',
            type: 'bar'
        },
        title: {
            text: 'Fruit Consumption'
        },
        xAxis: {
            categories: ['Apples', 'Bananas', 'Oranges']
        },
        yAxis: {
            title: {
                text: 'Fruit eaten'
            }
        },
        series: [{
            name: 'Jane',
            data: [1, 0, 4]
        }, {
            name: 'John',
            data: [5, 7, 3]
        }]
    });


    $(function() {
        //$( ".btn" ).draggable({ revert: 'invalid', connectToSortable: '#attributes' });
    }); 

    $(function(){
        $(".modeSelect").click(function(){
            $(this).parent().parent().parent().parent().attr('data-mode',$(this).attr('mode'));
        });
    });

    $(function() {
        $( ".axisDroppableContainer" ).sortable( { 
            connectWith : '.axisDroppableContainer',
            receive: function(event, ui) {
                if ($('#ySettings .btn').length > 0 && $('#xSettings .btn').length > 0) {
                    var columns = [];

                    var collectFunction = function(){
                        var data = {};
                        data["mode"] = $(this).data("mode");
                        data["column"] = $(this).data("column");
                        columns.push(data);
                    };

                    $('#ySettings .btn.disabled').each(collectFunction);


                    $('#xSettings .btn.disabled').each(collectFunction);

                    console.log(columns)

                    $.ajax({
                        url: 'getColumns?tablename=test',
                        type: "POST",
                        data: {columns: columns},
                        dataType: "script",
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        complete: function(jqXHR, textStatus ){
                            json = JSON.parse(jqXHR.responseText);

                            if(json.hasOwnProperty("error")){
                                alert(json["error"]);
                            }else{
                                //load the graph!
                                alert("Loading graph ...");
                            }
                        }
                    });
                }
            }
        });
    }); 

    $(function() {
        $( "#attributes" ).sortable( { connectWith : '.axisDroppableContainer'});
    }); 

});

