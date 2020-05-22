$("#c-btn").click((e) => {
  e.preventDefault();
  $("#main-post-ad-container").hide();
  $("#second-post-ad-container").show();
});

$("#p-btn").click((e) => {
  e.preventDefault();
  $("#second-post-ad-container").hide();
  $("#preview-section").show();

  //main-post-ad-container information
  const location_id = $("select[name='location_id'] option:selected").val();
  const ad_id = $("select[name='ad_id'] option:selected").val();
  const category = $("select[name='item_category_id'] option:selected").val();
  const condition = $("select[name='condition'] option:selected").val();
  const payment = $("select[name='method_of_payment'] option:selected").val();
  const commnuication = $(
    "select[name='method_of_communication'] option:selected"
  ).val();
  const negotiable = $("select[name='negotiable'] option:selected").val();

  //post detail
  const title = document.querySelector("#p-title").value;
  const price = document.querySelector("#p-price").value;
  const description = document.querySelector("#p-description").value;

  //preview
  document.querySelector("#preview_location_id").innerHTML = location_id;
  document.querySelector("#preview_title").innerHTML = title;
  document.querySelector("#preview_price").innerHTML = price;
  document.querySelector("#preview_Description").innerHTML = description;
  document.querySelector("#preview_condition").innerHTML = condition;
  document.querySelector("#preview_payment").innerHTML = payment;
  document.querySelector("#preview_communication").innerHTML = commnuication;
  document.querySelector("#preview_Negotiable").innerHTML = negotiable;
});

$("#back-btn").click((e) => {
  e.preventDefault();
  $("#second-post-ad-container").hide();
  $("#main-post-ad-container").show();
});

$("#back-btn2").click((e) => {
  e.preventDefault();
  $("#preview-section").hide();
  $("#second-post-ad-container").show();
});

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $("#preview_img").attr("src", e.target.result);
    };

    reader.readAsDataURL(input.files[0]); // convert to base64 string
  }
}

$("#customFile").change(function () {
  readURL(this);
});
