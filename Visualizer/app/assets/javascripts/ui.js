$(document).ready(function () { 

    $(".modeSelect").click(function(){
        $(this).parents('.column').attr('data-mode',$(this).attr('mode'));
        $(this).parent().parent().siblings('.actionSelect').html($(this).text()+'<span class="caret">');
    });

    $(".axisDroppableContainer").droppable({
        over: function(event, ui){
            $(this).addClass("hoverDroppable");
        },
        out: function(event, ui){
            $(this).removeClass("hoverDroppable");
        },
        drop: function(event, ui) {
            if (($(ui.draggable).data("type") < 2 && $(this).children('[data-id="2"]').length == 0) || ($(ui.draggable).data("type") == 2 && $(this).children('[data-id="1"]').length == 0 && $(this).children('[data-id="0"]').length == 0)) {  
                if ($(this).children('[data-id="' + $(ui.draggable).data("id") + '"]').length <= 0) { //no column twice
                    if ($(this).hasClass('xAxis')) {
                        $(this).children('.btn').remove();
                    }
                    $(this).append($(ui.draggable).clone());

                    reloadData();
                }
            } else {
                alert('You can only add columns of either number or string type at the same time');
            }
            $(this).removeClass("hoverDroppable");
        }
    });

    $(document).on("click", ".axisDroppableContainer .removeColumn", function() {
        $(this).parent().remove();
        reloadData();
    });

    $("#attributes > .btn").draggable({ 
        helper: 'clone'
    });

    $(".graphTypeButton").click( function() {
        if (chart.series) {
            for(var i = 0; i < chart.series.length; i++) {
                chart.series[i].update({type: $(this).data('type')}); 
            }
        }
    });

});

