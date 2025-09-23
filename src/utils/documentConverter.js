// Document to HTML conversion utilities
// Note: For production use, consider using libraries like mammoth.js for .docx files

export const convertDocumentToHTML = async (file) => {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  try {
    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return await convertTextToHTML(file);
    } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await convertPDFToHTML(file);
    } else if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
      return await convertWordToHTML(file);
    } else {
      throw new Error('Unsupported file format');
    }
  } catch (error) {
    console.error('Error converting document:', error);
    throw error;
  }
};

// Convert plain text to HTML
const convertTextToHTML = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const html = text
          .split('\n')
          .map(line => {
            const trimmed = line.trim();
            if (trimmed === '') return '<br>';
            
            // Detect headings (lines that are all caps or start with #)
            if (trimmed.match(/^#{1,6}\s/) || trimmed === trimmed.toUpperCase() && trimmed.length > 3) {
              const level = trimmed.match(/^#+/)?.[0].length || 2;
              const text = trimmed.replace(/^#+\s*/, '');
              return `<h${level}>${text}</h${level}>`;
            }
            
            // Detect lists (lines starting with - or *)
            if (trimmed.match(/^[-*]\s/)) {
              return `<li>${trimmed.replace(/^[-*]\s/, '')}</li>`;
            }
            
            // Detect numbered lists
            if (trimmed.match(/^\d+\.\s/)) {
              return `<li>${trimmed.replace(/^\d+\.\s/, '')}</li>`;
            }
            
            // Regular paragraphs
            return `<p>${trimmed}</p>`;
          })
          .join('\n');
        
        resolve(html);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};

// Convert PDF to HTML (basic implementation)
const convertPDFToHTML = async (file) => {
  // For a more robust PDF conversion, you would typically use a library like pdf.js
  // This is a simplified version that extracts text
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // This is a basic implementation - for production, use a proper PDF parser
        const text = e.target.result;
        const html = `<div class="pdf-content">
          <h2>PDF Content</h2>
          <p><em>Note: This is a basic text extraction. For better results, use a dedicated PDF conversion service.</em></p>
          <div class="content">${text.replace(/\n/g, '<br>')}</div>
        </div>`;
        resolve(html);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Error reading PDF file'));
    reader.readAsText(file);
  });
};

// Convert Word document to HTML (basic implementation)
const convertWordToHTML = async (file) => {
  // For production use, consider using mammoth.js for better .docx conversion
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // This is a basic implementation - for production, use mammoth.js
        const text = e.target.result;
        const html = `<div class="word-content">
          <h2>Word Document Content</h2>
          <p><em>Note: This is a basic text extraction. For better formatting preservation, use mammoth.js library.</em></p>
          <div class="content">${text.replace(/\n/g, '<br>')}</div>
        </div>`;
        resolve(html);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Error reading Word file'));
    reader.readAsText(file);
  });
};

// Advanced document conversion using mammoth.js (requires installation)
export const convertDocumentWithMammoth = async (file) => {
  // This would require: npm install mammoth
  // import mammoth from 'mammoth';
  
  try {
    // const result = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
    // return result.value;
    
    // Fallback to basic conversion
    return await convertDocumentToHTML(file);
  } catch (error) {
    console.error('Error with mammoth conversion:', error);
    return await convertDocumentToHTML(file);
  }
};

// Extract metadata from document
export const extractDocumentMetadata = (file) => {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: new Date(file.lastModified),
    sizeFormatted: formatFileSize(file.size)
  };
};

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Validate file type
export const validateFileType = (file) => {
  const allowedTypes = [
    'text/plain',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  const allowedExtensions = ['.txt', '.pdf', '.doc', '.docx'];
  const fileName = file.name.toLowerCase();
  
  return allowedTypes.includes(file.type) || 
         allowedExtensions.some(ext => fileName.endsWith(ext));
};

// Get file type icon
export const getFileTypeIcon = (file) => {
  const fileName = file.name.toLowerCase();
  
  if (fileName.endsWith('.txt')) return '📄';
  if (fileName.endsWith('.pdf')) return '📕';
  if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) return '📘';
  
  return '📄';
};
