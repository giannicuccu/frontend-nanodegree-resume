(function resume() {

    const model = {
        person: {}
    };

    Object.defineProperty(model, 'person', {
        // value: JSON.parse(localStorage.attendance),
        // writable: false,
        get: function () {
            return person;
        },

        set: function (source) {
            person = new Person(source);
        },

    });


    const octopus = {

        initModel: () => {
            model.person = sourceJson;
        },

        displayHeader: () => {
            let headerData = model.person.bio.display();
            view.renderHeader(headerData);
        },

        displayEducation: () => {
            let educationData = model.person.education.display();
            view.renderEducation(educationData);
        },

        displayWork: () => {
            let workData = model.person.work.display();
            view.renderWork(workData);
        },

        displayProjects: () => {
            let projectsData = model.person.projects.display();
            view.renderProjects(projectsData);
        }


    };


    const view = {
        render: () => {

        },

        renderHeader: (bio) => {

            let parent = document.getElementById('main');

            let template = `
                    <div id="header" class="center-content clear-fix">
                    <h1 id="name">${bio.name}</h1><span>${bio.role}</span><hr>
                    <ul id="topContacts" class="flex-box">
                    ${Object.keys(bio.contacts).reduce((acc,v) => { 
		                return acc + '<li class="flex-item"><span class="orange-text">'+v+'</span><span class="white-text">'+bio.contacts[v]+'</span></li>';},'')}
                    </ul>
                    <img src="${bio.biopic}" class="biopic">
                    <span class="welcome-message">${bio.welcomeMessage}</span>
                    <h3 id="skills-h3">Skills at a Glance:</h3>
                    <ul id="skills" class="flex-column">
                        ${Object.keys(bio.skills).reduce((acc,v) => { 
		                return acc + '<li class="flex-item"><span class="white-text">'+bio.skills[v]+'</span></li>';},'')}
                    </ul>    
                    </div>
                    <div style="clear: both;"></div>
                    `;
            parent.insertAdjacentHTML('beforeend', template);

        },

        renderEducation: (edu) => {
            let parent = document.getElementById('main');
            let template = `
                <div id="education" class="gray">
                <h2>Education</h2>`;
            
            for(school of edu.schools){
                
                let schoolrow = `<div class="education-entry">
                                    <a href="${school.url}">${school.name} -- ${school.degree}</a>
                                    <div class="date-text">${school.dates}</div>
                                    <div class="location-text">${school.location}</div>
                                    <em><br>Major: ${school.majors.join(' | ')}</em>
                                </div>`;
                // let schoolrow = `${
                //     HTMLschoolView
                //         .replace('%url%',school.url || '#')
                //         .replace('%name%',school.name)
                //         .replace('%degree%',school.degree)
                //         .replace('%dates%',school.dates)
                //         .replace('%location%',school.location)
                //         .replace('%major%',school.majors.join(', '))
                // }`
                //  let schoolt = Object.keys(school).reduce((acc,v) => { 
                //      return acc + '';},'');
                template += schoolrow;
            }
                
                    
                    
                
            
            template += `</div>`;

            parent.insertAdjacentHTML('beforeend', template);
        },

        renderWork: (work) => {
            console.log(work);
            let parent = document.getElementById('main');
            let template = `
            <div id="workExperience" class="gray">
            <h2>Work Experience</h2>`;
            template += work.jobs.reduce((acc,v) => {
                //console.log()
                return acc += `<div class="work-entry">
                <a href="#">${v.employer} - ${v.title}</a>
                <div class="date-text">${v.dates}</div>
                <div class="location-text">${v.location}</div>
                <p><br>${v.description}</p>
                </div>`;
            },'');

            template +=`</div>`;
            console.log(template)

            parent.insertAdjacentHTML('beforeend', template);
        },
        renderProjects: (proj) => {
            let parent = document.getElementById('main');
            let template = `
                <div id="projects">
                <h2>Projects</h2>`;

                template +=`</div>`;

            parent.insertAdjacentHTML('beforeend', template);
        }

    };





    const Person = function (jsonData) {

        // BIO
        this.bio = {
            name: jsonData.bio.name,
            role: jsonData.bio.role,
            contacts: {
                mobile: jsonData.bio.contacts.mobile,
                email: jsonData.bio.contacts.email,
                github: jsonData.bio.contacts.github,
                twitter: jsonData.bio.contacts.twitter,
                location: jsonData.bio.contacts.location
            },
            welcomeMessage: jsonData.bio.welcomeMessage,
            skills: jsonData.bio.skills,
            biopic: jsonData.bio.biopic,
            display: () => {
                return (this.bio);
            }
        };

        //EDUCATION
        this.education = {
            schools: jsonData.education.schools,
            onlineCourses: jsonData.education.onlineCourses,
            display: () => {
                return (this.education);
            }
        };


        //WORK
        this.work = {
            jobs: jsonData.work.jobs,
            display: () => {
                return (this.work);
            }
        };

        //WORK
        this.projects = {
            projects: jsonData.projects.projects,
            display: () => {
                return (this.projects);
            }
        };


    };




    const sourceJson = {
        bio: {
            name: 'Gianni',
            role: 'Webmaster',
            contacts: {
                mobile: '3209714202',
                email: 'gianni.cuccu@gmail.com',
                github: 'giannicuccu.github.com',
                twitter: '@giannicuccu',
                location: 'Cagliari'
            },
            welcomeMessage: 'Currently attending at Udacity Frontend Developer Nanodegree',
            skills: ['HTML', 'CSS', 'JS,APACHE', 'EMAIL', 'FRONTEND STUFF'],
            biopic: 'https://media.licdn.com/dms/image/C4E03AQGNLRJGPN3vwQ/profile-displayphoto-shrink_100_100/0?e=1533772800&v=beta&t=M9pvV2ZWfuXH7TrjONIvlNge8SB0x-JdR5PiGavM5L0',
        },
        education: {
            schools: [{
                    name: 'Lic. Scient. ',
                    location: 'Or',
                    degree: 'diploma',
                    majors: ['major1', 'major2'],
                    dates: '1985-1990',
                    url: ''
                },
                {
                    name: 'Ist. Levi',
                    location: 'Cagliari',
                    degree: 'IFTS',
                    majors: ['major1', 'major2'],
                    dates: '2000-2005',
                    url: ''
                }
            ],

            onlineCourses: [{
                    title: 'Google developer challenge',
                    school: 'online',
                    dates: '2017-2018',
                    url: 'http://www.udacity.com'
                },
                {
                    title: 'Udacity FEND Nanodegree',
                    school: 'online',
                    dates: '2018',
                    url: 'http://www.udacity.com'
                }
            ]
        },
        work: {
            jobs: [{
                    employer: 'Teamlogic srl',
                    title: 'Webmaster',
                    location: 'Cagliari',
                    dates: '2014-2018',
                    description: 'Areaweb manager'
                },
                {
                    employer: 'INEA ',
                    title: 'Webmaster',
                    location: 'Cagliari',
                    dates: '2014-2016',
                    description: 'Online surveys setup, management and report'
                }
            ]
        },
        projects: {
            projects: [{
                    title: 'www.mamma-mia.de',
                    date: '2017',
                    description: 'Restaurant website',
                    images: []

                },
                {
                    title: 'www.kissfromitaly.com',
                    date: '2016',
                    description: 'travel startup',
                    images: []

                },
                {
                    title: 'www.serenafazio.it',
                    date: '2018',
                    description: 'painter website',
                    images: []

                }
            ]
        }
    };



    octopus.initModel();
    octopus.displayHeader();
    octopus.displayWork();
    octopus.displayProjects();
    octopus.displayEducation();



})();




//