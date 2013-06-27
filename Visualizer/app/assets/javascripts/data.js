
$(document).ready(function () { 
    $('#graph').highcharts({
        chart: {
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
        $( ".axisDroppableContainer" ).sortable( { connectWith : '.axisDroppableContainer',
                                                    receive: function (event, ui){
                                                        if ($('#ySettings .btn').length > 0 && $('#xSettings .btn').length > 0){
                                                            var columns = [];

                                                            var collectFunction = function(){
                                                                var data = {};
                                                                data[$(this).data("mode")] = $(this).data("column");
                                                                columns.push(data);
                                                            };

                                                            $('#ySettings .btn').each(collectFunction);

                                                            $('#xSettings .btn').each(collectFunction);


                                                            $.ajax({
                                                                  url: 'getColumns?tablename=test',
                                                                  type: "POST",
                                                                  data: {columns: columns},
                                                                  dataType: "script",
                                                                  error: function(jqXHR, textStatus, errorThrown) {
                                                                        console.log(textStatus);
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

