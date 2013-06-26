
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

    $(function() {
        $( ".axisDroppableContainer" ).sortable( { connectWith : '.axisDroppableContainer',
                                                    receive: function (event, ui){
                                                        if ($('#ySettings .btn').length > 0 && $('#xSettings .btn').length > 0){
                                                            alert('Trigger datasource NOW');
                                                        }
                                                    }
                                                });
    }); 

    $(function() {
        $( "#attributes" ).sortable( { connectWith : '.axisDroppableContainer'});
    }); 

});

