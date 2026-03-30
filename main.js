const header = document.querySelector(".site-header");
const toggle = document.querySelector(".menu-toggle");
const navWrap = document.querySelector(".nav-wrap");
const yearNodes = document.querySelectorAll("[data-current-year]");
const revealNodes = document.querySelectorAll("[data-reveal]");
const demoForms = document.querySelectorAll("[data-demo-form]");
const copyPhoneButtons = document.querySelectorAll("[data-copy-phone]");
const TELEGRAM_PHONE = "79998885566";
const TELEGRAM_CHAT_URL = `https://t.me/+${TELEGRAM_PHONE}`;

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

demoForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const lines = [
      "Здравствуйте! Хочу узнать подробнее о модульном доме.",
      `Имя: ${String(formData.get("name") || "").trim() || "Не указано"}`,
      `Телефон: ${String(formData.get("phone") || "").trim() || "Не указано"}`,
      `Email: ${String(formData.get("email") || "").trim() || "Не указано"}`,
      `Модель: ${String(formData.get("model") || "").trim() || "Нужна консультация"}`,
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
  const phone = button.getAttribute("data-copy-phone") || "+7 999 888 5566";

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
    <button class="quick-bar__item" type="button" data-copy-phone="+7 999 888 5566">Позвонить</button>
    <a class="quick-bar__item quick-bar__item--dark" href="${TELEGRAM_CHAT_URL}">Telegram</a>
    <a class="quick-bar__item quick-bar__item--accent" href="./contacts.html">Заявка</a>
  `;
  document.body.appendChild(quickBar);

  quickBar.querySelectorAll("[data-copy-phone]").forEach((button) => {
    const defaultLabel = button.textContent.trim();
    const phone = button.getAttribute("data-copy-phone") || "+7 999 888 5566";

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
