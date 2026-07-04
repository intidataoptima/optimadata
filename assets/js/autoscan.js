// AUTO SCAN MODEM (Frontend Demo Version)
// Note: GitHub Pages limitation - cannot fully scan LAN

async function autoScanModem() {
    const output = document.getElementById("scanResult");
    if (!output) return;

    output.innerHTML = "🔍 Scanning jaringan...<br>";

    const base = "192.168.1.";
    let found = [];

    for (let i = 1; i <= 10; i++) {
        const ip = base + i;

        output.innerHTML += `Cek ${ip}...<br>`;

        try {
            await fetch(`http://${ip}`, { mode: "no-cors" });

            found.push(ip);
            output.innerHTML += `✅ Device terdeteksi (maybe): ${ip}<br>`;
        } catch (e) {
            output.innerHTML += `❌ Tidak respon: ${ip}<br>`;
        }
    }

    output.innerHTML += "<br>--- HASIL ---<br>";

    if (found.length === 0) {
        output.innerHTML += "⚠ Tidak ada device terdeteksi (dibatasi browser / CORS)<br>";
    } else {
        output.innerHTML += found.map(ip => "🎯 " + ip).join("<br>");
    }
}
