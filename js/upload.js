var client_id = "549651560425-r448kpdiie2ban5qbthbreq7sqfse3pe.apps.googleusercontent.com"
var scope = "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube"
var authorized = false

auth = function() {
	gapi.auth.authorize({client_id: client_id, scope: scope}, function(resp){
		authorized = resp.access_token !== undefined
	})
}

uploadFile = function(file, nome) {
  if(!authorized) {
  	auth()
  } 
  if(!authorized) {
  	return
  }
  var metadata = {
    snippet: {
      title: nome,
      description: "Rotodance",
      tags: ["Rotodance"],
      categoryId: 22
    },
    status: {
      privacyStatus: "public"
    }
  };
  var result = {nome: nome}
  videos.splice(0, 0, result);
  var uploader = new MediaUploader({

    baseUrl: 'https://www.googleapis.com/upload/youtube/v3/videos',
    file: file,
    token: gapi.auth.getToken().access_token,
    metadata: metadata,
    params: {
      part: Object.keys(metadata).join(',')
    },
    onError: function(data) {
      var message = data;
      // Assuming the error is raised by the YouTube API, data will be
      // a JSON string with error.message set. That may not be the
      // only time onError will be raised, though.
      try {
        var errorResponse = JSON.parse(data);
        message = errorResponse.error.message;
        alert("Ocorreu um erro, nos desculpe");
      } finally {
        alert("Ocorreu um erro, nos desculpe");
      }
    }.bind(this),
    onProgress: function(data) {
      var bytesUploaded = data.loaded;
      var totalBytes = data.total;
      // The times are in millis, so we need to divide by 1000 to get seconds.
      var percentageComplete = (bytesUploaded * 100) / totalBytes;
      result.progress = percentageComplete;
      console.log(percentageComplete);
    }.bind(this),
    onComplete: function(data) {
      var uploadResponse = JSON.parse(data);
      this.videoId = uploadResponse.id;
      result.id = this.videoId;
      console.log(this.videoId);
    }.bind(this)
  });
  uploader.upload();
};
