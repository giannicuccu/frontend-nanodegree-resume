(function(){

    const model = {
        person:{}
    };

    Object.defineProperty(model, 'person', {
        // value: JSON.parse(localStorage.attendance),
        // writable: false,
        get: function () {
            return this._person; // _ avoid recursion error
        },

        set: function (source) {
              this._person = new Person(source);   // _ avoid recursion error
             
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
        },

        displayMap: () => {            
            view.renderMap();
        },

        displayFooter: () => {            
            view.renderFooter();
        }


    };


    const view = {
 

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
            
            for(const school of edu.schools){
                
                let schoolrow = `<div class="education-entry">
                                    <a href="${school.url}">${school.name} -- ${school.degree}</a>
                                    <div class="date-text">${school.dates}</div>
                                    <div class="location-text">${school.location}</div>
                                    <em><br>Major: ${school.majors.join(' | ')}</em>
                                </div>`;
                
                template += schoolrow;
            }        

            template += `</div>`;
            parent.insertAdjacentHTML('beforeend', template);
        },

        renderWork: (work) => {
            
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
            parent.insertAdjacentHTML('beforeend', template);
        },

        renderProjects: (proj) => {
            //console.log(proj);
            let parent = document.getElementById('main');
            let template = `
                <div id="projects">
                <h2>Projects</h2>`;
                template += proj.projects.reduce((acc,v) => {
                    //console.log()
                    return acc += ` <div class="project-entry">
                                    <a href="http://${v.title}">${v.title}</a>
                                    <div class="date-text">${v.date}</div>
                                    <p><br>${v.description}</p>
                                    <img src="${v.images[0]}">
                                    </div>`;
                },'');
    
                
                template +=`</div>`;

            parent.insertAdjacentHTML('beforeend', template);
        },

        renderMap: ()=>{

            let parent = document.getElementById('main');

            parent.insertAdjacentHTML('beforeend','<div id="mapDiv"><h2>Where I\'ve Lived and Worked</h2><div id="map"></div></div>')
            
            let map;
           
            let mapOptions = {
                disableDefaultUI: true
              };
            
            map = new google.maps.Map(document.querySelector('#map'), mapOptions);

                       
            function locationFinder() {
                
                let locations = []; 

                locations.push(model.person.bio.contacts.location);
                
                model.person.education.schools.forEach(function(school){
                locations.push(school.location);
                });
            
                model.person.work.jobs.forEach(function(job){
                locations.push(job.location);
                
                });
                return locations;
            };

           

            function createMapMarker(placeData)  {
                // The next lines save location data from the search result object to local variables
                var lat = placeData.geometry.location.lat();  // latitude from the place service
                var lon = placeData.geometry.location.lng();  // longitude from the place service
                var name = placeData.formatted_address;   // name of the place from the place service
                var bounds = window.mapBounds;            // current boundaries of the map window
            
                // marker is an object with additional data about the pin for a single location
                var marker = new google.maps.Marker({
                  map: map,
                  position: placeData.geometry.location,
                  title: name
                });
            
                // infoWindows are the little helper windows that open when you click
                // or hover over a pin on a map. They usually contain more information
                // about a location.
                var infoWindow = new google.maps.InfoWindow({
                  content: name
                });
            
                // hmmmm, I wonder what this is about...
                google.maps.event.addListener(marker, 'click', function() {
                 alert('click')
                });
            
                // this is where the pin actually gets added to the map.
                // bounds.extend() takes in a map location object
                bounds.extend(new google.maps.LatLng(lat, lon));
                // fit the map to the new marker
                map.fitBounds(bounds);
                // center the map
                map.setCenter(bounds.getCenter());
              };

            function callback(results, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                    createMapMarker(results[0]);
                    }
                };

            function pinPoster(locations) {

                    // creates a Google place search service object. PlacesService does the work of
                    // actually searching for location data.
                    var service = new google.maps.places.PlacesService(map);
                
                    // Iterates through the array of locations, creates a search object for each location
                    locations.forEach(function(place){
                    // the search request object
                    var request = {
                        query: place
                    };
                
                    // Actually searches the Google Maps API for location data and runs the callback
                    // function with the search results after each search.
                    service.textSearch(request, callback);
                    });
                };

            window.mapBounds = new google.maps.LatLngBounds();

                // locations is an array of location strings returned from locationFinder()
            locations = locationFinder();

            // pinPoster(locations) creates pins on the map for each location in
            // the locations array
            pinPoster(locations);

            // Vanilla JS way to listen for resizing of the window
            // and adjust map bounds
            window.addEventListener('resize', function(e) {
            map.fitBounds(mapBounds);
            });

              
        },

        renderFooter: ()=>{
            let parent = document.getElementById('main');
            let template =`
            <div id="lets-connect" class="dark-gray">
                <h2 class="orange center-text">Let's Connect</h2>
                <ul id="footerContacts" class="flex-box">
            </ul>
            </div>
            `;
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
            name: 'Gqq',
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
                    location: 'Oristano',
                    degree: 'diploma',
                    majors: ['major1', 'major2'],
                    dates: '1985-1990',
                    url: ''
                },
                {
                    name: 'Ist. Levi',
                    location: 'Quartu Sant\'Elena',
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
                    title: 'IT services',
                    location: 'Cagliari',
                    dates: '2014-2018',
                    description: 'Areaweb manager'
                },
                {
                    employer: 'INEA ',
                    title: 'Ist. naz. economia agraria',
                    location: 'Cagliari',
                    dates: '2014-2016',
                    description: 'Online surveys setup, management and data reporting'
                },
                {
                    employer: 'Getidea ',
                    title: 'Web agency',
                    location: 'Cagliari',
                    dates: '2008-2013',
                    description: 'Webmaster'
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
                    description: 'Travel startup',
                    images: []

                },
                {
                    title: 'www.serenafazio.it',
                    date: '2018',
                    description: 'Artist personal website',
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
    octopus.displayMap();
    octopus.displayFooter();
    

})()