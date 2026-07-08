document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrasiForm');
  const steps = Array.from(document.querySelectorAll('.form-step'));
  const stepDots = Array.from(document.querySelectorAll('.step-dot'));
  const prevStep = document.getElementById('prevStep');
  const nextStep = document.getElementById('nextStep');
  const submitButton = document.getElementById('submitForm');
  const reviewSummary = document.getElementById('reviewSummary');
  let activeStep = 1;

  if (!form || !steps.length || !stepDots.length) return;

  const backendEndpoint = ''; // e.g. 'https://script.google.com/macros/s/XXXX/exec'
  const officeWA = '6285234567504';

  const previewImg = document.getElementById('previewImg');
  const previewInput = document.getElementById('foto_ktp');

  const showToast = (msg, timeout = 3000) => {
    let t = document.createElement('div');
    t.className = 'toast-message';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => { t.classList.add('is-visible'); }, 20);
    setTimeout(() => { t.classList.remove('is-visible'); setTimeout(()=>t.remove(),300); }, timeout);
  };

  const normalizeWA = (raw) => {
    if (!raw) return '';
    let s = String(raw).trim();
    s = s.replace(/[^0-9+]/g, '');
    if (s.startsWith('+')) s = s.slice(1);
    if (s.startsWith('0')) s = '62' + s.slice(1);
    return s;
  };

  const isValidEmail = (em) => {
    if (!em) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);
  };

  const updateSteps = () => {
    steps.forEach((step) => {
      step.style.display = Number(step.dataset.step) === activeStep ? 'grid' : 'none';
    });

    stepDots.forEach((dot) => {
      dot.classList.toggle('is-active', Number(dot.dataset.step) === activeStep);
    });

    prevStep.style.display = activeStep === 1 ? 'none' : 'inline-flex';
    nextStep.style.display = activeStep === steps.length ? 'none' : 'inline-flex';
    submitButton.style.display = activeStep === steps.length ? 'inline-flex' : 'none';

    if (reviewSummary) {
      const data = new FormData(form);
      const values = Object.fromEntries(data.entries());
      reviewSummary.innerHTML = `
        <p><strong>Ringkasan Pendaftaran</strong></p>
        <ul>
          <li><strong>Nama pemohon:</strong> ${values.nama || '-'} </li>
          <li><strong>No WA:</strong> ${values.wa || '-'} </li>
          <li><strong>Wilayah:</strong> ${values.wilayah || '-'} </li>
          <li><strong>Paket:</strong> ${values.paket || '-'} </li>
          <li><strong>Alamat:</strong> ${values.jl || '-'} ${values.rt ? 'RT ' + values.rt : ''} ${values.rw ? 'RW ' + values.rw : ''} </li>
          <li><strong>Kecamatan:</strong> ${values.kecamatan || '-'} </li>
          <li><strong>WiFi:</strong> ${values.ssid || '-'} / ${values.wifipass || '-'} </li>
        </ul>
      `;
    }
  };

  const goToStep = (stepNumber) => {
    activeStep = Math.min(Math.max(1, stepNumber), steps.length);
    updateSteps();
  };

  const validateStep = () => {
    const currentStep = steps.find((step) => Number(step.dataset.step) === activeStep);
    if (!currentStep) return false;
    const inputs = Array.from(currentStep.querySelectorAll('input, select, textarea'));
    for (const input of inputs) {
      if (input.required && !input.value.trim()) {
        input.focus();
        return false;
      }
    }
    return true;
  };

  if (previewInput) {
    previewInput.addEventListener('change', (ev) => {
      const f = ev.target.files && ev.target.files[0];
      if (!f) {
        previewImg.style.display = 'none';
        return;
      }
      if (!f.type.startsWith('image/')) {
        showToast('File bukan gambar');
        return;
      }
      if (f.size > 2 * 1024 * 1024) {
        showToast('Ukuran file melebihi 2 MB');
      }
      const reader = new FileReader();
      reader.onload = () => {
        previewImg.src = reader.result;
        previewImg.style.display = 'block';
      };
      reader.readAsDataURL(f);
    });
  }

  prevStep.addEventListener('click', () => goToStep(activeStep - 1));
  nextStep.addEventListener('click', () => {
    if (!validateStep()) {
      showToast('Mohon lengkapi semua kolom wajib pada langkah ini');
      return;
    }
    goToStep(activeStep + 1);
  });

  stepDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const selectedStep = Number(dot.dataset.step);
      if (selectedStep < activeStep) {
        goToStep(selectedStep);
        return;
      }
      if (validateStep()) {
        goToStep(selectedStep);
      } else {
        showToast('Selesaikan langkah saat ini terlebih dahulu');
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateStep()) {
      showToast('Mohon lengkapi semua kolom wajib sebelum mengirim');
      return;
    }

    const data = new FormData(form);
    const fields = {};
    data.forEach((v, k) => { fields[k] = v; });

    if (!fields.nama || !fields.wa || !fields.jl || !fields.kecamatan) {
      showToast('Mohon lengkapi kolom wajib (*)');
      return;
    }

    const normalizedWA = normalizeWA(fields.wa);
    if (!/^62[0-9]{7,15}$/.test(normalizedWA)) {
      showToast('Nomor WA tidak valid. Gunakan format 08xxxx atau +62xxxx');
      return;
    }
    if (!isValidEmail(fields.email)) {
      showToast('Format email tidak valid');
      return;
    }

    showToast('Memproses...');

    const lines = [];
    lines.push('Permintaan Pemasangan Baru PT Inti Data Optima');
    lines.push('Nama pemohon: ' + (fields.nama || '-'));
    lines.push('No WA aktif: ' + normalizedWA);
    lines.push('Email: ' + (fields.email || '-'));
    lines.push('Wilayah: ' + (fields.wilayah || '-'));
    lines.push('Paket: ' + (fields.paket || '-'));
    lines.push('Sharelock: ' + (fields.sharelock || '-'));
    lines.push('Alamat: ' + (fields.jl || '-') + ' RT ' + (fields.rt || '-') + ' RW ' + (fields.rw || '-') + ' Kecamatan ' + (fields.kecamatan || '-'));
    lines.push('Nama pemasang sesuai KTP: ' + (fields.nama_pemasang || fields.nama || '-'));
    lines.push('Nama WiFi: ' + (fields.ssid || '-'));
    lines.push('Password WiFi: ' + (fields.wifipass || '-'));
    lines.push('Foto KTP: terlampir jika diupload');

    let fileUrl = '';
    if (backendEndpoint) {
      try {
        const payload = { fields: fields };
        if (previewInput && previewInput.files && previewInput.files[0]) {
          const f = previewInput.files[0];
          const reader = await new Promise((res, rej) => {
            const r = new FileReader();
            r.onload = () => res(r.result);
            r.onerror = rej;
            r.readAsDataURL(f);
          });
          payload.image = reader;
        }
        const resp = await fetch(backendEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const j = await resp.json();
        if (j && j.fileUrl) fileUrl = j.fileUrl;
        showToast('Data tersimpan ke server');
      } catch (err) {
        console.error(err);
        showToast('Gagal menyimpan ke server, lanjut ke WhatsApp');
      }
    }

    if (fileUrl) lines.push('Foto KTP (link): ' + fileUrl);

    const text = lines.join('\n');
    const waUrl = 'https://wa.me/' + officeWA + '?text=' + encodeURIComponent(text);
    window.open(waUrl, '_blank');
    showToast('Membuka WhatsApp...');
  });

  updateSteps();
});
