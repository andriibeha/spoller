//SPOLLERS
const spollersArray = document.querySelectorAll("[data-spollers]");
if (spollersArray.length > 0) {
  //Получаємо масив спойлерів
  const spollersRegular = Array.from(spollersArray).filter(function (
    item,
    index,
    self
  ) {
    return !item.dataset.spollers.split(",")[0];
  });
  //Ініціалізація простих спойлерів
  if (spollersRegular.length > 0) {
    initSpollers(spollersRegular);
  }

  //Получаємо спойлери з медіа запитом
  const spollersMedia = Array.from(spollersArray).filter(function (
    item,
    index,
    self
  ) {
    return item.dataset.spollers.split(",")[0];
  });

  //Ініціалізація спойлерів із медіа запитом
  if (spollersMedia.length > 0) {
    const breakpointsArray = [];
    spollersMedia.forEach((item) => {
      const params = item.dataset.spollers;
      const breakpoint = {};
      const paramsArray = params.split(",");
      breakpoint.value = paramsArray[0];
      breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
      breakpoint.item = item;
      breakpointsArray.push(breakpoint);
    });

    //Получаємо унікальний брейкпоінт
    let mediaQueries = breakpointsArray.map(function (item) {
      return (
        "(" +
        item.type +
        "-width:" +
        item.value +
        "px)," +
        item.value +
        "," +
        item.type
      );
    });
    mediaQueries = mediaQueries.filter(function (item, index, self) {
      return self.indexOf(item) === index;
    });

    //Робота з кожним брейкпоінтом
    mediaQueries.forEach((breakpoint) => {
      const paramsArray = breakpoint.split(",");
      const mediaBreakpoint = paramsArray[1];
      const mediaType = paramsArray[2];
      const matchMedia = window.matchMedia(paramsArray[0]);

      //Обєкти з потрібними умовами
      const spollersArray = breakpointsArray.filter(function (item) {
        if (item.value === mediaBreakpoint && item.value === mediaType) {
          return true;
        }
      });
      //Дія
      matchMedia.addEventListener("click", function () {
        initSpollers(spollersArray, matchMedia);
      });
      initSpollers(spollersArray, matchMedia);
    });
  }
}
// Ініціалізація
function initSpollers(spollersArray, matchMedia = false) {
  spollersArray.forEach((spollerBlock) => {
    spollerBlock = matchMedia ? spollerBlock.item : spollerBlock;
    if (matchMedia.matches || !matchMedia) {
      spollerBlock.classList.add("_init");
      initSpollerBody(spollerBlock);
      spollerBlock.addEventListener("click", setSpollerAction);
    } else {
      spollerBlock.classList.remove("_init");
      initSpollerBody(spollerBlock, false);
      spollerBlock.removeEventListener("click", setSpollerAction);
    }
  });
}
//Робота з контентом
function initSpollerBody(spollerBlock, hideSpollerBody = true) {
  const spollerTitles = spollerBlock.querySelectorAll("[data-spoller]");
  if (spollerTitles.length > 0) {
    spollerTitles.forEach((spollerTitle) => {
      if (hideSpollerBody) {
        spollerTitle.removeAttribute("tabindex");
        if (!spollerTitle.classList.contains("_active")) {
          spollerTitle.nextElementSibling.hiden = true;
        }
      } else {
        spollerTitle.setAttribute("tabindex", "-1");
        spollerTitle.nextElementSibling.hiden = false;
      }
    });
  }
}

function setSpollerAction(e) {
  const el = e.target;
  if (el.hasAttribute("data-spoller") || el.closest("[data-spoller]")) {
    const spollerTitle = el.hasAttribute("data-spoller")
      ? el
      : el.closest("[data-spoller]");
    const spollerBlock = spollerTitle.closest("[data-spollers]");
    const oneSpoller = spollerBlock.hasAttribute("data-one-spoller")
      ? true
      : false;
    if (!spollerBlock.querySelectorAll(".slide").length) {
      if (oneSpoller && !spollerTitle.classList.contains("_active")) {
        hideSpollersBody(spollerBlock);
      }
      spollerTitle.classList.toggle("_active");
      _slideToggle(spollerTitle.nextElementSibling, 500);
    }
    e.preventDefault();
  }
}

function hideSpollersBody(spollerBlock) {
  const spollerActiveTitle = spollerBlock.querySelector(
    "[data-spoller]._active"
  );
  if (spollerActiveTitle) {
    spollerActiveTitle.classList.remove("_active");
    _slideUp(spollerActiveTitle.nextElementSibling, 500);
  }
}

let _slideUp = (target, duration = 500) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = target.offsetHeight + "px";
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.MarginBottom = 0;
    window.setTimeout(() => {
      target.hiden = true;
      target.style.removeProperty("height");
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
    }, duration);
  }
};

let _slideDown = (target, duration = 500) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    if (target.hidden) {
      target.hidden = false;
    }
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.MarginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = target.offsetHeight + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");

    window.setTimeout(() => {
      target.hiden = true;
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
    }, duration);
  }
};

let _slideToggle = (target, duration = 500) => {
  if (target.hidden) {
    return _slideDown(target, duration);
  } else {
    return _slideUp(target, duration);
  }
};
