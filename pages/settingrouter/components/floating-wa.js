// Floating WhatsApp Button
const waBtn = document.createElement('a');
waBtn.href = 'https://wa.me/6285234567504';
waBtn.target = '_blank';
waBtn.style.position = 'fixed';
waBtn.style.bottom = '20px';
waBtn.style.right = '20px';
waBtn.style.background = '#25D366';
waBtn.style.color = '#fff';
waBtn.style.padding = '14px 18px';
waBtn.style.borderRadius = '50px';
waBtn.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
waBtn.style.zIndex = '9999';
waBtn.style.fontWeight = 'bold';
waBtn.innerText = 'WA Support';
document.body.appendChild(waBtn);