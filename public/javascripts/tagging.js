/**
 * Created by rajeevguru on 25/09/14.
 */
//

$(document).ready(function() {
    var msgcontent;
    $.get('templates/tagmodal.html',function(data){

        msgcontent = data;

    });

    var resolveContent = function(e) {
      clickedpic = $(e);
      msgcontent = msgcontent.replace('SRC_TO_BE_REPLACED',clickedpic.children('img').attr('src'));
      return msgcontent;

    };




    $('.looks-wrapper').click(function(event) {
        console.log(event,this);
        bootbox.dialog({
            title: 'Tag Image',
            message: resolveContent(this)
        });

    });


});