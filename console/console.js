$ = function(i) { return document.getElementById(i); };


// publish something
function publishExample() {
  var post = {
    message: 'This is some text',
    action_links: [
      { text:'custom action link', href:'http://mu.daaku.org/' }
    ],
    user_message_prompt: 'Tell the world about Popups?'
  };
  Mu.publish(post, function(published_post) {
    statusUpdate(
      'sans-session-info',
      'post was ' + (published_post ? '' : 'not ') + 'published.',
      published_post
    );
  });
}

function showUserInfo() {
  var userInfo = $('user-info');
  if (!Mu.session()) {
    userInfo.style.visibility = 'hidden';
  } else {
    var params = {
      method: 'Fql.query',
      query: (
        'SELECT ' +
          'name,' +
          'pic_square,' +
          'profile_url ' +
        'FROM ' +
          'user ' +
        'WHERE ' +
          'uid=' + Mu.session().uid
      )
    };

    Mu.api(params, function(info) {
      info = info[0];

      $('user-name').innerHTML = info.name;
      $('user-pic').src = info.pic_square;
      userInfo.href = info.profile_url;
      userInfo.style.visibility = 'visible';
    });
  }
}

function showSessionInfo() {
  var
    session     = Mu.session(),
    sessionInfo = $('info');

  if (!session) {
    sessionInfo.style.visibility = 'hidden';
  } else {
    var rows = [];
    for (var key in session) {
      rows.push('<th>' + key + '</th>' + '<td>' + session[key] + '</td>');
    }
    sessionInfo.style.visibility = 'visible';
    sessionInfo.innerHTML = (
      '<table>' +
      '<tr>' + rows.join('</tr><tr>') + '</tr>' +
      '</table>'
    );
  }
}

// handles a session (or lack thereof)
function gotStatus(session) {
  showSessionInfo();
  showUserInfo();

  var status = session ? 'connected' : 'disconnected';
  $('status').innerHTML = status;
  $('status').className = status;

  var input = $('integration').getElementsByTagName('input');
  for (var i=0, l=input.length; i<l; i++) {
    input[i].disabled = !session;
  }

  if (session) {
    $('bt-disconnect').disabled = $('bt-logout').disabled = false;
    $('bt-login').disabled = true;
  } else {
    $('bt-login').disabled = false;
    $('bt-disconnect').disabled = $('bt-logout').disabled = true;
  }
}

function gotPerms(session, perms) {
  gotStatus(session);
  statusUpdate(
    'perms-info',
    'were ' + (perms ? '' : 'not ') + 'granted.',
    perms
  );
}

function statusUpdate(infoID, msg, yes) {
  var info = $(infoID);
  info.innerHTML = msg;
  info.className = 'info ' + (yes ? 'yes' : 'no');
  info.style.visibility = 'visible';
  window.setTimeout(function() { info.style.visibility = 'hidden'; }, 3000);
}

function friendAdded(added) {
  statusUpdate(
    'integration-info',
    'friend was ' + (added ? '' : 'not ') + 'added.',
    added
  );
}
