// components/BlogEditor.js
'use client';

import { useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TipTapLink from '@tiptap/extension-link';
import ImageExt from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Link,
    Image,
    List,
    ListOrdered,
    Quote,
    Code,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Heading1,
    Heading2,
    Heading3,
    Upload,
    Save,
    Eye,
    EyeOff,
    X,
    Youtube as YoutubeIcon,
    FileText,
    FileUp,
    CheckCircle,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { uploadBlogImage } from '@/utils/blogDatabase';
import { convertDocumentToHTML, validateFileType, getFileTypeIcon, extractTextContent } from '@/utils/documentConverter';

const BlogEditor = ({
                        initialData = null,
                        onSave,
                        onCancel,
                        isEditing = false
                    }) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        shortDescription: initialData?.shortDescription || '',
        category: initialData?.category || '',
        content: initialData?.content || '',
        metaTitle: initialData?.metaTitle || '',
        metaDescription: initialData?.metaDescription || '',
        metaKeywords: initialData?.metaKeywords || '',
        imageUrl: initialData?.imageUrl || '',
        status: initialData?.status || 'draft',
        sortOrder: initialData?.sortOrder || 0,
        shortUrl: initialData?.shortUrl || ''
    });

    const [isPreview, setIsPreview] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showImageUpload, setShowImageUpload] = useState(false);
    const [showLinkDialog, setShowLinkDialog] = useState(false);
    const [linkData, setLinkData] = useState({ url: '', text: '' });
    const [showYoutubeDialog, setShowYoutubeDialog] = useState(false);
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [showDocumentUpload, setShowDocumentUpload] = useState(false);
    const [documentUploadState, setDocumentUploadState] = useState({
        file: null,
        preview: '',
        isLoading: false,
        error: null
    });

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Placeholder.configure({
                placeholder: 'Start writing your content here... or upload a document to automatically extract content.'
            }),
            TipTapLink.configure({
                openOnClick: true,
                HTMLAttributes: {
                    class: 'text-blue-600 underline',
                    rel: 'noopener noreferrer',
                    target: '_blank'
                }
            }),
            ImageExt.configure({
                inline: false,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto'
                }
            }),
            Youtube.configure({
                nocookie: false,
                modestBranding: true,
                width: 640,
                height: 360
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right', 'justify']
            })
        ],
        content: formData.content || '',
        onUpdate: ({ editor }) => {
            setFormData(prev => ({ ...prev, content: editor.getHTML() }));
        }
    });

    // Handle document upload and conversion
    const handleDocumentUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!validateFileType(file)) {
            setDocumentUploadState(prev => ({
                ...prev,
                error: 'Please select a valid document file (TXT, PDF, DOC, DOCX)'
            }));
            return;
        }

        setDocumentUploadState({
            file,
            preview: '',
            isLoading: true,
            error: null
        });

        try {
            // Extract preview text
            const previewText = await extractTextContent(file);

            setDocumentUploadState(prev => ({
                ...prev,
                preview: previewText,
                isLoading: false
            }));

        } catch (error) {
            setDocumentUploadState(prev => ({
                ...prev,
                error: 'Failed to preview document',
                isLoading: false
            }));
        }
    };

    // Convert and insert document content
    const convertAndInsertDocument = async () => {
        if (!documentUploadState.file) return;

        setDocumentUploadState(prev => ({ ...prev, isLoading: true }));
        setIsUploading(true);

        try {
            // Convert document to HTML
            const htmlContent = await convertDocumentToHTML(documentUploadState.file);

            // Insert converted content at cursor position or append to end
            if (editor) {
                editor.commands.insertContent(htmlContent);
            } else {
                setFormData(prev => ({
                    ...prev,
                    content: prev.content + (prev.content ? '<br><br>' : '') + htmlContent
                }));
            }

            // Close dialog and reset state
            setShowDocumentUpload(false);
            setDocumentUploadState({
                file: null,
                preview: '',
                isLoading: false,
                error: null
            });

            alert('Document converted and inserted successfully!');

        } catch (error) {
            console.error('Error converting document:', error);
            setDocumentUploadState(prev => ({
                ...prev,
                error: `Conversion failed: ${error.message}`,
                isLoading: false
            }));
        } finally {
            setIsUploading(false);
        }
    };

    // Remove selected document
    const removeDocument = () => {
        setDocumentUploadState({
            file: null,
            preview: '',
            isLoading: false,
            error: null
        });
    };

    // ... rest of your existing functions (handleImageUpload, insertLink, etc.)

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg">
                {/* Header and form fields remain the same */}

                {/* Enhanced Document Upload Dialog */}
                {showDocumentUpload && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Upload Document</h3>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowDocumentUpload(false);
                                        removeDocument();
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* File Upload Area */}
                                {!documentUploadState.file ? (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                        <FileUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-sm text-gray-600 mb-2">
                                            Upload your document (TXT, PDF, DOC, DOCX)
                                        </p>
                                        <p className="text-xs text-gray-500 mb-4">
                                            Supports: Text files, PDFs, Word documents with headings, tables, images, and formatting
                                        </p>
                                        <input
                                            type="file"
                                            accept=".txt,.pdf,.doc,.docx"
                                            onChange={handleDocumentUpload}
                                            className="hidden"
                                            id="document-upload"
                                        />
                                        <label
                                            htmlFor="document-upload"
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            Select Document
                                        </label>
                                    </div>
                                ) : (
                                    /* Document Preview */
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-2xl">{getFileTypeIcon(documentUploadState.file)}</span>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {documentUploadState.file.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {(documentUploadState.file.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={removeDocument}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>

                                        {/* Preview Section */}
                                        {documentUploadState.preview && (
                                            <div className="mt-4 p-3 bg-gray-50 rounded border">
                                                <h4 className="font-medium text-gray-900 mb-2">Content Preview:</h4>
                                                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                                    {documentUploadState.preview}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    This is a preview. The full document will be converted to HTML format.
                                                </p>
                                            </div>
                                        )}

                                        {/* Conversion Features List */}
                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                            <div className="flex items-center space-x-2 text-green-600">
                                                <CheckCircle className="h-4 w-4" />
                                                <span>Headings & Subheadings</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-green-600">
                                                <CheckCircle className="h-4 w-4" />
                                                <span>Paragraphs & Text Formatting</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-green-600">
                                                <CheckCircle className="h-4 w-4" />
                                                <span>Lists (Bulleted & Numbered)</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-green-600">
                                                <CheckCircle className="h-4 w-4" />
                                                <span>Tables & Structured Content</span>
                                            </div>
                                        </div>

                                        {/* Error Message */}
                                        {documentUploadState.error && (
                                            <div className="mt-4 flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded">
                                                <AlertCircle className="h-4 w-4" />
                                                <span className="text-sm">{documentUploadState.error}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Supported Formats Info */}
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-blue-900 mb-2">Supported Content Types:</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-800">
                                        <div>• Headings (H1-H6)</div>
                                        <div>• Paragraphs</div>
                                        <div>• Lists & Bullets</div>
                                        <div>• Tables</div>
                                        <div>• Bold & Italic</div>
                                        <div>• Images</div>
                                        <div>• Links</div>
                                        <div>• Page Breaks</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowDocumentUpload(false);
                                        removeDocument();
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={convertAndInsertDocument}
                                    disabled={!documentUploadState.file || documentUploadState.isLoading || isUploading}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {documentUploadState.isLoading || isUploading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Converting...
                                        </>
                                    ) : (
                                        <>
                                            <FileText className="h-4 w-4" />
                                            Convert & Insert
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add to your toolbar */}
                <button
                    type="button"
                    onClick={() => setShowDocumentUpload(true)}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Upload Document (Extracts headings, tables, images)"
                >
                    <FileText className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default BlogEditor;