$(document).ready(function () { 

    //define dropzone for the attributes
    $(".axisDroppableContainer").droppable({
        over: function(event, ui){
            $(this).addClass("hoverDroppable");
        },
        out: function(event, ui){
            $(this).removeClass("hoverDroppable");
        },
        drop: function(event, ui) {
            if ($(this).children('[data-id="' + $(ui.draggable).data("id") + '"]').length <= 0) { //no column twice
                if ($(this).hasClass('xAxis')) {
                    $(this).children('.column').each( function() {
                        removeSeriesWithColumn($(this).data('id'), 'x');
                        $(this).remove();
                    });
                }
                if (($(ui.draggable).data("type") < 2 && $(this).children('[data-id="2"]').length == 0) || ($(ui.draggable).data("type") == 2 && $(this).children('[data-id="1"]').length == 0 && $(this).children('[data-id="0"]').length == 0)) {  
                    $(this).append($(ui.draggable).clone());
                    $('.valueRangeSlider').slider({min: /*function() { return $(this).data('min-value');}*/0, 
                                                    max: /*function() { return $(this).data('max-value');},*/ 100,
                                                     range:true,
                                                     values:function() { 
                                                        var array = Array.new
                                                        array[0] = /*$(this).data('min-value')*/ 20;
                                                        array[1] = /*$(this).data('max-value')*/ 70;
                                                        return array;
                                                    },
                                                     slide: function( event, ui ) {
                                                        console.log( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
                                                      }});
                    reloadData();
                } else {
                    alert('You can only add columns of either number or string type at the same time');
                }
            }
            $(this).removeClass("hoverDroppable");
        }
    });

    //make attributes draggable and clone them
    $("#attributes > .btn").draggable({ 
        helper: 'clone'
    });
    
    //remove a column when x is clicked
    $(document).on("click", ".axisDroppableContainer .removeColumn", function() {
        removeSeriesWithColumn($(this).parent().data('id'), $(this).parents('.axisDroppableContainer').parent().attr('id').substring(0,1));
        $(this).parent().remove();
    });

    // mode selest --> soon deprecated (after aggregation select is used)
    $(document).on("click", ".modeSelect", function() {
        $(this).parents('.column').attr('data-mode',$(this).attr('mode'));
        $(this).parent().parent().siblings('.actionSelect').html($(this).text()+'<span class="caret">');
        reloadData();
    });

    //aggregation select
    $(document).on("click", ".aggrSelect", function() {
        $(this).parents('.column').attr('data-aggregation',$(this).attr('value'));
        $(this).parent().parent().siblings('.aggrSelectToggle').html($(this).text()+' <span class="caret">');
        $(this).parents('.popover').siblings('.popoverContent').find('.aggrSelectToggle').html($(this).text()+' <span class="caret">');
        reloadData();
    });

    //change series chart type
    $(document).on("click", ".typeSelect", function() {
        $(this).parents('.column').attr('data-chartType',$(this).attr('value'));
        $(this).parent().parent().siblings('.typeSelectToggle').html($(this).text()+' <span class="caret">');
        $(this).parents('.popover').siblings('.popoverContent').find('.typeSelectToggle').html($(this).text()+' <span class="caret">');
        changeChartType($(this).parents('.column').data('id'), $(this).attr('value'), $(this).parents('.axisDroppableContainer').parent().attr('id').substring(0,1));
    });

    //initilaize the options popover
    $(document).popover({
        selector: '[rel=popover]',
        html: true,
        placement: 'right',
        title: 'Options',
        content: function() { return $(this).next().html();}
    });

    //close the popover on click on the background
    $(':not(#anything)').on('click', function (e) {
        $('.popoverToggle').each(function () {
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide');
                return;
            }
        });
    });

    //buttons for the graph type selection
    $(".graphTypeButton").click( function() {
        if (chart.series) {
            for(var i = 0; i < chart.series.length; i++) {
                chart.series[i].update({type: $(this).data('type')}); 
            }
        }
    });

    //change the axis types
    $(".axisTypeSelect").change( function() {
        switch($(this).parent().attr('id')) {
            case 'yAxis':
                chart.yAxis[0].update({type: $(this).val()}); 
            case 'oAxis':
                chart.yAxis[1].update({type: $(this).val()}); 
            case 'xAxis':
                chart.xAxis[0].update({type: $(this).val()}); 
        } 
    });

    //change the axis titles #todo: always keep value in sync with chart title
     $(".axisTitle").bind('change onkeydown onpaste oninput', function() {
        console.log('called');
        switch($(this).parent().attr('id')) {
            case 'yAxis':
                chart.yAxis[0].setTitle({text: $(this).val()}); 
                break;
            case 'oAxis':
                chart.yAxis[1].setTitle({text: $(this).val()});
                break;
            case 'xAxis':
                chart.xAxis[0].setTitle({text: $(this).val()});
                break;
        }
    });
    //initialize axis titles
    $('#ySettings .axisTitle').val(chart.options.yAxis[0].title.text);
    $('#oppositeYSettings .axisTitle').val(chart.options.yAxis[1].title.text);
    $('#xSettings .axisTitle').val(chart.options.xAxis[0].title.text);

});