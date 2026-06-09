// Script para gerar icones do ContaFlow
// Execute: node generate-icons.js

const fs = require('fs');
const path = require('path');

// Gera um PNG simples de 256x256 com o letter "C" estilizado
// Usando formato BMP simples (base do .ico)

function createSimplePNG() {
  // PNG minimo: header IHDR + bloco IDAT + IEND
  // Usaremos um PNG de 1x1 pixel azul como placeholder
  // O usuario pode substituir por um icone real depois

  const width = 256;
  const height = 256;

  // Cria um buffer RGBA simples (gradiente azul-escuro)
  const pixels = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Gradiente radial do centro
      const cx = width / 2;
      const cy = height / 2;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      const maxDist = Math.sqrt(cx ** 2 + cy ** 2);
      const ratio = dist / maxDist;

      // Azul escuro no centro, mais claro nas bordas
      const r = Math.floor(30 + ratio * 60);
      const g = Math.floor(64 + ratio * 80);
      const b = Math.floor(175 + ratio * 50);
      const a = 255;

      pixels[idx] = r;
      pixels[idx + 1] = g;
      pixels[idx + 2] = b;
      pixels[idx + 3] = a;

      // Letra C simples (desenhar no centro)
      const inC = (
        // Curva esquerda do C
        (x >= 80 && x <= 120 && y >= 80 && y <= 176) ||
        // Topo do C
        (x >= 80 && x <= 176 && y >= 80 && y <= 120) ||
        // Base do C
        (x >= 80 && x <= 176 && y >= 140 && y <= 176) ||
        // Parte interna (recorte)
        (x >= 100 && x <= 160 && y >= 100 && y <= 156 && 
         !(x >= 100 && x <= 120 && y >= 100 && y <= 156))
      );

      if (inC) {
        pixels[idx] = 255;     // R
        pixels[idx + 1] = 255; // G
        pixels[idx + 2] = 255; // B
        pixels[idx + 3] = 255; // A
      }
    }
  }

  // Gera PNG manualmente usando zlib
  const zlib = require('zlib');

  // raw image data com filter bytes
  const rawData = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    rawData[y * (1 + width * 4)] = 0; // filter: none
    pixels.copy(rawData, y * (1 + width * 4) + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressed = zlib.deflateSync(rawData);

  // Monta PNG
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const typeBuffer = Buffer.from(type);
    const crcData = Buffer.concat([typeBuffer, data]);
    const crc = crc32(crcData);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc >>> 0);
    return Buffer.concat([len, typeBuffer, data, crcBuf]);
  }

  // CRC32
  function crc32(buf) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) {
      crc ^= buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
      }
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const png = Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);

  return png;
}

function createICO(pngBuffer) {
  // .ICO format: header + directory entry + PNG data
  const numImages = 1;

  // ICO header
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);     // reserved
  header.writeUInt16LE(1, 2);     // type: ICO
  header.writeUInt16LE(numImages, 4); // number of images

  // Directory entry (16 bytes)
  const entry = Buffer.alloc(16);
  entry[0] = 0;    // width (0 = 256)
  entry[1] = 0;    // height (0 = 256)
  entry[2] = 0;    // color palette
  entry[3] = 0;    // reserved
  entry.writeUInt16LE(1, 4);   // color planes
  entry.writeUInt16LE(32, 6);  // bits per pixel
  entry.writeUInt32LE(pngBuffer.length, 8);  // size of image data
  entry.writeUInt32LE(22, 12); // offset (6 + 16 = 22)

  return Buffer.concat([header, entry, pngBuffer]);
}

// Gera os arquivos
const assetsDir = __dirname;

console.log('Gerando icones do ContaFlow...');

const png = createSimplePNG();
fs.writeFileSync(path.join(assetsDir, 'icon.png'), png);
console.log('  icon.png criado (256x256)');

const ico = createICO(png);
fs.writeFileSync(path.join(assetsDir, 'icon.ico'), ico);
console.log('  icon.ico criado (256x256)');

console.log('\nIcones gerados com sucesso!');
console.log('Para usar um icone profissional, substitua os arquivos em desktop/electron/assets/');
