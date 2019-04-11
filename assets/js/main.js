$(document).ready(function () {

  // owlCarousel
  if ($("#testimonial-slider").length) {
    $("#testimonial-slider").owlCarousel({
      paginationSpeed: 500,
      singleItem: true,
      autoPlay: 5000,
    });
  }
  if ($("#clients-logo").length) {
    $("#clients-logo").owlCarousel({
      autoPlay: 3000,
      items: 4,
      itemsDesktop: [1199, 4],
      itemsDesktopSmall: [979, 4],
    });
  }


  if ($('#booking-form').length > 0) {

    // $('#booking-form').on('input', 'change', function () {
    //   $('#booking-form').
    // });

  }

  if ($('.image-gallery').length > 0) {
    $('.image-gallery a').simpleLightbox({

    });
  }

  var hasWebP = (function () {
    // some small (2x1 px) test images for each feature
    var images = {
      basic: "data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoCAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA==",
      lossless: "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAQAAAAfQ//73v/+BiOh/AAA="
    };

    return function (feature) {
      var deferred = $.Deferred();

      $("<img>").on("load", function () {
        // the images should have these dimensions
        if (this.width === 2 && this.height === 1) {
          deferred.resolve();
        } else {
          deferred.reject();
        }
      }).on("error", function () {
        deferred.reject();
      }).attr("src", images[feature || "basic"]);

      return deferred.promise();
    }
  })();


  hasWebP().then(function () {
    // webp is supported, nothing to do
  }, function () {
    // No webp support
    $('[style]').filter(function () {
      return $(this).css('background-image').indexOf('.webp') > -1
    }).each(function () {
      $(this).css('background-image', $(this).css('background-image').replace('.webp', '.jpg'));
    })

  });

});
