var templates = [
    "root/externallib/text!root/plugins/note/notes.html",
	"root/externallib/text!root/plugins/note/note.html",
];


define(templates, function (notesTpl,noteTpl) {
    var plugin = {
        settings: {
            name: "note",
            type: "course",
            menuURL: "#notes/",
            lang: {
                component: "core"
            }
        },

        routes: [
			["notes/user/:courseId/:userId", "view notes", "viewByUser"],
			//["notes/note/:noteId", "view notes", "viewNote"],
			["notes/:courseId", "view notes", "viewByCourse"],
			["notes/edit/:courseId/:userId/:noteId", "edit a note", "editNote"],
			["notes/delete/:courseId/:userId/:noteId", "delete a note", "deleteNote"],			
        ],

        /*addNote: function(courseId, userId) {
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
        },*/
		
		viewByUser: function(courseId, userId) {
            var viewNote = MM.lang.s("viewnote");

            var params = {
				"courseid": courseId,
				"userid": userId
			};
			
            MM.moodleWSCall("local_mobile_notes_get_notes_by_user",
                params,
                // Success callback.
                function(notes) { //notes ở đây là giá trị trả về của WS, trong đó có notes.notes là một mảng của  các note và notes.warning.
					
                    MM.plugins.note.notesCache = notes.notes;//lưu kết quả trả về vào file tạm để dùng cho edit.
					
					var data = {
                        "notes": notes.notes,
						"filter": 'user'
                    };
                    var html = MM.tpl.render(MM.plugins.note.templates.notes.html, data);          
					MM.panels.show("right", html, {keepTitle: true, showRight: true});

                    // Hack in tablet view.
                    if (MM.deviceType == "tablet") {
                        var panelCenter = $('#panel-center');
                        var panelRight  = $('#panel-right');

                        panelCenter.css("width", MM.panels.sizes.threePanels.center);
                        panelRight.css("left",  MM.panels.sizes.threePanels.center);
                        panelRight.css("width", MM.panels.sizes.threePanels.right);
                    }
                },
                {
                    getFromCache: false,
                    saveToCache: true
                },
                function (error) {
                    MM.popErrorMessage(error);
                }
			);
		},
		
		viewByCourse: function(courseId) {
            
			var params = {
				"courseid": courseId
			};
            MM.moodleWSCall("local_mobile_notes_get_notes_by_course",
                params,
                // Success callback.
                function(notes) {                    
					var data = {
                        "notes": notes.notes,
						"filter": 'course'
                    };
					
                    var html = MM.tpl.render(MM.plugins.note.templates.notes.html, data);            
					MM.panels.show("right", html, {keepTitle: true, showRight: true});
					
                    // Hack in tablet view.
                    if (MM.deviceType == "tablet") {
                        var panelCenter = $('#panel-center');
                        var panelRight  = $('#panel-right');

                        panelCenter.css("width", MM.panels.sizes.threePanels.center);
                        panelRight.css("left",  MM.panels.sizes.threePanels.center);
                        panelRight.css("width", MM.panels.sizes.threePanels.right);
                    }
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
		
		viewNote: function(noteId) {
            
			var params = {
				"noteid": noteId
			};
			MM.moodleWSCall("local_mobile_notes_get_notes",
                params,
                // Success callback.
                function(notes) {                    
					var data = {
                        "notes": notes.notes,
                    };
					
                    var html = MM.tpl.render(MM.plugins.note.templates.note.html, data);            
					MM.panels.show("right", html, {keepTitle: true, showRight: true});
					
                    // Hack in tablet view.
                    if (MM.deviceType == "tablet") {
                        var panelCenter = $('#panel-center');
                        var panelRight  = $('#panel-right');

                        panelCenter.css("width", MM.panels.sizes.threePanels.center);
                        panelRight.css("left",  MM.panels.sizes.threePanels.center);
                        panelRight.css("width", MM.panels.sizes.threePanels.right);
                    }
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
		
		editNote: function(courseId, userId, noteId) {
            var editNote = MM.lang.s("editnote");

            var options = {
                title: editNote,
                width: "90%",
                buttons: {}
            };

            options.buttons[MM.lang.s("save")] = function() {
                var data = {
                    "notes[0][id]" : noteId,
                    "notes[0][publishstate]": $("select option:selected").val(),
                    "notes[0][text]": $("#editnotetext").val(),
                    "notes[0][format]": 1
                }

                MM.widgets.dialogClose();
                MM.moodleWSCall('local_mobile_notes_update_notes', data,
                    function(r){
                        MM.popMessage(MM.lang.s("noteedited"));
						MM.plugins.note.viewByUser(courseId, userId);
                    },
                    null,
    	            function (error) {
        	            MM.popErrorMessage(error);
                    }
                );

                // Refresh the hash url for avoid navigation problems.
                MM.Router.navigate("notes/user/" + courseId + "/" + userId);
            };
            options.buttons[MM.lang.s("cancel")] = function() {
                MM.Router.navigate("notes/user/" + courseId + "/" + userId);
                MM.widgets.dialogClose();
            };
			
			var temp;
			for (var el in MM.plugins.note.notesCache) {
				var d = MM.plugins.note.notesCache[el];
				if (d.noteid == noteId) {
					temp = d;
					break;
				}
			}

            var rows = 5;
            var cols = 5;
            if (MM.deviceType == "tablet") {
                rows = 15;
                cols = 50;
            }

            var html = '\
            <textarea id="editnotetext" rows="'+rows+'" cols="'+cols+'"></textarea><select id="publishstate"><option id="site" value="site"> Site </option><option id="course" value="course"> Course </option><option id="personal" value="personal"> Personal </option></select>\ ';

            MM.widgets.dialog(html, options);
			//dùng jquery
			//temp.text = temp.text.split('<br />').join('');
			$("#editnotetext").val(temp.text);//ok?
			var opt = "#" + temp.publishstate;
			$(opt).attr("selected","selected");
        },
		
		deleteNote: function(courseId, userId, noteId) {
            var deleteNote = MM.lang.s("deletenote");

            var options = {
                title: deleteNote,
                width: "90%",
                buttons: {}
            };

            options.buttons[MM.lang.s("yes")] = function() {
                var data = {
                    "notes[0]" : noteId
                }
                MM.widgets.dialogClose();
                MM.moodleWSCall('local_mobile_notes_delete_notes', data,
                    function(r){
                        MM.popMessage(MM.lang.s("notedeleted"));
						MM.plugins.note.viewByUser(courseId, userId);
                    },
                    null,
    	            function (error) {
        	            MM.popErrorMessage(error);
                    }
                );
                // Refresh the hash url for avoid navigation problems.
                MM.Router.navigate("notes/user/" + courseId + "/" + userId);
            };
			
            options.buttons[MM.lang.s("no")] = function() {
                MM.Router.navigate("notes/user/" + courseId + "/" + userId);
                MM.widgets.dialogClose();
            };

            var html = '\<p id="confirm">Are you sure to delete this note?</p>\ ';
            MM.widgets.dialog(html, options);
        },
		
		templates: {
            "notes": {
                html: notesTpl
            },
			"note": {
				html: noteTpl
			}
        }
    }

    MM.registerPlugin(plugin);
});