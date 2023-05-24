jQuery( document ).ready( function() {

  // Video Previews Manager
  (function videosPreviewsManager() {
    var videosPreviewsXhrs = {};
    var videosPreviewsBuffer = {};

    jQuery( '.video-with-trailer' ).each( function( index, value ) {
      var $videoPreview = jQuery( this ).find( '.video-preview' );
      var postId = jQuery( this ).data( 'post-id' );
      var $videoDebounceBar = jQuery( this ).find( '.video-debounce-bar' );
      var $videoImg = jQuery( this ).find( '.video-img' );
      var $videoName = jQuery( this ).find( '.video-name' );
      var $videoDuration = jQuery( this ).find( '.video-duration' );

      videosPreviewsBuffer[postId] = false;

      // On mouseenter event.
      jQuery( value ).on( 'mouseenter', function( event ) {
        if ( ! $videoImg.hasClass( 'loaded' ) ) {
          return;
        }

        $videoDebounceBar.addClass( 'video-debounce-bar--wait' );
        // $videoName.addClass( 'video-name--hidden' );
        // $videoDuration.addClass( 'video-duration--hidden' );
        videosPreviewsBuffer[postId] = true;
        setTimeout( function() {
          if ( ! videosPreviewsBuffer[postId] ) {
            return;
          }
          jQuery.ajax({
            beforeSend: function( xhr ) {
              videosPreviewsXhrs[postId] = xhr;
            },
            method: 'POST',
            url: kot_ajax_var.url,
            dataType: 'json',
            data: {
              action: 'kot_load_video_preview',
              nonce: kot_ajax_var.nonce,
              post_id: postId
            }
          })
          .done( function( response ) {
            var $canvas, canvasId;
            if ( ! ( videosPreviewsBuffer[postId] && response.success && '' !== response.data ) ) {
              return;
            }
            // Add the Model Preview in the DOM directly.
            // The Model Preview wrapper is z-indexed 50.
            $videoPreview.html( response.data ).show( function() {
              // Hide the Model Image to reveal the preview.
              // Model Image is z-indexed 100.
              if ( videosPreviewsBuffer[postId] ) {
                $videoImg.addClass( 'video-img--hidden' );
              }
            });
          }); // End of Ajax call.
        }, 250 ); // End of settimeout
      }); // End of mouseenter event.

      // On mouseleave event.
      jQuery( value ).on( 'mouseleave', function( event ) {
        videosPreviewsBuffer[postId] = false;
        $videoImg.removeClass( 'video-img--hidden' );
        // $videoName.removeClass( 'video-name--hidden' );
        // $videoDuration.removeClass( 'video-duration--hidden' );
        $videoDebounceBar.removeClass( 'video-debounce-bar--wait' );

        setTimeout( function() {
          $videoPreview.html( '' );
        }, 200 );

        // Abort current postId xhr if exists.
        if ( videosPreviewsXhrs[postId] ) {
          videosPreviewsXhrs[postId].abort();
          delete( videosPreviewsXhrs[postId] );
        }
      }); // End of mouseleave event.

    }); // End of each.
  })(); // End of Models Previews Manager IFEE.

  //Multithumbs
  var changeThumb = null;
  var stopped = false;
  jQuery('body').on('mouseenter', '.thumbs-rotation', function(e){
      var $this = jQuery(this);
      stopped = false;
      if( $this.data('thumbs') !== undefined ){
          var dataThumbs = $this.data('thumbs');
          var thumbs = dataThumbs.split(',');
          var nbThumbs = thumbs.length;
          var i = 1;
          changeThumb = null;
          clearTimeout(changeThumb);
          changeThumb = function() {
              if( stopped == false ){
                  $this.find('img').attr('srcset', thumbs[i - 1]);
                  if (i <= nbThumbs ) {
                      setTimeout(changeThumb, 700);
                      if( i == nbThumbs){
                          i = 1;
                      }else{
                        i++;
                      }
                  }
              }
          };
          changeThumb();
      }
  }).on('mouseleave', '.thumbs-rotation', function(e){
      stopped = true;
      changeThumb = null;
      var highestTimeoutId = setTimeout(";");
      for (var i = 0 ; i < highestTimeoutId ; i++) {
          clearTimeout(i);
      }
      var $blockImg = jQuery(this).find('img');
      var defaultThumb = $blockImg.attr('src');
      $blockImg.attr('srcset', defaultThumb);
  });

  // Open search form
  jQuery( '.header-search-toggle' ).click( function() {
    // if ( jQuery( window ).width() <= 767.98 ) {
      jQuery( '.header-search-form' ).slideToggle( 200 );
    /*}
    if ( jQuery( window ).width() >= 768 ) {
      jQuery( '.header-search-form' ).animate({ width: 'toggle' }, 200 );
      jQuery( '.search-field' ).focus();
    }*/
  });
  // Move search form
  // if ( jQuery( window ).width() <= 767.98 ) {
  //   jQuery( '.header-search-form' ).appendTo( '#wrapper-navbar' );
  // }
  // if ( jQuery( window ).width() >= 768 ) {
  //   jQuery( '.header-search-form' ).prependTo( '.search-nav' );
  // }
  // jQuery( window ).resize( function() {
  //   if ( jQuery( window ).width() <= 767.98 ) {
  //     jQuery( '.header-search-form' ).appendTo( '#wrapper-navbar' );
  //   }
  //   if ( jQuery( window ).width() >= 768 ) {
  //     jQuery( '.header-search-form' ).prependTo( '.search-nav' );
  //   }
  // });
  // jQuery('.header-search-form').insertAfter('.navbar');

  // Load videojs
  if(jQuery('#kot-video').length > 0 && !kot_ajax_var.ctpl_installed){
    var playerOptions = {
      controlBar: {
        children: [
              'playToggle',
              'progressControl',
              'durationDisplay',
              'volumePanel',
              'qualitySelector',
              'fullscreenToggle',
        ],
      },
    };
    videojs('kot-video', playerOptions);
  }

  // Close inplayer advertising
  jQuery('body').on('click', '.happy-inside-player .close-text', function(e) {
    jQuery(this).parent('.happy-inside-player').hide();
  });

  // Related videos beside player
  var playerHeight = jQuery('.responsive-player').height();
  jQuery('.side-related').css('height', playerHeight);
  jQuery('.slick-list').css('height', playerHeight);

  jQuery(window).resize(function() {
    var playerHeight = jQuery('.responsive-player').height();
    jQuery('.side-related').css('height', playerHeight);
    jQuery('.slick-list').css('height', playerHeight);
  });

  // Slick carousel loading
  jQuery('.side-related').slick({
    vertical: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-chevron-up"></i></button>',
    nextArrow: '<button type="button" class="slick-next"><i class="fa fa-chevron-down"></i></button>',
  });

  // Replace all SVG images with inline SVG
  jQuery( 'img[src$=".svg"]' ).each( function() {
    var $img = jQuery( this );
    var imgURL = $img.attr( 'src' );
    var attributes = $img.prop( 'attributes' );
    var id = $img.parent( 'a' ).attr( 'id' );

    jQuery.get( imgURL, function( data ) {

      // Get the SVG tag, ignore the rest
      var $svg = jQuery( data ).find( 'svg' );

      // Remove any invalid XML tags
      $svg = $svg.removeAttr( 'xmlns:a' );

      // Loop through IMG attributes and apply on SVG
      jQuery.each( attributes, function() {
        $svg.attr( this.name, this.value );
      });

      // Replace IMG with SVG
      $img.replaceWith( $svg );

      if ( 'wps-logo-link' === id ) {
        jQuery( '#' + id ).addClass( 'show-logo' );
      }
    }, 'xml' );
  });

  /** IIFE Set Post views with ajax request for cache compatibility */
  (function(){
    var is_post = jQuery('body.single-post').length > 0;
    if( !is_post ) return;
    var post_id = jQuery('article.post').attr('id').replace('post-', '');
    jQuery.ajax({
      type: 'post',
      url: kot_ajax_var.url,
      dataType: 'json',
      data: {
        action: 'post-views',
        nonce: kot_ajax_var.nonce,
        post_id: post_id
      }
    })
    .done(function(doneData){
      // console.log(doneData);
    })
    .fail(function(errorData){
      console.error(errorData);
    })
    .always(function(alwaysData){
      //get post views & rating data
      jQuery.ajax({
        type: 'post',
        url: kot_ajax_var.url,
        dataType: 'json',
        data: {
          action: 'get-post-data',
          nonce: kot_ajax_var.nonce,
          post_id: post_id
        }
      })
      .done(function(doneData){
        if(doneData.views) {
          jQuery("#video-views span.views-number").text(doneData.views);
        }
        if(doneData.likes) {
            jQuery(".likes_count").text(doneData.likes);
        }
        if(doneData.dislikes) {
            jQuery(".dislikes_count").text(doneData.dislikes);
        }
        if(doneData.rating) {
            jQuery(".percentage").text(doneData.rating);
            jQuery(".rating-bar-meter").css('width', doneData.rating);
        }
      })
      .fail(function(errorData){
        console.error(errorData);
      })
      .always(function(){
        // always stuff
      })
    });
  })();

  /** Post like **/
  jQuery(".post-like a").on('click', function(e){
      e.preventDefault();

      var heart = jQuery(this);
      var post_id = heart.data("post_id");
      var post_like = heart.data("post_like");

      jQuery.ajax({
          type: "post",
          url: kot_ajax_var.url,
          dataType   : "json",
          data: "action=post-like&nonce=" + kot_ajax_var.nonce + "&post_like=" + post_like + "&post_id=" + post_id,
          success    : function(data, textStatus, jqXHR){
              if(data.alreadyrate !== true) {
                  jQuery(".rating-bar-meter").removeClass("not-rated-yet");
                  /*jQuery(".rating").text(Math.floor(data.pourcentage) + "%");
                  jQuery(".rating").show();*/

                  jQuery(".rating-result .percentage").text(Math.floor(data.percentage) + "%");
                  jQuery(".rating-result .percentage").show();

                  jQuery(".likes .likes_count").text(data.likes);
                  jQuery(".likes .dislikes_count").text(data.dislikes);

                  jQuery(".post-like").text(data.button);

                  if( data.nbrates > 0 ){
                      jQuery(".rating-bar-meter").animate({
                          width: data.progressbar + "%",
                      }, "fast", function() {
  // Animation complete.
  });
                  }
              }
          }
      });
      return false;
  });

  // Video share toggle
  jQuery('#show-sharing-buttons').click(function(e){
    e.preventDefault();
    jQuery('.video-share-box').slideToggle('fast');
    if (jQuery('.video-share-box').css('display') == 'block') {
      jQuery(this).addClass('active');
    }else{
      jQuery(this).removeClass('active');
    }
  });

  // Copy video share url to clipboard
  jQuery("#clickme").click(function() {
    var textToCopy = jQuery("#copyme").val();
    jQuery(this)
      .parent()
      .children("#temptext")
      .val(textToCopy);
    jQuery(this)
      .parent()
      .children("#temptext")
      .select();
    document.execCommand("copy");
    jQuery(this)
      .replaceWith('<span id="clickme"><i class="fa fa-check"></i> Copied</span>');
  });
});

// Menu mobile
var forEach = function( t, o, r ) {
  if ( '[object Object]' === Object.prototype.toString.call( t ) ) {
    for ( var c in t ) {
      Object.prototype.hasOwnProperty.call( t, c ) && o.call( r, t[c], c, t );
    }
  } else {
    for ( var e = 0, l = t.length; l > e; e++ ) {
      o.call( r, t[e], e, t );
    }
  }
};
var hamburgers = document.querySelectorAll( '.hamburger' );
if ( hamburgers.length > 0 ) {
  forEach( hamburgers, function( hamburger ) {
    hamburger.addEventListener( 'click', function() {
      this.classList.toggle( 'is-active' );
    }, false );
  });
}