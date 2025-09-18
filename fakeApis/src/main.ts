const mimeMap = {
  txt: 'text/plain',
  json: 'application/json',
  xml: 'application/xml',
  jpg: 'image/jpeg',
  png: 'image/png'
} as const;

type MimeType = keyof typeof mimeMap;

const fileTypeOptions = new Set(Object.keys(mimeMap));

const isAvailableType = (type: string): type is MimeType =>
  fileTypeOptions.has(type);

async function* generateFile(sizeMB: number) {
  const size = sizeMB * 1024 * 1024; // _n_ MB

  const chunkSize = 1024 * 1024; // 1 MB
  const chunks = Math.ceil(size / chunkSize);
  const chunk = new Uint8Array(chunkSize).fill(48); // '0'

  let i = 0;

  while (i < chunks) {
    const remaining = size - i * chunkSize;
    if (remaining >= chunkSize) {
      yield chunk;
    } else {
      yield  chunk.slice(0, remaining);
    }
    i++;
  }
}

function processFileRequest(type: MimeType, parsedSize: number) {
  const contentType = mimeMap[type];
  const filename = `dummy.${type}`;

  return new Response(generateFile(parsedSize), {
    headers: {
      'Content-Disposition': `attachment' filename="${filename}"`,
      'Content-Type': contentType,
    },
    status: 200,
  });
}


Bun.serve({
  routes: {
    "/file/:type/:size"(req) {
      const { type, size } = req.params;
      if (!isAvailableType(type)) {
        return new Response(`Invalid type. Received "${type}". Must be one of: txt, json, xml, jpg, png.`, { status: 400 });
      }

      const parsedSize = Number.parseInt(size);

      if (Number.isNaN(parsedSize) || parsedSize > 2048 || parsedSize <= 0) {
        return new Response(`Invalid size. Received "${size}". Value must be a positive integer of 2048 of less.`)
      }

      return(processFileRequest(type, parsedSize));
    },
    "/file/:type"(req) {
      const { type } = req.params;
      if (!isAvailableType(type)) {
        return new Response(`Invalid type. Received "${type}". Must be one of: txt, json, xml, jpg, png.`, { status: 400 });
      }

      return processFileRequest(type, 100);
    },
    "/file"() {
      return processFileRequest('txt', 100);
    },
  },

  fetch(_req) {
    return new Response('Not Found', { status: 404 });
  },

  port: 3000
});

console.log('Listening on localhost:3000');
