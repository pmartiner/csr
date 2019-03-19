var axios = require('axios');

var users_url = process.env.REACT_APP_USERS_SERVICE_URL;

module.exports = {
    leaderRegister: function (info){
        var url = users_url + '/register/leader';
        var encodedURI = window.encodeURI(url);

        return axios.put(encodedURI, {
            name : info.name,
            surname_f: info.surname_f,
            surname_m: info.surname_m,
            birthdate: info.birthdate,
            marital_status: info.marital_status,
            academic_degree: info.academic_degree,
            headquarters: info.headquarters,
            network: info.network,
            house_type: info.house_type,
            conversion_date: info.conversion_date,
            first_encounter_date: info.first_encounter_date,
            email: info.email,
            pw: info.pw,
            mobile: info.mobile,
            street: info.street,
            street_num: info.street_num,
            neighborhood: info.neighborhood,
            municipality: info.municipality,
            state: info.state,
            pc: info.pc,
            interested_people: info.interested_people,
            notif_family: info.notif_family,
            notif_kids: info.notif_kids,
            notif_parents_school: info.notif_parents_school,
            notif_marriage: info.notif_marriage,
            notif_youth: info.notif_youth,
            notif_teens: info.notif_teens,
            notif_entrepreneurship: info.notif_entrepreneurship,
            notif_reach: info.notif_reach,
            notif_praise: info.notif_praise,
            notif_againt_slave_traffic: info.notif_againt_slave_traffic,
            notif_good_news: info.notif_good_news,
            notif_prayer: info.notif_prayer,
            notif_older_adults: info.notif_older_adults,
            id_father: info.id_father,
            leader: info.leader,
            admin: info.admin,
        })
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    leaderLogin: function(credentials){
        var url = users_url + '/login';
        var encodedURI = window.encodeURI(url);

        return axios.post(encodedURI, {
            email: credentials.email,
            pw: credentials.pw,
        })
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    leaderCourseRegister: function(info){
        var url = users_url + '/course';
        var encodedURI = window.encodeURI(url);

        return axios.post(encodedURI, {
            day: info.day,
            start_day: info.start_day,
            start_time: info.start_time,
            end_time: info.end_time,
            attendance_type: info.attendance_type,
            house_type: info.house_type,
            course_name: info.course_name,
            description: info.description,
            street: info.street,
            street_num: info.street_num,
            interior_num: info.interior_num,
            latitude: info.latitude,
            longitude: info.longitude,
            neighborhood: info.neighborhood,
            municipality: info.municipality,
            state: info.state,
            pc: info.pc,
            phone: info.phone,
            id_leader: info.id_leader
        })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    leaderCourseReport: function(info){
        var url = users_url + '/course/report';
        var encodedURI = window.encodeURI(url);

        console.log(info)

        return axios.post(encodedURI, {
            id_course: info.id_course,
            tithe: info.tithe,
            donation: info.donation,
            date_course: info.date_course,
            date_report: info.date_report,
            user_list: info.user_list
        })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
    },

    leaderCourseInfo: function(id_leader){
        var url = users_url + '/courses?id_leader=' + id_leader;
        var encodedURI = window.encodeURI(url);

        return axios.get(encodedURI)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
    },

    courseInfo: function(id_course){
        var url = users_url + '/courses/info?id_course=' + id_course;
        var encodedURI = window.encodeURI(url);

        return axios.get(encodedURI)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
    },

    leaderCourseEdit: function(info){
        var url = users_url + '/course/edit';
        var encodedURI = window.encodeURI(url);
        console.log(info);

        return axios.put(encodedURI, {
            day: info.day,
            start_day: info.start_day,
            start_time: info.start_time,
            end_time: info.end_time,
            attendance_type: info.attendance_type,
            house_type: info.house_type,
            course_name: info.course_name,
            description: info.description,
            street: info.street,
            street_num: info.street_num,
            interior_num: info.interior_num,
            latitude: info.latitude,
            longitude: info.longitude,
            neighborhood: info.neighborhood,
            municipality: info.municipality,
            state: info.state,
            pc: info.pc,
            phone: info.phone,
            id_leader: info.id_leader,
            id_course: info.id_course
        })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    userRegistry: function(ids) {
        var url = users_url + '/course/registry';
        var encodedURI = window.encodeURI(url);

        console.log(ids);

        return axios.post(encodedURI, {
            id_leader: ids.id_leader,
            id_course: ids.id_course,
            date: ids.date
        })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
    },

    userExists: function(data) {
        var url = users_url + '/register/exists';
        var encodedURI = window.encodeURI(url);

        return axios.put(encodedURI, {
            email: data.email,
            mobile: data.mobile
        })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
    },

    userShouldReport: function(id_course){
        var url = users_url + '/courses/report/date_report?id_course=' + id_course;
        var encodedURI = window.encodeURI(url);

        return axios.get(encodedURI)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
    },

    userSendMail: function(data){
        var url = users_url + '/leader/email';
        var encodedURI = window.encodeURI(url);

        return axios.post(encodedURI, {
            email: data.email,
            title: data.title,
            content: data.content
        })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
    },

    userCourseRegistry: function(info) {
        var url = users_url + '/course/registry';
        var encodedURI = window.encodeURI(url);

        return axios.post(encodedURI, {
            id_course: info.id_course,
            name : info.name,
            surname_f: info.surname_f,
            surname_m: info.surname_m,
            birthdate: info.birthdate,
            marital_status: info.marital_status,
            academic_degree: info.academic_degree,
            headquarters: info.headquarters,
            network: info.network,
            house_type: info.house_type,
            conversion_date: info.conversion_date,
            first_encounter_date: info.first_encounter_date,
            email: info.email,
            pw: info.pw,
            mobile: info.mobile,
            street: info.street,
            street_num: info.street_num,
            neighborhood: info.neighborhood,
            municipality: info.municipality,
            state: info.state,
            pc: info.pc,
            interested_people: info.interested_people,
            notif_family: info.notif_family,
            notif_kids: info.notif_kids,
            notif_parents_school: info.notif_parents_school,
            notif_marriage: info.notif_marriage,
            notif_youth: info.notif_youth,
            notif_teens: info.notif_teens,
            notif_entrepreneurship: info.notif_entrepreneurship,
            notif_reach: info.notif_reach,
            notif_praise: info.notif_praise,
            notif_againt_slave_traffic: info.notif_againt_slave_traffic,
            notif_good_news: info.notif_good_news,
            notif_prayer: info.notif_prayer,
            notif_older_adults: info.notif_older_adults,
            leader: info.leader,
            admin: info.admin,
        })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}
