$(document).ready(function () {


  if ($('.dataTable').length) {
    $('.dataTable').DataTable();
  }

  // owlCarousel
  if ($("#testimonial-slider").length) {
    $("#testimonial-slider").owlCarousel({
      paginationSpeed: 500,
      singleItem: true,
      autoPlay: 3000,
    });
  }
  if ($("#clients-logo").length) {
    $("#clients-logo").owlCarousel({
      autoPlay: 3000,
      items: 5,
      itemsDesktop: [1199, 5],
      itemsDesktopSmall: [979, 5],
    });
  }


  if ($('#booking-form').length > 0) {

    // $('#booking-form').on('input', 'change', function () {
    //   $('#booking-form').
    // });

  }
});
