/*$( '.fb_button' ).on( 'click', function( e ){
    e.preventDefault();

    if (window.location.hash.length == 0) {
        var path = 'https://www.facebook.com/dialog/oauth?';
        var queryParams = ['client_id=' + appID,
                           'redirect_uri=' + window.location,
                           'response_type=token',
                          ''];
        var query = queryParams.join('&');
        var url = path + query;

        var w = window.open(url,"facebook-garbage", "height=300, width=760");
    }
});

if( /access_token/.test( window.location.hash ) ){

    var accessToken = /access_token=([^&]+)/.exec(window.location.hash.substring(1))[1];
    window.opener.waitAuth.resolve( accessToken );
}*/

window.fbAsyncInit = function() {

    var $ = window.$,
        FB = window.FB;

    FB.init({
        appId      : appid,
        status     : true,
        cookie     : true,
        xfbml      : true,
        oauth      : true
    });

    FB.getLoginStatus( function( auth ){

        if( auth.status != 'connected' ) return;
        $(".instructions").addClass( 'hide' );
        var fbButton = $(".fb-login-button").parent().empty();
        $('<img>',{
            src: 'https://graph.facebook.com/' + auth.authResponse.userID + '/picture/' })
            .appendTo( fbButton );

        $.getJSON('https://graph.facebook.com/' + auth.authResponse.userID,function( d ){

            fbButton.append( '<span class="name">Hi, ' + d.first_name + '</span>' );
            window.store = {};
            window.store.name = d.first_name;
        });

        var access_token = auth.authResponse.accessToken;
        waitAuth.resolve( auth.authResponse );

        /*FB.api('/me/friends',{
         fields: 'name,id,location,birthday'
         }, function( resp){
         resp.data.forEach(function(x){ if( !x.birthday ){ console.log( x.name, x ) } } );

         });*/
    });


};

$("<iframe>",{
    src: ""
});


(function(d){
    var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    d.getElementsByTagName('head')[0].appendChild(js);
}(document));


