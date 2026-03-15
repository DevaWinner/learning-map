import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const publicDir = join(process.cwd(), "public");

function createCrcTable() {
  const table = new Uint32Array(256);

  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let k = 0; k < 8; k += 1) {
      c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }

  return table;
}

const crcTable = createCrcTable();

function crc32(buffer) {
  let crc = 0xffffffff;

  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuffer = Buffer.from(type, "ascii");
  const lengthBuffer = Buffer.alloc(4);
  lengthBuffer.writeUInt32BE(data.length, 0);

  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);

  return Buffer.concat([lengthBuffer, typeBuffer, data, crcBuffer]);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function toRgba(hex, alpha = 255) {
  const normalized = hex.replace("#", "");
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
    a: alpha,
  };
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

function blend(base, overlay) {
  const alpha = overlay.a / 255;
  const inverse = 1 - alpha;

  return {
    r: Math.round(base.r * inverse + overlay.r * alpha),
    g: Math.round(base.g * inverse + overlay.g * alpha),
    b: Math.round(base.b * inverse + overlay.b * alpha),
    a: 255,
  };
}

function setPixel(buffer, width, x, y, color) {
  if (x < 0 || y < 0 || x >= width) {
    return;
  }

  const index = (y * width + x) * 4;
  buffer[index] = color.r;
  buffer[index + 1] = color.g;
  buffer[index + 2] = color.b;
  buffer[index + 3] = color.a;
}

function drawCircle(buffer, width, height, cx, cy, radius, color) {
  const x0 = Math.floor(cx - radius);
  const x1 = Math.ceil(cx + radius);
  const y0 = Math.floor(cy - radius);
  const y1 = Math.ceil(cy + radius);
  const rSquared = radius * radius;

  for (let y = y0; y <= y1; y += 1) {
    if (y < 0 || y >= height) {
      continue;
    }

    for (let x = x0; x <= x1; x += 1) {
      if (x < 0 || x >= width) {
        continue;
      }

      const dx = x + 0.5 - cx;
      const dy = y + 0.5 - cy;

      if (dx * dx + dy * dy <= rSquared) {
        const index = (y * width + x) * 4;
        const base = {
          r: buffer[index],
          g: buffer[index + 1],
          b: buffer[index + 2],
          a: buffer[index + 3],
        };
        const merged = blend(base, color);
        setPixel(buffer, width, x, y, merged);
      }
    }
  }
}

function drawRoundedRect(buffer, width, height, rect, radius, color) {
  const left = Math.max(0, Math.floor(rect.x));
  const top = Math.max(0, Math.floor(rect.y));
  const right = Math.min(width, Math.ceil(rect.x + rect.width));
  const bottom = Math.min(height, Math.ceil(rect.y + rect.height));

  for (let y = top; y < bottom; y += 1) {
    for (let x = left; x < right; x += 1) {
      const px = x + 0.5;
      const py = y + 0.5;

      const nearestX = clamp(px, rect.x + radius, rect.x + rect.width - radius);
      const nearestY = clamp(py, rect.y + radius, rect.y + rect.height - radius);
      const dx = px - nearestX;
      const dy = py - nearestY;

      if (dx * dx + dy * dy <= radius * radius) {
        const index = (y * width + x) * 4;
        const base = {
          r: buffer[index],
          g: buffer[index + 1],
          b: buffer[index + 2],
          a: buffer[index + 3],
        };
        const merged = blend(base, color);
        setPixel(buffer, width, x, y, merged);
      }
    }
  }
}

function createIconBuffer(size, { maskable = false } = {}) {
  const buffer = Buffer.alloc(size * size * 4);
  const topColor = toRgba("#0f1724");
  const bottomColor = toRgba("#111b2d");
  const glowPrimary = toRgba("#10b981", 120);
  const glowSecondary = toRgba("#f59e0b", 65);

  for (let y = 0; y < size; y += 1) {
    const verticalMix = y / (size - 1);
    const rowBase = {
      r: Math.round(lerp(topColor.r, bottomColor.r, verticalMix)),
      g: Math.round(lerp(topColor.g, bottomColor.g, verticalMix)),
      b: Math.round(lerp(topColor.b, bottomColor.b, verticalMix)),
      a: 255,
    };

    for (let x = 0; x < size; x += 1) {
      const centerOffsetX = (x - size * 0.5) / size;
      const centerOffsetY = (y - size * 0.46) / size;
      const radial = Math.max(
        0,
        1 - Math.sqrt(centerOffsetX * centerOffsetX + centerOffsetY * centerOffsetY) * 2.4,
      );

      const color = {
        r: Math.round(rowBase.r + radial * 10),
        g: Math.round(rowBase.g + radial * 14),
        b: Math.round(rowBase.b + radial * 18),
        a: 255,
      };

      setPixel(buffer, size, x, y, color);
    }
  }

  drawCircle(buffer, size, size, size * 0.28, size * 0.2, size * 0.2, glowPrimary);
  drawCircle(buffer, size, size, size * 0.82, size * 0.18, size * 0.18, glowSecondary);

  const outerMargin = maskable ? size * 0.08 : size * 0.14;
  const outerRect = {
    x: outerMargin,
    y: outerMargin,
    width: size - outerMargin * 2,
    height: size - outerMargin * 2,
  };

  drawRoundedRect(
    buffer,
    size,
    size,
    outerRect,
    size * 0.18,
    toRgba("#142236", 230),
  );

  const innerMargin = outerMargin + size * 0.075;
  const innerRect = {
    x: innerMargin,
    y: innerMargin,
    width: size - innerMargin * 2,
    height: size - innerMargin * 2,
  };

  drawRoundedRect(
    buffer,
    size,
    size,
    innerRect,
    size * 0.11,
    toRgba("#0e1727", 255),
  );

  const lineY = size * 0.56;
  const lineHeight = size * 0.04;
  drawRoundedRect(
    buffer,
    size,
    size,
    {
      x: innerRect.x + size * 0.1,
      y: lineY,
      width: innerRect.width - size * 0.2,
      height: lineHeight,
    },
    lineHeight / 2,
    toRgba("#0ea5e9", 235),
  );

  const nodes = [
    { x: size * 0.3, y: lineY + lineHeight / 2, radius: size * 0.056, color: "#10b981" },
    { x: size * 0.5, y: lineY + lineHeight / 2, radius: size * 0.05, color: "#f59e0b" },
    { x: size * 0.72, y: lineY + lineHeight / 2, radius: size * 0.065, color: "#22c55e" },
  ];

  for (const node of nodes) {
    drawCircle(
      buffer,
      size,
      size,
      node.x,
      node.y,
      node.radius * 1.55,
      toRgba(node.color, 80),
    );
    drawCircle(buffer, size, size, node.x, node.y, node.radius, toRgba(node.color));
  }

  drawRoundedRect(
    buffer,
    size,
    size,
    {
      x: innerRect.x + size * 0.11,
      y: innerRect.y + size * 0.16,
      width: size * 0.11,
      height: size * 0.28,
    },
    size * 0.03,
    toRgba("#f8fafc", 230),
  );
  drawRoundedRect(
    buffer,
    size,
    size,
    {
      x: innerRect.x + size * 0.11,
      y: innerRect.y + size * 0.47,
      width: size * 0.22,
      height: size * 0.075,
    },
    size * 0.03,
    toRgba("#f8fafc", 230),
  );

  return buffer;
}

function encodePng(width, height, rgbaBuffer) {
  const bytesPerRow = width * 4;
  const raw = Buffer.alloc((bytesPerRow + 1) * height);

  for (let y = 0; y < height; y += 1) {
    const rowStart = y * (bytesPerRow + 1);
    raw[rowStart] = 0;
    rgbaBuffer.copy(
      raw,
      rowStart + 1,
      y * bytesPerRow,
      (y + 1) * bytesPerRow,
    );
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const signature = Buffer.from([
    0x89, 0x50, 0x4e, 0x47,
    0x0d, 0x0a, 0x1a, 0x0a,
  ]);

  return Buffer.concat([
    signature,
    makeChunk("IHDR", ihdr),
    makeChunk("IDAT", deflateSync(raw, { level: 9 })),
    makeChunk("IEND", Buffer.alloc(0)),
  ]);
}

function writePng(filename, size, options) {
  const rgba = createIconBuffer(size, options);
  writeFileSync(join(publicDir, filename), encodePng(size, size, rgba));
}

function writeMaskIcon() {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f1724"/>
      <stop offset="100%" stop-color="#111b2d"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#bg)"/>
  <circle cx="132" cy="108" r="82" fill="#10b981" opacity="0.24"/>
  <circle cx="416" cy="96" r="72" fill="#f59e0b" opacity="0.14"/>
  <rect x="72" y="72" width="368" height="368" rx="80" fill="#142236" fill-opacity="0.94"/>
  <rect x="110" y="110" width="292" height="292" rx="56" fill="#0e1727"/>
  <rect x="166" y="274" width="180" height="20" rx="10" fill="#0ea5e9"/>
  <circle cx="176" cy="284" r="30" fill="#10b981" fill-opacity="0.28"/>
  <circle cx="176" cy="284" r="18" fill="#10b981"/>
  <circle cx="256" cy="284" r="26" fill="#f59e0b" fill-opacity="0.24"/>
  <circle cx="256" cy="284" r="16" fill="#f59e0b"/>
  <circle cx="344" cy="284" r="34" fill="#22c55e" fill-opacity="0.28"/>
  <circle cx="344" cy="284" r="21" fill="#22c55e"/>
  <rect x="166" y="160" width="38" height="112" rx="12" fill="#f8fafc" fill-opacity="0.94"/>
  <rect x="166" y="292" width="74" height="28" rx="12" fill="#f8fafc" fill-opacity="0.94"/>
</svg>`;

  writeFileSync(join(publicDir, "mask-icon.svg"), svg);
}

mkdirSync(publicDir, { recursive: true });
writePng("pwa-192x192.png", 192);
writePng("pwa-512x512.png", 512);
writePng("maskable-icon-512x512.png", 512, { maskable: true });
writePng("apple-touch-icon.png", 180);
writeMaskIcon();

console.log("Generated PWA icons in public/");
