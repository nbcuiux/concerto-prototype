//Common js files
//= common.js

//Img Styles
//= sources/imgStyles.js


//set rich editor

function transformRichText() {
    var richTextBoxes = $( '.use-rich-text' );


    richTextBoxes.each($.proxy(function(i, e) {
        var block = $(e);
        var switcher = block.find(".use-rich-text__switcher");
        var input = block.find(".use-rich-text__input");
        var instance = null;

        function checkState() {
            if (block.hasClass("use-rich-text--enabled")) {
                switcher.find("input").attr("checked", true);
                instance = input.ckeditor($.noop, {
                    toolbar:
                    [
                        ['Bold', 'Italic', 'Underline', '-', 'NumberedList', 'BulletedList', '-', 'Undo', 'Redo', '-', 'SelectAll'],
                        ['UIColor']
                    ]
                });
            } else {
                switcher.find("input").attr("checked", false);
                if (instance != null) {
                    instance = input.ckeditor(function(){
                        this.destroy();
                        input.val($(input.val()).text());
                        instance = null;
                    });
                }
                    
            }
        }


        switcher.click($.proxy(function(e){
            block.toggleClass("use-rich-text--enabled");
            checkState();
        }, this));

        checkState();

        
    }, this));
}

