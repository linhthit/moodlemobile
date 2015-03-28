var templates = [
    "root/externallib/text!root/plugins/addnote/view.html",
];


define(templates, function (viewTpl) {
    var plugin = {
        settings: {
            name: "addnote",
            type: "user",
            menuURL: "#note",
            lang: {
                component: "core"
            }
        },

        routes: [
            ["note/:courseId/:userId", "note", "addNote"],
			["note/:userId", "note", "viewByUser"]
        ],

        addNote: function(courseId, userId) {
            var addNote = MM.lang.s("addnote");

            var options = {
                title: addNote,
                width: "90%",
                buttons: {}
            };

            options.buttons[addNote] = function() {

                var data = {
                    "notes[0][userid]" : userId,
                    "notes[0][publishstate]": 'personal',
                    "notes[0][courseid]": courseId,
                    "notes[0][text]": $("#addnotetext").val(),
                    "notes[0][format]": 1
                }

                MM.widgets.dialogClose();
                MM.moodleWSCall('moodle_notes_create_notes', data,
                    function(r){
                        MM.popMessage(MM.lang.s("noteadded"));
                    },
                    {
                        sync: true,
                        syncData: {
                            name: addNote,
                            description: $("#addnotetext").val().substr(0, 30)
                        },
                        getFromCache: false,
                        saveToCache: false
                    }
                );

                // Refresh the hash url for avoid navigation problems.
                MM.Router.navigate("participant/" + courseId + "/" + userId);
            };
            options.buttons[MM.lang.s("cancel")] = function() {
                MM.Router.navigate("participant/" + courseId + "/" + userId);
                MM.widgets.dialogClose();
            };

            var rows = 5;
            var cols = 5;
            if (MM.deviceType == "tablet") {
                rows = 15;
                cols = 50;
            }

            var html = '\
            <textarea id="addnotetext" rows="'+rows+'" cols="'+cols+'"></textarea>\
            ';

            MM.widgets.dialog(html, options);
        },
		
		viewByUser: function(userId) {
            var viewNote = MM.lang.s("viewnote");

            var params = {
				"$userid": userId
			};
			
            MM.moodleWSCall("moodle_notes_get_note_by_user",
                params,
                // Success callback.
                function(notes) { 
                    var data = {
                        "notes": notes.notes
                    };
                    var html = MM.tpl.render(MM.plugins.addnote.templates.view.html, data);
                    
					MM.panels.show("right", html, {keepTitle: true, showRight: true});

                    // Hack in tablet view.
                    if (MM.deviceType == "tablet") {
                        var panelCenter = $('#panel-center');
                        var panelRight  = $('#panel-right');

                        panelCenter.css("width", MM.panels.sizes.threePanels.center);
                        panelRight.css("left",  MM.panels.sizes.threePanels.center);
                        panelRight.css("width", MM.panels.sizes.threePanels.right);
                    }

                    // Toggler effect.
                    $(".forum-post .subject", "#panel-right").on(MM.clickType, function(e) {
                        $(this).parent().find(".content").first().toggle();
                    });

                    // Bind downloads.
                    $(".forum-download", "#panel-right").on(MM.clickType, function(e) {
                        e.preventDefault();
                        e.stopPropagation();

                        var url = $(this).data("downloadurl");
                        var filename = $(this).data("filename");
                        var attachmentId = $(this).data("attachmentid");

                        MM.plugins.forum._downloadFile(url, filename, attachmentId);
                    });
                },
                {
                    getFromCache: false,
                    saveToCache: false
                },
                function (error) {
                    MM.popErrorMessage(error);
                }
			);
		},
		
		templates: {
            "view": {
                html: viewTpl
            }
        }
    }

    MM.registerPlugin(plugin);
});