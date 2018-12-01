var connection =  new require('./kafka/connections');
var mongoose = require("mongoose");
var applicantsignup = require("./services/applicantsignup");
var recruitersignup = require("./services/recruitersignup");
var user_login = require("./services/userLoginKafka");
var postJob_recruiter = require("./services/postJobRecruiterKafka");
var getJobs = require("./services/getJobs");
var saveJob = require('./services/saveJob');
var savedJobs = require('./services/savedJobs');
var applyJob = require('./services/applyJob');
var userclicktrack = require("./services/userclick");
var getAppliedJobs = require('./services/getAppliedJobs');
var jobPostingHistory = require("./services/jobPostingHistory");
var getProfile = require('./services/getProfile');
var getInterestedJobs = require('./services/getInterestedJobs');
var jobsearch = require('./services/jobsearch')
var sendConnectionRequest = require('./services/sendConnectionRequest');
var getPendingRequests = require('./services/getPendingRequests');
var ignoreRequest = require('./services/ignoreRequest');
var acceptRequest = require('./services/acceptRequest');
var getConnections = require('./services/getConnections');

function handleTopicRequest(topic_name, fname) {
  var consumer = connection.getConsumer(topic_name);
  var producer = connection.getProducer();
  console.log("server is running ");
  consumer.on("message", function(message) {
    console.log("message received for " + topic_name + " ", fname);
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);

    fname.handle_request(data.data, function(err, res) {
      console.log("after handle" + res);
      var payloads = [
        {
          topic: data.replyTo,
          messages: JSON.stringify({
            correlationId: data.correlationId,
            data: res
          }),
          partition: 0
        }
      ];
      producer.send(payloads, function(err, data) {
        console.log(data);
      });
      return;
    });
  });
}

handleTopicRequest("user_login_topic", user_login);
handleTopicRequest("applicant_signup_topic", applicantsignup);
handleTopicRequest("recruiter_signup_topic", recruitersignup);
handleTopicRequest("postJob_recruiter_topic", postJob_recruiter);
handleTopicRequest("get_jobs_topic", getJobs);
handleTopicRequest("save_job_topic", saveJob);
handleTopicRequest("saved_jobs_topic", savedJobs);
handleTopicRequest("apply_job_topic", applyJob);
handleTopicRequest("user_click_topic", userclicktrack);
handleTopicRequest("get_applied_jobs_topic", getAppliedJobs);
handleTopicRequest("job_posting_history_topic", jobPostingHistory);
handleTopicRequest("get_profile_topic", getProfile);
handleTopicRequest('get_interested_jobs', getInterestedJobs);
handleTopicRequest("jobsearch_topic", jobsearch);
handleTopicRequest('send_connection_request', sendConnectionRequest);
handleTopicRequest('get_pending_requests', getPendingRequests);
handleTopicRequest('ignore_request_topic', ignoreRequest);
handleTopicRequest('accept_request_topic', acceptRequest);
handleTopicRequest('get_connections_topic', getConnections);