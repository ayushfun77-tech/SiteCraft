// ======================
// Time Slots Generation
// ======================
const timeSlotsContainer = document.getElementById('timeSlots');

if (timeSlotsContainer) {
    const slots = ["10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];
    
    slots.forEach(slot => {
        const cleanId = "slot-" + slot.replace(/:/g, '').replace(/\s/g, '');
        const div = document.createElement('div');
        
        div.innerHTML = `
            <input type="radio" id="${cleanId}" 
                   name="preferred_time" 
                   value="${slot}" 
                   required class="hidden">
            <label for="${cleanId}" class="time-slot-label">${slot}</label>
        `;
        
        timeSlotsContainer.appendChild(div);
    });
}

// ======================
// Set Minimum Date (Today)
// ======================
const dateInput = document.getElementById('date');
if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
}

// ======================
// Form Submission
// ======================
const form = document.getElementById('bookingForm');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = document.getElementById('submitBtn');
        const originalText = btn.innerHTML;

        btn.innerHTML = "Sending...";
        btn.disabled = true;

        try {
            const formData = new FormData(form);

            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            console.log("Web3Forms Response:", data);   // For debugging

            if (data.success) {
                alert("✅ Thank you! Your appointment request has been received.\n\nWe will call you soon.");
                form.reset();
            } else {
                console.error("Submission failed:", data);
                alert("❌ " + (data.message || "Something went wrong. Please try again."));
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            alert("⚠️ Please check your internet connection and try again.");
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });
}