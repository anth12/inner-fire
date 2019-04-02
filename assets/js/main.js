$(document).ready(function () {


  if ($('.dataTable').length) {
    $('.dataTable').DataTable();
  }

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

});
