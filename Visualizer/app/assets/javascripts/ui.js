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
                    $('.valueRangeSlider').slider({min: function() { return $(this).data('min-value');}, 
                                                    max: function() { return $(this).data('max-value');},
                                                     step:1});
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
    // $(document).on("change", ".chartTypeSelect", function() {
    //     $(this).parents('.column').attr('data-chartType', $(this).val());
    //     $(this).parents('.popover').siblings('.popoverContent').find('.chartTypeSelect option[value="'+$(this).val()+'"]').attr('selected', true);
    //     changeChartType($(this).parents('.column').data('id'), $(this).val(), $(this).parents('.axisDroppableContainer').parent().attr('id').substring(0,1));
    // });
    $(document).on("click", ".typeSelect", function() {
        $(this).parents('.column').attr('data-chartType',$(this).attr('value'));
        $(this).parent().parent().siblings('.typeSelectToggle').html($(this).text()+' <span class="caret">');
        $(this).parents('.popover').siblings('.popoverContent').find('.typeSelectToggle').html($(this).text()+' <span class="caret">');
        changeChartType($(this).parents('.column').data('id'), $(this).attr('value'), $(this).parents('.axisDroppableContainer').parent().attr('id').substring(0,1));
    });

    // initilaize the options popover
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

    //buttons for the graphselection
    $(".graphTypeButton").click( function() {
        if (chart.series) {
            for(var i = 0; i < chart.series.length; i++) {
                chart.series[i].update({type: $(this).data('type')}); 
            }
        }
    });
});