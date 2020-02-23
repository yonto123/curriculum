// Links
repoLink = 'https://github.com/razel01/curriculum/';
svgLink = 'curriculum.svg';
subjectGithubLinkBase = 'https://github.com/razel01/curriculum/tree/master/';

// Declare markdown-it
markdown = window.markdownit({
    linkify: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (__) { }
        }

        return ''; // use external default escaping
    }
});

// Routing
let Router = Backbone.Router.extend({
    routes: {
        "subject/:subject": "loadSubject",          // /#subject/:subject
        "subject/:subject/:lesson": "loadLesson",   // /#subject/:subject/:lesson
        "": "loadCurriculum"                        // Default route
    },
    loadCurriculum: function () {
        $id('breadcrumb').innerHTML = '<span class="breadcrumb-item active">Home</span>';
        $id('githubLink').href = repoLink;
        $id('mainContainer').innerHTML = '';
        loadCurriculumSvg();
    },
    loadSubject: function (subject) {
        let subjectName = subject.replace(/-/g, ' ');
        subjectName = subjectName[0].toUpperCase() + subjectName.substring(1);
        $id('breadcrumb').innerHTML = `<a class="breadcrumb-item" href="#">Home</a> <span class="breadcrumb-item active">${subjectName}`;
        $id('githubLink').href = subjectGithubLinkBase + subject;
        $id('mainContainer').innerHTML = '';
        loadMarkdown(subject);
    },
    loadLesson: function (subject, lesson) {
        let subjectName = subject.replace(/-/g, ' ');
        subjectName = subjectName[0].toUpperCase() + subjectName.substring(1);
        let lessonName = lesson.replace(/-/g, ' ');
        lessonName = lessonName[0].toUpperCase() + lessonName.substring(1);
        let subjectLink = '#subject/' + subject;
        $id('breadcrumb').innerHTML = `<a class="breadcrumb-item" href="#">Home</a> <a class="breadcrumb-item" href="${subjectLink}">${subjectName}</a> <span class="breadcrumb-item active">${lessonName}</span>`;
        $id('githubLink').href = subjectGithubLinkBase + subject + '/' + lesson;
        $id('mainContainer').innerHTML = '';
        loadMarkdown(subject, lesson);
    }
});
new Router();
Backbone.history.start();

// Load functions
// Load svg
function loadCurriculumSvg() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Remove the declaration of svg file
            let lines = this.responseText.split('\n');
            lines.shift();
            $id('mainContainer').innerHTML = lines.join('\n');
            adjustSvgLink();
        }
    };
    xhttp.open("GET", svgLink, true);
    xhttp.send();
}

// Load subject and lesson markdown from github repo
function loadMarkdown(subject, lesson = null) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            $id('mainContainer').innerHTML = markdown.render(this.responseText);
            adjustLink();
        }
    }
    if (lesson == null) xhttp.open("GET", subject + '/README.md');
    else xhttp.open("GET", subject + '/' + lesson + '/README.md');
    xhttp.send();
}

// Helper functions
// Change relative links in main container to Backbone links
function adjustLink() {
    links = $id('mainContainer').getElementsByTagName("a");
    for (i = 0, l = links.length; i < l; i++) {
        let href = links[i].getAttribute('href');
        if (!isUrlAbsolute(href)) {
            links[i].href = links[i].baseURI + '/' + href;
        } else {
            links[i].target = "_blank";
        }
    }
}

function adjustSvgLink() {
    links = $id('mainContainer').getElementsByTagName("a");
    for (i = 0, l = links.length; i < l; i++) {
        let href = links[i].getAttribute('xlink:href');
        links[i].setAttribute("href", '#subject/' + href);
    }
}

function isUrlAbsolute(url) {
    return (url.indexOf('://') > 0 || url.indexOf('//') === 0);
}

function $id(id) {
    return document.getElementById(id);
}