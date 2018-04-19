window.addEventListener('load', function() {
  var userProfile;
  var content = document.querySelector('.content');
  var loadingSpinner = document.getElementById('loading');
  content.style.display = 'block';
  loadingSpinner.style.display = 'none';

  var webAuth = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    redirectUri: AUTH0_CALLBACK_URL,
    audience: 'https://' + AUTH0_DOMAIN + '/userinfo',
    responseType: 'token id_token',
    scope: 'openid profile email',
    leeway: 60
  });

  var loginStatus = document.querySelector('.content h4');
  var loginView = document.getElementById('login-view');
  var homeView = document.getElementById('home-view');
  var profileView = document.getElementById('profile-view');
  var videoView = document.getElementById('video-view');
  var analyticsView = document.getElementById('analytics-view');

  // buttons and event listeners
  var loginBtn = document.getElementById('btn-login');
  var logoutBtn = document.getElementById('btn-logout');

  var homeViewBtn = document.getElementById('btn-home-view');
  var profileViewBtn = document.getElementById('btn-profile-view');
  var videoViewBtn = document.getElementById('btn-video-view');
  var analyticsViewBtn = document.getElementById('btn-analytics-view');

  homeViewBtn.addEventListener('click', function() {
    homeView.style.display = 'inline-block';
    profileView.style.display = 'none';
    videoView.style.display = 'none';
    analyticsView.style.display = 'none';
  });

  profileViewBtn.addEventListener('click', function() {
    homeView.style.display = 'none';
    profileView.style.display = 'inline-block';
    videoView.style.display = 'none';
    getProfile();
  });
    
  videoViewBtn.addEventListener('click', function() {
    homeView.style.display = 'none';
    profileView.style.display = 'none';
    videoView.style.display = 'inline-block';
    analyticsView.style.display = 'none';
    // getProfile();
  });    


  loginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    webAuth.authorize();
  });

  logoutBtn.addEventListener('click', logout);

  function setSession(authResult) {
    // Set the time that the access token will expire at
    var expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  function logout() {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('actorName');
    localStorage.removeItem('actorEmail');
    displayButtons();
  }

  function isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  function displayButtons() {
    var loginStatus = document.querySelector('.content h4');
    if (isAuthenticated()) {
      profileView.style.display = 'none';
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'inline-block';
      profileViewBtn.style.display = 'inline-block';
      videoViewBtn.style.display = 'inline-block';
      analyticsViewBtn.style.display = 'inline-block';
      loginStatus.innerHTML =
        'You are logged in! You can now watch the videos.';
      getActorProfile();

        
    } else {
      homeView.style.display = 'inline-block';
      loginBtn.style.display = 'inline-block';
      logoutBtn.style.display = 'none';
      profileViewBtn.style.display = 'none';
      profileView.style.display = 'none';
      videoView.style.display = 'none';
      videoViewBtn.style.display = 'none';  
      analyticsViewBtn.style.display = 'none';
      loginStatus.innerHTML =
        'You are not logged in! You can choose from your existing accounts to login without filling out any forms. Please log in to participate.';
    }
  }

  function getProfile() {
    if (!userProfile) {
      var accessToken = localStorage.getItem('access_token');
        

      if (!accessToken) {
        console.log('Access token must exist to fetch profile');
      }

      webAuth.client.userInfo(accessToken, function(err, profile) {
        if (profile) {
          userProfile = profile;
          displayProfile();

        }
      });
    } else {
      displayProfile();
      
    }
  }

  function getActorProfile() {
    if (!userProfile) {
      var accessToken = localStorage.getItem('access_token');
        

      if (!accessToken) {
        console.log('Access token must exist to fetch profile');
      }

      webAuth.client.userInfo(accessToken, function(err, profile) {
        if (profile) {
          userProfile = profile;
          storeActorInfo();

        }
      });
    } else {
      storeActorInfo();
      
    }
  }

function storeActorInfo() {
    if (localStorage) {
        localStorage.actorName = userProfile.name;
        localStorage.actorEmail = userProfile.email;      
        console.log('local storage actor name:' + localStorage.actorName);
        console.log('local storage actor email:' + localStorage.actorEmail);
      } else {
        console.log('local storage is not supported');
      }    
    
}    
    
  function displayProfile() {
    // Get email and name in local storage
     getActorProfile();      
      
    // display the profile name
    document.querySelector('#profile-view .name').innerHTML =
      userProfile.name;
      
    // display the email
    document.querySelector('#profile-view .email').innerHTML =
      userProfile.email;
    

    document.querySelector(
      '#profile-view .full-profile'
    ).innerHTML = JSON.stringify(userProfile, null, 2);
      
    document.querySelector('#profile-view img').src = userProfile.picture;
  }

  function handleAuthentication() {
    webAuth.parseHash(function(err, authResult) {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        setSession(authResult);
        loginBtn.style.display = 'none';
        homeView.style.display = 'inline-block';
      } else if (err) {
        homeView.style.display = 'inline-block';
        console.log(err);
        alert(
          'Error: ' + err.error + '. Check the console for further details.'
        );
      }
      displayButtons();
    });
  }

  handleAuthentication();
});