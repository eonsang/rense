function singleUpload(file, el) {
  var formData = new FormData();
  formData.append("file", file);
  $.ajax({
    data: formData,
    type: "POST",
    url: "/adm/image/editor",
    contentType: false,
    processData: false,
    success: function (res) {
      if (res.success === true) {
        $(el).summernote("editor.insertImage", res.path);
      } else {
        alert("이미지 업로드 실패");
      }
    },
  });
}

function fileUploadForGetPath(file, el) {
  var formData = new FormData();
  formData.append("file", file);
  $.ajax({
    data: formData,
    type: "POST",
    url: "/adm/image/editor",
    contentType: false,
    processData: false,
    success: function (res) {
      if (res.success === true) {
        $(el).next('[name="option_thumbnail_path"]').val(res.path);
      } else {
        alert("이미지 업로드 실패");
      }
    },
  });
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// cookie
function setCookie(cookieName, value, exdays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var cookieValue =
    escape(value) + (exdays == null ? "" : "; expires=" + exdate.toGMTString());
  document.cookie = cookieName + "=" + cookieValue;
}
function deleteCookie(cookieName) {
  var expireDate = new Date();
  expireDate.setDate(expireDate.getDate() - 1);
  document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
}
function getCookie(cookieName) {
  cookieName = cookieName + "=";
  var cookieData = document.cookie;
  var start = cookieData.indexOf(cookieName);
  var cookieValue = "";
  if (start != -1) {
    start += cookieName.length;
    var end = cookieData.indexOf(";", start);
    if (end == -1) end = cookieData.length;
    cookieValue = cookieData.substring(start, end);
  }
  return unescape(cookieValue);
}

function closePopup(id) {
  $("#popup" + id).fadeOut(0);
}
function closePopupToday(id) {
  setCookie("todayClose" + id, "Y", 1);
  $("#popup" + id).fadeOut(0);
}

$(function () {
  $(window).scroll(function () {
    var h = $("html, body").scrollTop();
    if (h > 10) {
      $(".wrapper").addClass("scrolled");
    } else {
      $(".wrapper").removeClass("scrolled");
    }
  });
  $(document).on("change", ".custom-file-input", function () {
    var fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
  });

  $(".category").on("change", function () {
    var that = $(this);
    $.ajax({
      type: "GET",
      url: "/adm/category/child",
      data: {
        id: $(this).val(),
      },
    }).done(function (res) {
      if (res.success) {
        var options = '<option value="">선택</option>';
        res.objects.map(function (data) {
          options +=
            '<option value="' + data.id + '">' + data.name + "</option>";
        });
        var nextSelector = that.data("next");
        $(nextSelector).html(options);
      } else {
        alert("하위 카테고리 불러오기 실패");
      }
    });
  });

  if ($(".textEditor").length > 0) {
    $(".textEditor").summernote({
      lang: "ko-KR",
      placeholder: "",
      height: 300,
      callbacks: {
        onImageUpload: function (files) {
          console.log(files);
          for (var i = 0; i <= files.length - 1; i++) {
            singleUpload(files[i], this);
          }
        },
      },
    });
  }
});

function changeOrderState(value, id) {
  if (confirm("상태를 변경하시겠습니까?")) {
    // 확인 클릭시
    $.ajax({
      type: "POST",
      url: "/adm/order/state/" + id,
      data: {
        value: value,
      },
    }).done(function (res) {
      alert("변경되었습니다.");
      location.reload();
    });
  }
}

function changeOrderSendState(bool, id) {
  var actionState = false;
  if (bool) {
    actionState = confirm("발송을 취소처리 하시겠습니까?");
  } else {
    actionState = confirm("발송을 완료처리 하시겠습니까?");
  }

  if (actionState) {
    // 확인 클릭시
    $.ajax({
      type: "POST",
      url: bool ? "/adm/order/send_false/" + id : "/adm/order/send_true/" + id,
    }).done(function (res) {
      alert("변경되었습니다.");
      location.reload();
    });
  }
}

function changeOrderPaidState(bool, id) {
  var actionState = false;
  if (bool) {
    actionState = confirm("결제 취소처리 하시겠습니까?");
  } else {
    actionState = confirm("결제 완료처리 하시겠습니까?");
  }

  if (actionState) {
    // 확인 클릭시
    $.ajax({
      type: "POST",
      url: bool ? "/adm/order/paid_false/" + id : "/adm/order/paid_true/" + id,
    }).done(function (res) {
      alert("변경되었습니다.");
      location.reload();
    });
  }
}

function changeOrderManager(orderId, managerId) {
  var actionState = confirm("담당자를 변경 하시겠습니까?");

  if (actionState) {
    $.ajax({
      type: "POST",
      url: "/adm/order/" + orderId + "/manager",
      data: {
        managerId: managerId,
      },
    }).done(function (res) {
      alert("변경되었습니다.");
      location.reload();
    });
  }
}
