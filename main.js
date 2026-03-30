const header = document.querySelector(".site-header");
const toggle = document.querySelector(".menu-toggle");
const navWrap = document.querySelector(".nav-wrap");
const yearNodes = document.querySelectorAll("[data-current-year]");
const revealNodes = document.querySelectorAll("[data-reveal]");
const demoForms = document.querySelectorAll("[data-demo-form]");
const copyPhoneButtons = document.querySelectorAll("[data-copy-phone]");
const phoneInputs = document.querySelectorAll("[data-phone-input]");
const TELEGRAM_USERNAME = "luvlarion4ik";
const TELEGRAM_CHAT_URL = `https://t.me/${TELEGRAM_USERNAME}`;
const DEFAULT_PHONE = "+7 961 585-65-21";

const copyText = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "absolute";
  helper.style.left = "-9999px";
  document.body.appendChild(helper);
  helper.select();
  document.execCommand("copy");
  document.body.removeChild(helper);
};

const formatPhoneValue = (rawValue) => {
  const digitsOnly = rawValue.replace(/\D/g, "");

  if (!digitsOnly) {
    return "";
  }

  let normalized = digitsOnly;

  if (normalized.startsWith("8")) {
    normalized = `7${normalized.slice(1)}`;
  } else if (!normalized.startsWith("7")) {
    normalized = `7${normalized.slice(0, 10)}`;
  }

  normalized = normalized.slice(0, 11);

  const country = normalized.slice(0, 1);
  const part1 = normalized.slice(1, 4);
  const part2 = normalized.slice(4, 7);
  const part3 = normalized.slice(7, 9);
  const part4 = normalized.slice(9, 11);

  let result = `+${country}`;

  if (part1) {
    result += ` ${part1}`;
  }

  if (part2) {
    result += ` ${part2}`;
  }

  if (part3) {
    result += `-${part3}`;
  }

  if (part4) {
    result += `-${part4}`;
  }

  return result;
};

if (header) {
  const syncHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 16);
  };

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });
}

if (toggle && navWrap) {
  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    navWrap.classList.toggle("is-open", !expanded);
  });

  navWrap.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      navWrap.classList.remove("is-open");
    });
  });
}

yearNodes.forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

if (revealNodes.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

phoneInputs.forEach((input) => {
  input.addEventListener("input", () => {
    input.value = formatPhoneValue(input.value);
  });

  input.addEventListener("focus", () => {
    if (!input.value.trim()) {
      input.value = "+7 ";
    }
  });

  input.addEventListener("blur", () => {
    if (input.value.trim() === "+7") {
      input.value = "";
    }
  });
});

demoForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const lines = [
      "Здравствуйте! Хочу узнать подробнее о модульном доме.",
      `Имя: ${String(formData.get("name") || "").trim() || "Не указано"}`,
      `Телефон: ${String(formData.get("phone") || "").trim() || "Не указано"}`,
      `Email: ${String(formData.get("email") || "").trim() || "Не указано"}`,
      `Регион: ${String(formData.get("region") || "").trim() || "Не указано"}`,
      `Модель: ${String(formData.get("model") || "").trim() || "Нужна консультация"}`,
      `Количество модулей: ${String(formData.get("modules") || "").trim() || "Не указано"}`,
      `Формат проживания: ${String(formData.get("use_case") || "").trim() || "Не указано"}`,
      `Желаемая площадь: ${String(formData.get("area") || "").trim() || "Не указано"}`,
      "",
      "Комментарий:",
      String(formData.get("message") || "").trim() || "Без комментария",
    ];
    const telegramUrl = `${TELEGRAM_CHAT_URL}?text=${encodeURIComponent(lines.join("\n"))}`;
    const success = form.querySelector(".form-success");

    if (success) {
      success.textContent = "Сообщение подготовлено. Откроется Telegram с заполненной заявкой, где останется только отправить ее.";
      success.classList.add("is-visible");
    }

    window.open(telegramUrl, "_blank", "noopener");
    form.reset();
  });
});

copyPhoneButtons.forEach((button) => {
  const defaultLabel = button.textContent.trim();
  const phone = button.getAttribute("data-copy-phone") || DEFAULT_PHONE;

  button.addEventListener("click", async (event) => {
    event.preventDefault();

    try {
      await copyText(phone);
      button.textContent = "Номер скопирован";
      window.setTimeout(() => {
        button.textContent = defaultLabel;
      }, 1800);
    } catch (error) {
      button.textContent = phone;
      window.setTimeout(() => {
        button.textContent = defaultLabel;
      }, 2200);
    }
  });
});

if (!document.querySelector(".quick-bar")) {
  const quickBar = document.createElement("div");
  quickBar.className = "quick-bar";
  quickBar.innerHTML = `
    <button class="quick-bar__item" type="button" data-copy-phone="${DEFAULT_PHONE}">Позвонить</button>
    <a class="quick-bar__item quick-bar__item--dark" href="${TELEGRAM_CHAT_URL}">Telegram</a>
    <a class="quick-bar__item quick-bar__item--accent" href="./contacts.html">Заявка</a>
  `;
  document.body.appendChild(quickBar);

  quickBar.querySelectorAll("[data-copy-phone]").forEach((button) => {
    const defaultLabel = button.textContent.trim();
    const phone = button.getAttribute("data-copy-phone") || DEFAULT_PHONE;

    button.addEventListener("click", async () => {
      try {
        await copyText(phone);
        button.textContent = "Скопировано";
        window.setTimeout(() => {
          button.textContent = defaultLabel;
        }, 1800);
      } catch (error) {
        button.textContent = phone;
        window.setTimeout(() => {
          button.textContent = defaultLabel;
        }, 2200);
      }
    });
  });
}
