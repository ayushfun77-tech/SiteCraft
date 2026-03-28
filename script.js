const root = document.documentElement;
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)");
const themeStorageKey = "sitecraft-theme";

function getSavedTheme() {
    try {
        return localStorage.getItem(themeStorageKey);
    } catch (error) {
        return null;
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem(themeStorageKey, theme);
    } catch (error) {
        return;
    }
}

const initialTheme = getSavedTheme() || (systemPrefersDark.matches ? "dark" : "light");

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");

function applyTheme(theme, shouldPersist) {
    root.setAttribute("data-theme", theme);

    if (shouldPersist) {
        saveTheme(theme);
    }

    if (themeIcon) {
        themeIcon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }

    if (themeText) {
        themeText.textContent = theme === "dark" ? "Light" : "Dark";
    }

    if (themeToggle) {
        const nextMode = theme === "dark" ? "light" : "dark";
        themeToggle.setAttribute("aria-label", `Switch to ${nextMode} mode`);
        themeToggle.setAttribute("title", `Switch to ${nextMode} mode`);
    }
}

applyTheme(initialTheme, false);

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(nextTheme, true);
    });
}

function syncSystemTheme(event) {
    if (!getSavedTheme()) {
        applyTheme(event.matches ? "dark" : "light", false);
    }
}

if (typeof systemPrefersDark.addEventListener === "function") {
    systemPrefersDark.addEventListener("change", syncSystemTheme);
} else if (typeof systemPrefersDark.addListener === "function") {
    systemPrefersDark.addListener(syncSystemTheme);
}

const navLinks = document.getElementById("navLinks");
const hamburger = document.getElementById("hamburger");

if (navLinks && hamburger) {
    hamburger.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("active");
        document.body.classList.toggle("menu-open", isOpen);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            document.body.classList.remove("menu-open");
        });
    });
}

const timeSlotsContainer = document.getElementById("timeSlots");

if (timeSlotsContainer) {
    const slots = ["10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

    slots.forEach((slot) => {
        const cleanId = `slot-${slot.replace(/:/g, "").replace(/\s/g, "")}`;
        const wrapper = document.createElement("div");

        wrapper.innerHTML = `
            <input type="radio" id="${cleanId}" name="preferred_time" value="${slot}" required class="hidden">
            <label for="${cleanId}" class="time-slot-label">${slot}</label>
        `;

        timeSlotsContainer.appendChild(wrapper);
    });
}

const dateInput = document.getElementById("date");

if (dateInput) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    dateInput.min = `${year}-${month}-${day}`;
}

const form = document.getElementById("bookingForm");
const formStatus = document.getElementById("formStatus");

if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const submitBtn = document.getElementById("submitBtn");
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = "Sending...";
        submitBtn.disabled = true;

        if (formStatus) {
            formStatus.textContent = "";
            formStatus.className = "form-status";
        }

        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: form.method,
                headers: {
                    Accept: "application/json"
                },
                body: formData
            });
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || "Something went wrong. Please try again.");
            }

            form.reset();

            if (formStatus) {
                formStatus.textContent = "Appointment request sent successfully.";
                formStatus.classList.add("success");
            }
        } catch (error) {
            if (formStatus) {
                formStatus.textContent = error.message || "Please check your internet connection and try again.";
                formStatus.classList.add("error");
            }
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}
