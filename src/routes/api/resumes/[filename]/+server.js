import fs from 'fs';
import path from 'path';

export async function GET({ params }) {
	const filename = params.filename;
	
	// Ensure filename is safe and doesn't contain directory traversal sequences
	if (filename.includes('..') || filename.includes('/')) {
		return new Response('Invalid filename', { status: 400 });
	}

	const filePath = path.resolve('uploads/resumes', filename);

	if (!fs.existsSync(filePath)) {
		return new Response('Not Found', { status: 404 });
	}

	const fileBuffer = fs.readFileSync(filePath);
	
	// Determine content type
	let contentType = 'application/octet-stream';
	if (filename.endsWith('.pdf')) {
		contentType = 'application/pdf';
	} else if (filename.endsWith('.doc') || filename.endsWith('.docx')) {
		contentType = 'application/msword';
	}

	return new Response(fileBuffer, {
		headers: {
			'Content-Type': contentType,
			'Content-Disposition': `inline; filename="${filename}"`
		}
	});
}
