//Common js files
//= common.js


//New Gallery Media tab
//= sources/createMediaTab.js


//Content files
//= sources/contentLibrary.js


//Series data
//= sources/data/data-filters.js


//Global variables
var editedFilesData = [],
    editedFileData = {},
    classList = [],
    dataChanged = false, //Changes when user make any changes on edit screen;
    lastSelected = null, //Index of last Selected element for multi select;
    galleryObjects = [],
    draftIsSaved = false;
    maxVersion = 0;
    lastId = 0;



$(document).ready($.proxy(function() {
    //convert img svgs to inline
    $('img.svg').each(function(){
        var $img = jQuery(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');
    
        $.get(imgURL, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find('svg');
    
            // Add replaced image's ID to the new SVG
            if(typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if(typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass+' replaced-svg');
            }
    
            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');
            
            // Check if the viewport is set, else we gonna set it if we can.
            if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
            }
    
            // Replace image with new SVG
            $img.replaceWith($svg);
    
        }, 'xml');
    
    });

    //= commonInit.js
    //Update Media Tab files
    updateAssetLibrary();
    normalizeSelecteion();


    $("input, textarea").on("change", $.proxy(function() {
        dataChanged = true;
    }, this));


    //populate
    for (var i=0; i < collectionStore.data.length; i++) {
        var element = collectionStore.data[i];
        element.vid = 3650 + i;
        if (element.version == undefined) element.version = i;

        var newStatus = element.status;
        if (i % 6 == 0) {
            newStatus = "Draft";
        }
        element.status = newStatus;

        if (element.note != undefined) {
            element.history = element.note + getPerson();
        } else {
            element.history = getPerson(element);
        }
        
        element.updateDate = new moment().subtract(i, 'days').toDate();
    }







    $("#seeHistory").click($.proxy(function() {
        $(document.body).toggleClass("see-changes--show");
        $(document.body).removeClass("preview-update--show-schedule");
        jumpToDate.removeClass("schedule-jump-to--show-cal");
        var globalFilters = [
            {
                id : "parentId",
                value : currentObject.parentId
            }
        ]

        collectionStore.setFilters(globalFilters);
        collectionStore.setPage(0);
        renderContent($('#contentLibrary'), collectionStore, renderRevisionHeaderRowPage, renderRevisionRowPage);

        //$('#contentLibrary').find(".library__cell-version").text(currentObject.version);

        $('#filterButton').addClass('disabled');
        if ($('.c-Header-controls.header__controls--filter').hasClass('is-open')) {
            $('.c-Header-controls.header__controls--filter').removeClass('is-open');
        }
    }, this));

    $("#history-close").click(function () {
        $(document.body).removeClass("see-changes--show");
        $(document.body).removeClass("preview-update--show-schedule");
    })


    /* -------- See changes ---------- */

    var comparisonDataLeft;
    var comparisonDataRight;
    var versionSelect;


    function removeConflictsFromClone(_clone) {
        _clone.find('*').removeAttr('id');
        //_clone.find(".create-new-version__switcher").remove();
    }

    function initComparison() {

        var $content = $(".c-Main-content").first();
        var $clone1 = $content.clone().removeClass("c-Main-content");
        var $clone2 = $content.clone().removeClass("c-Main-content");

        removeConflictsFromClone($clone1);
        removeConflictsFromClone($clone2);


        $(".comparison-column").first().find(".comparison-column__content").append($clone1);
        $(".comparison-column").last().find(".comparison-column__content").append($clone2);

        $(".comparison-column.current [data-element='title']").on("keyup", updateComparison);
        $(".comparison-column.current [data-element='shortDescription']").on("keyup", updateComparison);
        $(".comparison-column.current [data-element='mediumDescription']").on("keyup", updateComparison);
        $(".comparison-column.current [data-element='description']").on("keyup", updateComparison);
    }

    function extractUserInput($container) {
        var data = Object.assign({}, currentObject);
        data.title = $container.find("[data-element='title']").val();
        data.shortDescription = $container.find("[data-element='shortDescription']").val();
        data.mediumDescription = $container.find("[data-element='mediumDescription']").val();
        data.description = $container.find("[data-element='description']").val();
        return data;
    }


    function hideComparison() {
        $(document.body).removeClass("see-comparison--show");
        window.setTimeout(function() { 
            $(".c-Comparison").css("display", "none"); 
        }, 500);
    }

    function seeComparison(e) {

        e.preventDefault();
        e.stopPropagation();

        if ($(document.body).hasClass("see-comparison--show")) {
            hideComparison();
        }
        else {

            // hide schedule
            $(document.body).removeClass("see-changes--show");
            $(document.body).removeClass("preview-update--show-schedule");




            $(".c-Comparison").css("display", "flex");
            
            var updated = extractUserInput($(".c-Main-content"));
            comparisonDataRight = currentObject;

            fillCardsInContainer($(".comparison-column.current"), updated);        
            fillCardsInContainer($(".comparison-column.previous"), comparisonDataRight); 

            $(".comparison-column.current h3").text("Version " + updated.version);

           
            var versions = getVersionsOfParent(currentObject.parentId);
            var options = versions.map(function(v) {
                return "Version " + v.version;
            })

            $(".comparison-version-select").empty().html("<div id='comparison-version-select'></div>");
     
            versionSelect = new Selectbox(document.getElementById('comparison-version-select'), {
                label: 'Select version to compare',
                placeholder: '',
                items: options,
                unselect: -1,
                selectedItem: "Version " + comparisonDataRight.version,
                itemCallback: function(el) {
                    var index = $(el).attr("data-index");
                    comparisonDataRight = versions[index];
                    fillCardsInContainer($(".comparison-column.previous"), comparisonDataRight);
                    updateComparison();
                }
            });


            updateComparison();

            window.setTimeout(function() { 
                $(document.body).addClass("see-comparison--show");
            }, 100);
        }

    }

    function updateComparison() {

        var updated = extractUserInput($(".comparison-column.current"));

        t = (updated.version === comparisonDataRight.version) ?
            "Before Changes"
        :
            "Saved"

        $(".comparison-column.previous .comparison-column__title").text(t)
        $(".c-Comparison .is-changed").removeClass("is-changed");

        if (comparisonDataRight.title !== updated.title) {
            $(".field-widget__title").addClass("is-changed");
        }

        if (comparisonDataRight.shortDescription !== updated.shortDescription) {
            $(".field-widget__shortDescription").addClass("is-changed");
        }

        if (comparisonDataRight.mediumDescription !== updated.mediumDescription) {
            $(".field-widget__mediumDescription").addClass("is-changed");
        }

        if (comparisonDataRight.description !== updated.description) {
            $(".field-widget__description").addClass("is-changed");
        }   

        fillCardsInContainer($(".c-Main-content"), updated);       
    }

    $("#comparison-close").on("click", seeComparison);  


    $("#scheduleMenuTrigger").on("click", function() {
        $(".schedule-options__wrapper").toggleClass("schedule-options__wrapper--open");
    });

        //leave page
    function assignMenuEvents() {
        var pageName = window.location.href.split('/').pop(),
            menuItems = $('.js-menu .js-menuItem');
            activeMenuItem = $('[data-target="' + pageName + '"]');

        menuItems.click($.proxy(function(e) {
            $(document.body).removeClass("preview-update--show-schedule");
        }, this));
    }


    //Files section
    $('.js-content .files .section__files').disableSelection();
    $('.js-content .section__files').sortable({
        placeholder: 'file--placeholder',
        cursor: '-webkit-grabbing',
        start: function(e, ui) {
            var selectedImages = $('.js-content .files .file.selected');
            if (selectedImages.length > 0 ) {
                draggableImages = $('.js-content .files .file.selected').not(ui.item).clone(true);
                selectedImages = $('.js-content .files .file.selected').not(ui.item).clone(true);

                //Create files copies to Drag
                var targetFile_1 = ui.item.clone(true);
                var targetFile_2 = ui.item.clone(true);
                draggableImages = targetFile_1.add(draggableImages);//will past on a page after dragging stop
                selectedImages = selectedImages.add(targetFile_2);//this elements will dragging by user
                selectedImages.find('.file__arragement, .file__controls, .file__title, .file__caption').remove();

                selectedImages
                    .removeClass('file_view_grid')
                    .css('width', 250)
                    .css('height', 170);

                selectedImages.each(function(i, el) {
                    $(el).css('transform', 'rotate(' + Math.floor(Math.random()*60 - 60)/10 + 'deg) translate(' + Math.floor(Math.random()*200 - 200)/10 + 'px, ' + Math.floor(Math.random()*200 - 200)/10 + 'px)' );
                });

                $('.js-content .files .file.selected').not(ui.item).remove();
                draggableImages.addClass('file_dragging');
                ui.item.removeClass('file').addClass('dragFilesWrapper');
                ui.item.empty();
                ui.item.append(selectedImages);

                $('.js-content .section__files').sortable( "refresh" );
            } else {
                ui.item.addClass('is-dragging');
            }
        },
        stop: function(e, ui) {
            if (ui.item.hasClass('dragFilesWrapper')) {
                ui.item.after(draggableImages.removeAttr('style'));
                ui.item.remove();
                $(".selected").removeClass("file_dragging");
            } else {
                ui.item.removeClass('is-dragging');
            }
            $('.files .section__files .file').removeAttr('style');
            normalizeIndex();
        }
    });

    //Selected Files actions
    $('#multiEdit').click(handleMultiEditButtonClick);
    $('#bulkEdit').click(handleBulkEditButtonClick);
    $('#bulkRemove').click(function() {
        var filesToDelete = $('.ct .files .file.selected');
        showModalPrompt({
            title: 'Remove Asset?',
            text: 'Selected asset(s) will be removed from this series. Don’t worry, it won’t be removed from the Asset Library.',
            confirmText: 'Remove',
            confirmAction: function() {
                hideModalPrompt();
                filesToDelete.each(function(i, el) {
                    var id = $(el).find('.file__id').text();
                    deleteFileById(id ,galleryObjects);
                });
                updateGallery();
            },
            cancelAction: function() {
                hideModalPrompt();
                $('.ct .files .file.sbr').removeClass('sbr');
            }
        });
    });

    //File Edit Save and Cancel
    $('#saveChanges').click(function() {
        var emptyFields = checkFields('.pr label.requiered');
        if (emptyFields) {
            showNotification('The change in the metadata is saved in the Asset Library.');
            editedFilesData.forEach(function(fd) {
                galleryObjects.forEach(function(f) {
                    if (f.fileData.id === fd.fileData.id) {
                        f = fd;
                        f.selected = false;
                    }
                });
            });
            window.setTimeout(function() {closeEditScreen();}, 2000);
            deselectAll();
            updateGallery();
        }
    });
    $('#cancelChanges').click(function() {
        if (dataChanged) {
            resetEditStateView();
            showModalPrompt({
                dialog: true,
                title: 'Cancel Changes?',
                text: 'All changes that you made will be lost. Are you sure you want to cancel changes?',
                confirmText: 'Cancel',
                confirmAction: function() {
                    hideModalPrompt();
                    closeEditScreen();
                },
                cancelAction: hideModalPrompt
            });
        } else {
            closeEditScreen();
        }
    });


    //Check for required fields
    $('label.requiered').parent().children('input').on('blur', function(e) {
        if (checkField(e.target)) {
            markFieldAsNormal(e.target);
        } else {
            markFieldAsRequired(e.target);
        }
    });



    /* Radio Toggle */
    $('.radioToggle li').click(function(e) {
        $(e.target).parent().children('.active').removeClass('active');
        $(e.target).addClass('active');
        if (e.target.innerHTML === "Web Series") {
            $('#reg-sc-duration, #prog-timeframe').addClass('hidden');
        } else if (e.target.innerHTML === "TV Series") {
            $('#reg-sc-duration, #prog-timeframe').removeClass('hidden');
        }
    });


    //Import Cast
    $('#importCastBtn').click(toggleCastImport);
    $('#importCastCancelBtn').click(hideCastImport);
    $('#importCastConfirmBtn').click(importCast);

    function toggleCastImport(e) {
        $('#importCastSection').toggleClass('hidden');
        $('#importCastBtn').toggleClass('is-selected');
    }
    function hideCastImport() {
        $('#importCastSection').addClass('hidden');
        $('#importCastBtn').removeClass('is-selected');
    }














    //Schedule feature
    function displayDate(_slide) {
        var deltaView = 2;
        var delta = range - _slide;
        var dayStart = moment().subtract(delta + deltaView, 'days');
        var dayEnd = moment().subtract(delta - 7 + deltaView + 1, 'days');
        var str = dayStart.format("MMM D") + " - " + dayEnd.format("MMM D") + ", " + dayEnd.format("YYYY");
        scheduleMonthLabel.text(str);
    }

    //fill vids
    function getPerson() {
        var person = Math.round(Math.random() * (persons.length-1));
        return " by <b>" + persons[person] + "</b>";
    }

    function versionInTimeline(_v) {
        if ((_v.status.toLowerCase() == "published") || (_v.status.toLowerCase() == "scheduled")) {
            return true;
        } else {
            return false;
        }
    }

    function versionIsNew(_v) {
        if ((_v.version != undefined) && (_v.version.toString().toLowerCase() == "new version")) {
            return true;
        } else {
            return false;
        }
    }

    function getLastVersionForDay(_day) {
        var lastVersion = null;
        var dontUseAsLast = false;
        for (var j = 0; j < versions.length; j++) {
            var version = versions[j];

            if (versionInTimeline(version) ) {
                if (j < versions.length - 1) {
                    var nextVersion = versions[j + 1];
                    var diff = _day.diff(nextVersion.publishDate, 'minutes');
                    if ((diff == 0) && versionInTimeline(nextVersion)){
                        dontUseAsLast = true;
                        lastVersion = null;
                    }
                }

                if (!dontUseAsLast && (version.publishDate != null) && (version.publishDate < _day)) {
                    lastVersion = version;
                }
            }
        }

        if (lastVersion == null)
            return null;

        return lastVersion;
    }







    function unpublishConflicting() {
        var conflicts = getListOfOverrides(currentObject);
        for (var i=0; i<conflicts.length; i++) {
            conflicts[i].status = "Not Published";
        }
    }


    function saveDraft() {
       showNotification('Draft has been saved');
        currentObject.status = "Draft";
        if (versionIsNew(currentObject)) {
            maxVersion++;
            currentObject.version = maxVersion;
            
            $( '.create-new-version' ).find(".create-new-version__switcher").find("input").attr("checked", false);
        }
        defaultObject = $.extend({}, currentObject);
        updateSchedule();
        dataChanged = false;
    }

    $('#saveDraft').click(saveDraft);



    

    function publishDraftConfirm() {
        showNotification('Version has been published to publish');
        currentObject.status = "Published";
        if (versionIsNew(currentObject)) {
            maxVersion++;
            currentObject.version = maxVersion;
            $( '.create-new-version' ).find(".create-new-version__switcher").find("input").attr("checked", false);
        }
        defaultObject = $.extend({}, currentObject);
        updateSchedule();
        dataChanged = false;
    }

    function publishDraft() {
        currentObject.publishDate = new moment();
        currentObject.status = "Scheduled";


        var conflicts = getListOfOverrides(currentObject);

       if (conflicts.length > 0) {
            new Modal({
                title: 'This version has conflicts with other content',
                text: 'Do you want to unpublish conflicting versions and make this one live?',
                confirmText: 'Confirm',
                confirmAction: function() {
                    unpublishConflicting();
                    publishDraftConfirm();
                },
                cancelAction: hideModalPrompt
            });
       } else {
            publishDraftConfirm();
       }
    }
    $('.publishDraft').click(publishDraft);






    function unpublishDraft() {
        showNotification('Version has been unpublished');
        currentObject.publishDate = null;
        currentObject.unpublishDate = new moment();
        currentObject.status = "Not Published";
        if (versionIsNew(currentObject)) {
            maxVersion++;
            currentObject.version = maxVersion;
            $( '.create-new-version' ).find(".create-new-version__switcher").find("input").attr("checked", false);
        }
        defaultObject = $.extend({}, currentObject);
        updateSchedule();
        dataChanged = false;
    }
    $('.unpublishDraft').click(unpublishDraft);

    





    function saveAndScheduleConfirm() {
        showNotification('Version has been scheduled to publish');
        if (currentObject.publishDate == null) {
            currentObject.status = "Published";
        } else {
            currentObject.status = "Scheduled";
        }


        
        if (versionIsNew(currentObject)) {
            maxVersion++;
            currentObject.version = maxVersion;
            $( '.create-new-version' ).find(".create-new-version__switcher").find("input").attr("checked", false);
        }
        defaultObject = $.extend({}, currentObject);
        updateSchedule();
        dataChanged = false;
    }

    function saveAndSchedule() {
       var conflicts = getListOfOverrides(currentObject);

       if (conflicts.length > 0) {
            new Modal({
                title: 'This version has conflicts with other content',
                text: 'Do you want to unpublish other conflicting versions?',
                confirmText: 'Continue',
                confirmAction: function() {
                    unpublishConflicting();
                    saveAndScheduleConfirm();
                },
                cancelAction: hideModalPrompt
            });
       } else {
            saveAndScheduleConfirm();
       }
    }
    $('.saveAndSchedule').click(saveAndSchedule);







    function saveDraftConfirm() {
        showNotification('The draft is saved');
        currentObject.status = "Draft";
        if (versionIsNew(currentObject)) {
            maxVersion++;
            currentObject.version = maxVersion;
            $( '.create-new-version' ).find(".create-new-version__switcher").find("input").attr("checked", false);
        }
        defaultObject = $.extend({}, currentObject);
        updateSchedule();
        dataChanged = false;
    }
    function saveDraft() {
        showNotification('The draft is saved.');

        draftIsSaved = true;
        dataChanged = false;
        currentObject.status = "Draft";
        defaultObject = $.extend({}, currentObject);
        if (versionInTimeline(currentObject)) {
            new Modal({
                title: 'This version is currently published',
                text: 'Are you sure you want to unpublish it?',
                confirmText: 'Yes',
                confirmAction: function() {
                    saveDraftConfirm();
                },
                cancelAction: hideModalPrompt
            });
        } else {
            saveDraftConfirm();
        }
    }
    $('#saveDraft').click(saveDraft);


    function removeDraft() {
        new Modal({
            title: 'Revert this draft to original?',
            text: 'Are you sure you want to continue?',
            confirmText: 'Continue',
            confirmAction: function() {
                currentObject = $.extend({}, currentObject);
                clearCards();
                fillCards();
                updateSchedule();
                dataChanged = false;
            },
            cancelAction: hideModalPrompt
        });
    }
    $('#removeDraft').click(removeDraft);


    function chooseAnotherVersion(_v) {
        currentObject = _v;
        defaultObject = $.extend({}, currentObject);
        clearCards();
        fillCards();
        updateSchedule();
        dataChanged = false;
    }

    function populateElements() {
        var scheduledVersions = 0;
        var maxScheduledVersions = 0;
        var curScheduledVersions = 0;
        var maxItems = 3;


        function compare(a,b) {
            if (a.publishDate == null)
                return -1;

            if (b.publishDate == null)
                return 1;

            //other cases
            var diff = -a.publishDate.diff(b.publishDate, 'minutes');

            return -Math.sign(diff);
        }
        versions = versions.sort(compare);

        $(daysList).each($.proxy(function(i, day) {
            //var day = daysList[i];
            curScheduledVersions = 0;


            var elementsContainer = day.find(".schedule-day-items-wrapper");
            var showMoreElements = day.find(".schedule-day-expand__label");
            elementsContainer.empty();

            var start = day.data("timeStampStart");
            var end = day.data("timeStampEnd");

            var lastVersionForNow = getLastVersionForDay(start);



            //add last version for the current day
            if ((lastVersionForNow != null) && (lastVersionForNow.publishDate != null)) {
                var publishDate = null;


                var element = $(elementTemplate({
                    versionName : lastVersionForNow.version,
                    publishDate : publishDate
                }));
                elementsContainer.append(element);
                scheduledVersions++;
                curScheduledVersions++;

                //set events
                element.click($.proxy(function(e){
                    if (dataChanged) {
                        new Modal({
                            title: 'Select Another Version?',
                            text: 'All unsaved changes will be lost.',
                            confirmText: 'Don\'t Save',
                            confirmAction: function() {
                                chooseAnotherVersion(lastVersionForNow);
                            },
                            cancelAction: function() {
                                hideModalPrompt();
                            }
                        });
                    } else {
                        //debugger;
                        chooseAnotherVersion(lastVersionForNow);
                        
                    }
                    hideComparison();
                }, this));

                
                var conflicts = getListOfOverrides(lastVersionForNow);
                if (conflicts.length > 0) {
                    element.addClass("schedule-element--conflict");
                }

                //selected version
                if (lastVersionForNow.id == currentObject.id) {
                    element.addClass("schedule-element--selected");
                }
            }
            

            //and other versions that start today


            $(versions).each($.proxy(function(j, version) {
                //var version = versions[j];
                var inBounds = (version.publishDate != null) && 
                                (start <= version.publishDate) && 
                                (version.publishDate <= end) && 
                                versionInTimeline(version);

                if (inBounds) {
                    var publishDate = version.publishDate.format("h:mma");

                    var element = $(elementTemplate({
                        versionName : version.version,
                        publishDate : publishDate
                    }));
                    



                    element.click($.proxy(function(e){
                        if (dataChanged) {
                            new Modal({
                                title: 'Select Another Version?',
                                text: 'All unsaved changes will be lost.',
                                confirmText: 'Don\'t Save',
                                confirmAction: function() {
                                    chooseAnotherVersion(lastVersionForNow);
                                },
                                cancelAction: function() {
                                    hideModalPrompt();
                                }
                            });
                        } else {
                            //debugger;
                            chooseAnotherVersion(version);

                        }
                        hideComparison();
                    }, this));
                    elementsContainer.append(element);
                    scheduledVersions++;
                    curScheduledVersions++;



                    var conflicts = getListOfOverrides(version);
                    if (conflicts.length > 0) {
                        element.addClass("schedule-element--conflict");
                    }

                    //selected version
                    if (version.id == currentObject.id) {
                        element.addClass("schedule-element--selected");
                    }
                }
            }, this));


            if (curScheduledVersions > maxItems) {
                day.addClass("schedule-day-wrapper--expandable ");
                showMoreElements.text((curScheduledVersions - maxItems) + " more...");
            } else if  (curScheduledVersions == 0) {
                day.addClass("schedule-day-wrapper--empty ");
            } else {
                day.removeClass("schedule-day-wrapper--expandable ");
                day.removeClass("schedule-day-wrapper--empty ");
            }



            curScheduledVersions = 0;




        }, this));
    }





    function getListOfOverrides(_curVersion) {
        var conflicts = [];


        if ((_curVersion.publishDate == null) || !versionInTimeline(_curVersion)) return conflicts;

        $(versions).each($.proxy(function(i, version) {
            var conflict3 = false;
            if (version.publishDate != null)
                conflict3 = version.publishDate.diff(_curVersion.publishDate, 'minutes') == 0;


            if (conflict3 && (version.id != _curVersion.id) && versionInTimeline(version)) {
                conflicts.push(version);
            }
        }, this));

        return conflicts;
    }






    function clearCards() {
        //clear collections
        var collectionsInstance = $("#masterCollectionSection").find('.controls__group').data("addable");
        var wrapper = $("#masterCollectionSection").find(".js-addableWrapper");
        wrapper.find(".js-addableRow").remove();
        if ((collectionsInstance != undefined) && (collectionsInstance.handleAddRow != undefined))
            $.proxy(collectionsInstance.handleAddRow, collectionsInstance)();


        //clear associations
        var associationsInstance = $("#collectionSeriesSection").find('.controls__group').data("addable");
        var wrapper = $("#collectionSeriesSection").find(".js-addableWrapper");
        wrapper.find(".js-addableRow").remove();
        if ((associationsInstance != undefined) && (associationsInstance.handleAddRow != undefined))
            $.proxy(associationsInstance.handleAddRow, associationsInstance)();
    }



    function fillCardsInContainer($container, data) {
        //basic

        var title = $container.find("[data-element='title']");
        title.val(data.title);


        $container.find("[data-element='shortDescription']").val(data.shortDescription);
        $container.find("[data-element='mediumDescription']").val(data.mediumDescription);
        $container.find("[data-element='description']").val(data.description);

        return;

        //Collections
        if (data.collections != undefined) {

            var collectionsInstance = $container.find("#masterCollectionSection").find('.controls__group').data("addable");
            var wrapper = $container.find("#masterCollectionSection").find(".js-addableWrapper");
            
            if (data.collections.length > 0) {
                wrapper.addClass("has-multipleRows");
            }

            data.collections.reverse().forEach(function(item, index) {
                var collection = item;
                var colElem = $(collectionTemplate(collection));
                var removeBtn = colElem.find(".button--remove");
                var addBtn = colElem.find(".button--add");
                removeBtn.click($.proxy(function(e) {
                    colElem.remove();
                }, this));
                if (collectionsInstance.handleAddRow != undefined)
                    addBtn.click($.proxy(collectionsInstance.handleAddRow, collectionsInstance));
                wrapper.prepend(colElem);
            });
        }


        //associations
        if (data.associations != undefined) {
            var associationsInstance = $container.find("#collectionSeriesSection").find('.controls__group').data("addable");
            var wrapper = $container.find("#collectionSeriesSection").find(".js-addableWrapper");

            if (data.associations.length > 0) {
                wrapper.addClass("has-multipleRows");
            }
            
            $(data.associations).each($.proxy(function(i, elem) {
                if (i != 0) {
                    if (associationsInstance.handleAddRow != undefined)
                        $.proxy(associationsInstance.handleAddRow, associationsInstance)();
                }
                
                var lastAssoc = wrapper.find(".c-Addable-item:last");
                lastAssoc.find(".js-seriesSelect").text(elem.series);
                lastAssoc.find(".js-seasonSelect").text(elem.season);
                lastAssoc.find(".js-episodeSelect").text(elem.episode);
            }));
        }
    }


    function foldCardsForMobile() {
        if ($(window).width() < 640) {
            $(".card").addClass("is-folded");
        }
    }



    function fillCards() {
        //basic

        var title = $("[data-element='title']");
        title.val(currentObject.title);


        $("[data-element='shortDescription']").val(currentObject.shortDescription);
        $("[data-element='mediumDescription']").val(currentObject.mediumDescription);
        $("[data-element='description']").val(currentObject.description);
        $("[data-element='note']").val(currentObject.note);

        //Collections
        if (currentObject.collections != undefined) {
            var collectionsInstance = $("#masterCollectionSection").find('.controls__group').data("addable");
           
            
            if (currentObject.collections.length > 0) {
                $("#masterCollectionSection").find(".js-addableWrapper").addClass("has-multipleRows");
            }

            $($(currentObject.collections).get().reverse()).each($.proxy(function(i, elem) {
                selectboxInstance = collectionsInstance.selectBox;
                collectionsInstance.handleAddRow();
                handleItemmClick(elem, selectboxInstance);
            }));
        }


        //associations
        if (currentObject.associations != undefined) {
            var associationsInstance = $("#collectionSeriesSection").find('.controls__group').data("addable");
            var wrapper = $("#collectionSeriesSection").find(".js-addableWrapper");

            if (currentObject.associations.length > 0) {
                wrapper.addClass("has-multipleRows");
            }
            
            $(currentObject.associations).each($.proxy(function(i, elem) {
                if (i != 0) {
                    $.proxy(associationsInstance.handleAddRow, associationsInstance)();
                }
                
                var lastAssoc = wrapper.find(".c-Addable-item:last");
                lastAssoc.find(".js-seriesSelect").text(elem.series);
                lastAssoc.find(".js-seasonSelect").text(elem.season);
                lastAssoc.find(".js-episodeSelect").text(elem.episode);
            }));
        }
    }

    //prepopulate data
    function getDataObjectById(_id) {
        var returnElement = null;
        for (var i=0; i<collectionStore.data.length; i++) {
            if (collectionStore.data[i].id == _id) {
                returnElement = collectionStore.data[i];
                break;
            }
        }
        return returnElement;
    }
    function getUrlObject(_str) {
        var str = _str.replace("?", "");
        if (str.length > 0) {
            return JSON.parse('{"' + decodeURI(str.replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');
        } else {
            return null;
        }
        
    }




    function getMaxVersionId(_parentId) {
        var maxVersion = 1;
        for (var i=0; i<collectionStore.data.length; i++) {
            var el = collectionStore.data[i];
            
            if ((el.parentId == _parentId) && (el.version > maxVersion))
                maxVersion = el.version;
        }
        return maxVersion;
    }







    //setting schedule
    var scheduleCont = $(".schedule-container");
    var scheduleWrapper = scheduleCont.find(".schedule-wrapper");
    var scheduleMonthLabel = scheduleCont.find(".schedule-month-label");
    var prevArrow = scheduleCont.find('.schedule-scroll-left');
    var nextArrow = scheduleCont.find('.schedule-scroll-right');
    var jumpToDate = scheduleCont.find('.schedule-jump-to');

    //title
    var cTitle = $(".c-Title");
    var cTitleName = cTitle.find(".c-big-title");
    var cTitleType = cTitle.find(".header__subhead");
    var titleInput = $("[data-element='title']");

    //dates
    var scheduleCard = $(".schedule__card");


    var publishDateTimeCont = scheduleCard.find('.publishDate');
    var publishedDate = publishDateTimeCont.find('.use-datepicker');
    var publishedTime = publishDateTimeCont.find('.time-selector');
    var publishedClear = publishDateTimeCont.find("button");


    var conflictsContainer = scheduleCard.find('.conflicts');



    //templates
    var dayTemplate = Handlebars.compile($("#day-template").html());
    var elementTemplate = Handlebars.compile($("#day-element").html());


    var collectionSimpleTemplate = Handlebars.compile($("#collection-element-simple").html());
    Handlebars.registerPartial('collectionElementSimple', collectionSimpleTemplate);


    

    //triggers
    var scheduleTrigger = $("#scheduleOptions");
    var closeScheduleTrigger = $("#schedule-container-close");
    scheduleTrigger.click($.proxy(function(e){
        $(document.body).toggleClass("preview-update--show-schedule");
        jumpToDate.removeClass("schedule-jump-to--show-cal");

        $(document.body).removeClass("see-comparison--show");
        window.setTimeout(function() { 
            $(".c-Comparison").css("display", "none"); 
        }, 500);
        
    }, this));

    closeScheduleTrigger.click(function() {
        $(document.body).removeClass("preview-update--show-schedule");
    });



    //create new element and event
    function createNewConfirm() {

        defaultObject = $.extend({}, currentObject);
        currentObject = $.extend({}, currentObject);
        currentObject.status = "Draft";
        currentObject.version = "New Version";
        currentObject.id = lastId;
        lastId++;
        versions.push(currentObject);

        clearCards();
        fillCards();
        updateSchedule();
        dataChanged = false;
    }

    var createNewTrigger = $(".create-new-version__switcher");
    createNewTrigger.click($.proxy(function(e){
        if (dataChanged) {
            //for new
            new Modal({
                title: 'Changes haven\t been saved',
                text: 'Do you want to continue?',
                confirmText: 'Continue',
                confirmAction: $.proxy(function() {
                    createNewConfirm();
                }, this),
                cancelAction: hideModalPrompt
            });
        } else {
            createNewConfirm();
        }
    }, this));



    //fill dates
    var range = 20;
    var position = range + 1;
    var daysList = [];

    ///element Vars
    var versions = [];
    var today = new moment();
    var currentObject = {
        title: '',
        id: 0,
        shortDescription : "",
        mediumDescription : "",
        description: "",
        type : "",

        updateDate: new moment().toDate(),
        updateName: '',
        createdDate: new moment().toDate(),
        createdName: '',

        publishDate : null,

        assets: 0,
        target: '',
        status: 'Not Published',
        categories: '',
        tags: '',
        thumbnail: '',
        note: '',
        version : "New Version",
        parentId : -1,
        collections : []
    }
    var defaultObject = null;


    //get current element on load
    var tmpId = getUrlObject(document.location.search);
    if (tmpId != null) {

        currentObject = $.extend(currentObject, getDataObjectById(parseInt(tmpId.id)));
    } else {
        
        //detect type for empty item
        var link = document.location.href;


        if (link.indexOf("create-master-collection.html") > 0) {
            currentObject.type = "New Collection Group";
        }
        if (link.indexOf("create-series.html") > 0) {
            currentObject.type = "New Series";
        }
        if (link.indexOf("create-character.html") > 0) {
            currentObject.type = "New Role";
        }
        if (link.indexOf("create-collection.html") > 0) {
            currentObject.type = "New Collection";
        }
        if (link.indexOf("create-dynamic-promo.html") > 0) {
            currentObject.type = "New Dynamic Promo";
        }
        if (link.indexOf("create-episode.html") > 0) {
            currentObject.type = "New Episode";
        }
        if (link.indexOf("create-event.html") > 0) {
            currentObject.type = "New Event";
        }
        if (link.indexOf("create-gallery.html") > 0) {
            currentObject.type = "New Gallery";
        }
        if (link.indexOf("create-preson.html") > 0) {
            currentObject.type = "New Person";
        }
        if (link.indexOf("create-post.html") > 0) {
            currentObject.type = "New Post";
        }
        if (link.indexOf("create-season.html") > 0) {
            currentObject.type = "New Season";
        }
        if (link.indexOf("create-promo.html") > 0) {
            currentObject.type = "New Promo";
        }
        
    }
    maxVersion = getMaxVersionId(currentObject.parentId);



    defaultObject = $.extend({}, currentObject);

    function getVersionsOfParent(_parent) {
        var versions = [];
        for (var i=0; i<collectionStore.data.length; i++) {
            if ((collectionStore.data[i].parentId != undefined) && (collectionStore.data[i].parentId == currentObject.parentId)) {
                versions.push(collectionStore.data[i]);
            }
        }
        return versions;
    }

    if (currentObject.parentId > -1) {
        versions = getVersionsOfParent(currentObject.parentId);

        //replace versionn with new object
        for (var i=0; i<versions.length; i++) {
            if (versions[i].id == currentObject.id) {
                versions[i] = currentObject;
                break;
            }
        }
    }




    //fill days for calendar
    for (var i= -range; i < range; i++) {
        var day = moment().subtract(i, 'days');
        var start = day.clone().startOf('day'); // set to 12:00 am today
        var end = day.clone().endOf('day'); // set to 23:59 pm today

        var element = $(dayTemplate({
            dayTitle : day.format("dddd D")
        }));
        element.data("timeStampStart", start);
        element.data("timeStampEnd", end);
        element.find(".schedule-day-expand").click($.proxy(function(e){
            //scheduleWrapper
            scheduleWrapper.toggleClass("schedule-wrapper--expanded");
        }, this));

        if (i == 0) {
            element.addClass("schedule-day-wrapper--today");
        }

        if ((day.format("d") == "0") || (day.format("d") == "6")) {
            element.addClass("schedule-day-wrapper--weekend");
        }


        scheduleWrapper.prepend(element);
        daysList.push(element);
    }


    

    //Calendar init
    scheduleWrapper.slick({
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow: 7,
        slidesToScroll: 3,
        centerMode : true,
        initialSlide : position,
        prevArrow: prevArrow,
        nextArrow: nextArrow,
        setPosition : $.proxy(function(event, slick, currentSlide, nextSlide){
        }, this),
        responsive: [
            {
              breakpoint: 1600,
              settings: {
                slidesToShow: 6
              }
            },
            {
              breakpoint: 1400,
              settings: {
                slidesToShow: 5
              }
            },
            {
              breakpoint: 1300,
              settings: {
                slidesToShow: 4
              }
            },
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3
              }
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 1
              }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    });
    scheduleWrapper.on('beforeChange', function(event, slick, currentSlide, nextSlide){
        displayDate(nextSlide);
    });

    // Jump to date
    jumpToDate.datepicker({
        onSelect: function(dateString, datepicker) {
            jumpToDate.removeClass("schedule-jump-to--show-cal");
            var dayToGo = moment(dateString, "MM/DD/YYYY");

            for (var i=0; i < daysList.length; i++) {
                var day = daysList[i];
                var start = day.data("timeStampStart");
                var end = day.data("timeStampEnd");
                if ((start <= dayToGo) && (dayToGo <= end)) {
                    scheduleWrapper.slick('slickGoTo', 2*range - i);
                    break;
                }
            }
        },
        changeMonth: true,
        changeYear: true
        /*monthNamesShort: [ "Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December" ]*/
    });
    jumpToDate.click($.proxy(function(e) {
        jumpToDate.toggleClass("schedule-jump-to--show-cal");
    }, this));


    function calculateIntersection() {

    }


    function updateTitle() {
        var title = titleInput;
        if (title.length == 0) return 0;


        var versionTitle = "V." + currentObject.version;
        if (versionIsNew(currentObject)) {
            var versionTitle = currentObject.version;
        }



        if (title.val().length == 0) {
            cTitleName.text(currentObject.type);
            cTitleType.text(versionTitle);
        } else {
            cTitleName.text(title.val());
            cTitleType.text(currentObject.type  + " | " + versionTitle);
        }
    }

    function updateSchedule() {
        updateTitle();




        if (currentObject.publishDate != null) {
            publishedDate.find(".use-datepicker__trigger").text(currentObject.publishDate.format("MM/DD/YYYY"));
            publishedTime.val(currentObject.publishDate.format("hh:mm a"));
            previewCalTrigger.text(currentObject.publishDate.format("MM/DD/YYYY"));
            previewTime.val(currentObject.publishDate.format("hh:mm a"));
        } else {
            publishedDate.find(".use-datepicker__trigger").text("");
            publishedDate.find(".use-datepicker__container").datepicker( "option", "maxDate",  null);
            publishedTime.val("");
        }


        
        var versionStatus = scheduleCard.find(".controls__label.version__status .library__cell-value");
        
        //status
        versionStatus.removeClass("library__cell-value--published");
        versionStatus.removeClass("library__cell-value--not-published");
        versionStatus.removeClass("library__cell-value--draft");
        versionStatus.removeClass("library__cell-value--scheduled");
        versionStatus.addClass(currentObject.status.toLowerCase() === 'published' ? 'library__cell-value--published' : '')
                    .addClass(currentObject.status.toLowerCase() === 'not published' ? 'library__cell-value--not-published' : '')
                    .addClass(currentObject.status.toLowerCase() === 'draft' ? 'library__cell-value--draft' : '')
                    .addClass(currentObject.status.toLowerCase() === 'scheduled' ? 'library__cell-value--scheduled' : '');
        versionStatus.text(currentObject.status);




        populateElements();

        var hasConflict = getListOfOverrides(currentObject);

        conflictsContainer.empty();

        if (hasConflict.length > 0) {
            scheduleCard.addClass("schedule__card--conflict");
            var elem = "<div class='conflict__line'>Scheduling conflict(s) detected:</div>";
            conflictsContainer.append(elem);




            var timeFormat = "M/D/YY h:mm a";
            var resultString = "";
            for (var i = 0; i < hasConflict.length; i++) {
                var tmpInt = hasConflict[i];
                //case one
                resultString = " at " + currentObject.publishDate.format(timeFormat);

                var elem = "<li class='conflict__line'>Version " + hasConflict[i].version + resultString + " </li>";
                conflictsContainer.append(elem);
            }
        } else {
            scheduleCard.removeClass("schedule__card--conflict");
        }
    }

    $("[data-element='title']").on("change keyup keydown", $.proxy(function(){
        updateTitle();
    }, this));

    publishedTime.inputmask({
        mask: "h:s t\\m",
        placeholder: "hh:mm xm",
        alias: "datetime",
        hourFormat: "12"
    });





    publishedTime.on(' keyup paste', $.proxy(function(e){
        if (currentObject.publishDate == null) return null;

        var timeValue = publishedTime.val();
        var newDate = new moment(currentObject.publishDate.format("MM/DD/YYYY") + " " + timeValue);

        if (!newDate._isValid) return 0;

        currentObject.publishDate = newDate;
        updateSchedule();

    }, this));







    //clear buttons
    publishedClear.click($.proxy(function(e){
        currentObject.publishDate = null;
        updateSchedule();
        //setPublishUnpublish();
    }, this));

    //date pickers
    publishedDate.each($.proxy(function(i, e) {
        // Jump to date
        var block = $(e);
        var container = block.find(".use-datepicker__container");
        var trigger = block.find(".use-datepicker__trigger");

        container.datepicker({
            onSelect: function(dateString, datepicker) {
                block.removeClass("use-datepicker--show");
                trigger.text(dateString);
                dataChanged = true;

                currentObject.publishDate = new moment(dateString, "MM/DD/YYYY");
                if (publishedTime.val() == "") {
                    var time = currentObject.publishDate.startOf('day');
                    publishedTime.val(time.format("hh:mm a"));
                }
                updateSchedule();
            },

            minDate: 0, 
            changeMonth: true,
            changeYear: true
        });

        trigger.click($.proxy(function(e){
            e.stopPropagation();

            block.toggleClass("use-datepicker--show");
            unpublishedDate.removeClass("use-datepicker--show");
        }));
        publishedDate.find(".ui-datepicker").blur($.proxy(function(e){
        }));
    }, this));


    $(window).click(function() {
        //Hide the menus if visible
        publishedDate.removeClass("use-datepicker--show");
        previewDate.removeClass("preview-modal__date--show");
    });


    //preview modal
    

    var previewModal = $(".preview-modal");
    var previewDate = previewModal.find(".preview-modal__date");
    var previewCalTrigger = previewModal.find(".preview-modal__date-input");
    var previewTime = previewModal.find(".preview-modal__time-input");
    var previewClose = previewModal.find(".preview-modal__close");
    var scheduleSection = previewModal.find(".preview-modal__schedule");




    previewCalTrigger.click($.proxy(function(e){
        e.stopPropagation();
        previewDate.toggleClass("preview-modal__date--show");

        scheduleSection.find(".preview-modal__option").removeClass("preview-modal__option--selected");
        scheduleSection.find(".preview-modal__datetime").addClass("preview-modal__option--selected");
    }, this));
    var previewCal = previewModal.find(".preview-modal__cal");
    previewCal.datepicker({
        onSelect: function(dateString, datepicker) {
            var dayToGo = moment(dateString, "MM/DD/YYYY");
            previewCalTrigger.text(dayToGo.format("MM/DD/YYYY"));
            previewDate.removeClass("preview-modal__date--show");
            previewTime.focus();
            previewTime[0].setSelectionRange(0, 0);
        },
        changeMonth: true,
        changeYear: true
    });
    previewTime.inputmask({
        mask: "h:s t\\m",
        placeholder: "hh:mm xm",
        alias: "datetime",
        hourFormat: "12"
    });

    $(".previewDraft").click($.proxy(function() {
        var dateTimeToPreview = currentObject.publishDate;

        if (dateTimeToPreview == null) {
            dateTimeToPreview = new moment();
        }
        previewCalTrigger.text(dateTimeToPreview.format("MM/DD/YYYY"));
        previewTime.val(dateTimeToPreview.format("hh:mm a"));

        $(document.body).addClass("preview-update--show-preview-modal");

    }, this));
    previewClose.click($.proxy(function() {
        $(document.body).removeClass("preview-update--show-preview-modal");
        previewDate.removeClass("preview-modal__date--show");
    }, this));

    //live - date switchers
    scheduleSection.find(".preview-modal__live").click($.proxy(function(e){
        scheduleSection.find(".preview-modal__option").removeClass("preview-modal__option--selected");
        scheduleSection.find(".preview-modal__live").addClass("preview-modal__option--selected");
    }, this));

    scheduleSection.find(".preview-modal__datetime").click($.proxy(function(e){
        scheduleSection.find(".preview-modal__option").removeClass("preview-modal__option--selected");
        scheduleSection.find(".preview-modal__datetime").addClass("preview-modal__option--selected");
    }, this));

    

    



    initComparison();
    fillCards();
    updateSchedule();
    displayDate(position);
    transformRichText();
    assignMenuEvents();
    $("#seeChanges").on("click", seeComparison); 
    foldCardsForMobile(); 


    console.log("currentObject = ", currentObject);
    

}, this));

//debugger;



//$('.uploadFiles').click(handleUploadFilesClick);



