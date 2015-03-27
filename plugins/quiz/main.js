var templates = [
    "root/externallib/text!root/plugins/quiz/view.html",
    "root/externallib/text!root/plugins/quiz/attemp.html",
    "root/externallib/text!root/plugins/quiz/summary.html",
];

define(templates, function (filesTpl, attempTpl, summaryTpl) {
    var plugin = {
        settings: {
            name: "quiz",
            type: "mod",
            component: "mod_quiz",
            lang: {
                component: "core"
            }
        },

        /*storage: {
            "forum_file": {type: "model"},
            "forum_files": {type: "collection", model: "forum_file"},
            "forum_sync": {type: "model"},
            "forum_syncs": {type: "collection", model: "forum_sync"}
        },*/
		
		routes: [
            ["quiz/view/:courseId/:cmid/:page", "view_quiz", "viewQuiz"],
            ["quiz/attemp/:courseId/:discussionId", "show_discussion", "showDiscussion"],
			["quiz/summary/:courseId/:discussionId", "show_discussion", "showDiscussion"],
        ],

        
        templates: {
            "view": {
                html: filesTpl
            },
            "attemp": {
                html: attempTpl
            },
            "summary": {
                html: summaryTpl
			}
		}

    };

    MM.registerPlugin(plugin);

});