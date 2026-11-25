// Catatan uji: gambar layar yang terlihat, dengan garis dan nomor objek. Dibuat di peramban dari DOM (html-to-image), jadi efek kaca
// (backdrop-filter) dan sebagian bayangan tidak tergambar persis; gambar hanya bantuan. Panel Catatan uji tidak ikut tergambar.
import { toCanvas } from "html-to-image";
import type { Kotak } from "./tangkap";

const BATAS = 1.4 * 1024 * 1024;
const WARNA = "#c2410c";

function keBlob(c: HTMLCanvasElement, mutu: number): Promise<Blob | null> {
  return new Promise((ok) => c.toBlob(ok, "image/jpeg", mutu));
}

function gambarKotak(c: HTMLCanvasElement, skala: number, kotak: Array<Kotak | null>) {
  const g = c.getContext("2d");
  if (!g) return;
  g.save();
  g.scale(skala, skala);
  kotak.forEach((k, i) => {
    if (!k) return;
    g.lineWidth = 3;
    g.strokeStyle = WARNA;
    g.strokeRect(k.x - 2, k.y - 2, k.w + 4, k.h + 4);
    const r = 11;
    const cx = Math.max(r, k.x - 2);
    const cy = Math.max(r, k.y - 2);
    g.beginPath();
    g.arc(cx, cy, r, 0, Math.PI * 2);
    g.fillStyle = WARNA;
    g.fill();
    g.fillStyle = "#fff";
    g.font = "bold 13px system-ui, sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(String(i + 1), cx, cy + 0.5);
  });
  g.restore();
}

/**
 * Dialog modal ada di lapisan teratas peramban; salinan DOM-nya tidak, sehingga bila ikut digambar bersama halaman posisinya
 * bergeser. Jadi dialog digambar terpisah (seluruh isinya, termasuk bagian yang tergulir) lalu ditempel tepat di letaknya di layar,
 * di atas latar redup seperti aslinya.
 */
async function tempelDialog(c: HTMLCanvasElement, skala: number, dialog: HTMLElement, akar: Element) {
  const g = c.getContext("2d");
  if (!g) return;
  const r = dialog.getBoundingClientRect();
  const tinggiIsi = Math.max(dialog.scrollHeight, Math.round(r.height));
  const d = await toCanvas(dialog, {
    width: Math.round(r.width),
    height: tinggiIsi,
    pixelRatio: skala,
    filter: (n) => n !== akar,
    style: { position: "static", inset: "auto", margin: "0", transform: "none", maxHeight: "none", height: `${tinggiIsi}px`, overflow: "visible" },
  });
  g.save();
  g.fillStyle = "rgba(60, 35, 20, 0.35)";
  g.fillRect(0, 0, c.width, c.height);
  g.drawImage(d, 0, dialog.scrollTop * skala, r.width * skala, r.height * skala, r.left * skala, r.top * skala, r.width * skala, r.height * skala);
  g.restore();
}

/**
 * Gambar area layar yang sedang terlihat. Halaman Luz Care menggulir di jendela, jadi isi digeser dengan margin (bukan transform)
 * agar bilah yang menempel di layar (position: fixed) tetap di tempatnya. null = gagal (catatan tetap disimpan tanpa gambar).
 */
export async function ambilGambar(akar: Element, kotak: Array<Kotak | null>, dialog: HTMLElement | null = null): Promise<Blob | null> {
  const lebar = window.innerWidth;
  const tinggi = window.innerHeight;
  const body = document.body;
  const gaya = getComputedStyle(body);
  const latar = getComputedStyle(document.documentElement).backgroundColor;
  let skala = Math.min(window.devicePixelRatio || 1, 2);
  try {
    for (let coba = 0; coba < 3; coba++) {
      const c = await toCanvas(body, {
        width: lebar,
        height: tinggi,
        pixelRatio: skala,
        backgroundColor: latar && latar !== "rgba(0, 0, 0, 0)" ? latar : "#ffffff",
        filter: (n) => n !== akar && n !== dialog,
        style: {
          marginTop: `${(parseFloat(gaya.marginTop) || 0) - window.scrollY}px`,
          marginLeft: `${(parseFloat(gaya.marginLeft) || 0) - window.scrollX}px`,
          width: `${body.clientWidth}px`,
        },
      });
      if (dialog) await tempelDialog(c, skala, dialog, akar);
      gambarKotak(c, skala, kotak);
      for (const mutu of [0.82, 0.65]) {
        const b = await keBlob(c, mutu);
        if (b && b.size <= BATAS) return b;
      }
      skala = Math.max(0.5, skala * 0.6);
    }
  } catch {
    return null;
  }
  return null;
}
