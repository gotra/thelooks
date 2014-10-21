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

    $(document).on("shown.bs.modal",".bootbox",function(e){
       // here is the hook when the modal dialog has been opened
    });

    function showModalDialog(ele) {

        bootbox.dialog({
            title: 'Tag Image',
            message: resolveContent(ele),
            onEscape: function() {
                // check if the content has been modified, if so save

            },
            buttons: {
                next: {
                    label: "Next",
                    className: "btn-success",
                    callback: function() {
                        return false;
                    }
                },
                close : {
                    label: "Close",
                    className: "btn-danger",
                    callback: function() {
                        // close the window, trigger saving if not saved!

                    }

                }
            }

        });

    }




    $('.looks-wrapper').click(function(event) {

        showModalDialog(this);



    });

    // impl infinitejs

    //load templates
    var _t = _.template($('#imgtemplate').html()),
        _r = _.template($('#rowtemplate').html());

    function loadpage(pagenum) {



        var jqxhr =   $.getJSON('proalbum',

            {nottagged:true,
                pagesize:50,
                pagenum:pagenum
            })
            .done(function(resp) {

                // we expect a json array
                var tl =  resp.data.length

                for(var i =0 ; i < 1 ; i++)
                {
                        var xx = resp.data[i];

                    $('#imgcontainer').append(_t({imageId: xx.imageId}));


                }



            })
            .fail(function(data) {
                console.log("failed");
            });

    }

    //loadpage(1);


    // based on http://labs.benholland.me/pinterest/demo-centered.php

    var colCount = 0;
    var colWidth = 300;
    var margin = 10;
    var spaceLeft = 0;
    var windowWidth = 0;
    var blocks = [];

    $(window).resize(setupBlocks);

    function setupBlocks() {
        windowWidth = $(window).width();
        blocks = [];

        // Calculate the margin so the blocks are evenly spaced within the window
        colCount = Math.floor(windowWidth/(colWidth+margin*2));
        spaceLeft = (windowWidth - ((colWidth*colCount)+(margin*(colCount-1)))) / 2;
        console.log(spaceLeft);

        for(var i=0;i<colCount;i++){
            blocks.push(margin + 100);
        }
        positionBlocks();
    }

    function positionBlocks() {
        $('.theLooksItem').each(function(i){
            var min = Array.min(blocks);
            var index = $.inArray(min, blocks);
            var leftPos = margin+(index*(colWidth+margin));
            $(this).css({
                'left':(leftPos+spaceLeft)+'px',
                'top':min+'px'
            });
            blocks[index] = min+$(this).outerHeight()+margin;
        });
    }

    // Function to get the Min value in Array
    Array.min = function(array) {
        return Math.min.apply(Math, array);
    };


    setupBlocks();

});