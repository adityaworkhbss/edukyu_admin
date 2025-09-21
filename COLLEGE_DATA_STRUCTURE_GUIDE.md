# College Management System - JSON Structure Guide

## Overview

The college management system now supports the complete JSON structure you provided, allowing you to store comprehensive university/college data in Firebase exactly as you specified.

## Data Structure

The system saves data in this exact format in Firebase:

```json
{
  "COLLEGE_KEY": {
    "database": {
      "host": "localhost",
      "user": "EDUKYU_CRM_230500001", 
      "password": "12345",
      "name": "edukyu_enqbooks"
    },
    "university_info": {
      "name": "D.Y. Patil University",
      "logo": "https://example.com/logo.png",
      "banner_image": "https://example.com/banner.jpg",
      "accreditations": [
        {
          "name": "NAAC",
          "image": "https://example.com/naac.png"
        }
      ],
      "about": {
        "description": "University description...",
        "highlights": [
          "Highlight 1",
          "Highlight 2"
        ],
        "images": [
          "https://example.com/image1.jpg"
        ]
      },
      "courses": [
        {
          "name": "Online MBA",
          "image": "https://example.com/mba.jpg",
          "duration": "2 years",
          "fees": {
            "original": "1,69,200",
            "discounted": "1,52,280"
          },
          "description": "Course description",
          "type": "PG",
          "specializations": [
            "Finance",
            "Marketing"
          ]
        }
      ],
      "benefits": [
        "Benefit 1",
        "Benefit 2"
      ],
      "degree": {
        "description": "Degree description",
        "highlights": [
          "UGC-DEB accredited degree"
        ],
        "certificate_image": "https://example.com/certificate.jpg"
      },
      "degree_sample": {
        "image": "https://example.com/sample.jpg",
        "description": "Sample description",
        "highlights": []
      },
      "admission_process": [
        {
          "step": 1,
          "description": "Step description",
          "image": ""
        }
      ],
      "placement": {
        "partners": [
          "https://example.com/partner1.png"
        ],
        "benefits": [
          "300+ Hiring Partners"
        ],
        "statistics": {
          "average_package": "Rs 4,76,000",
          "highest_package": "Rs 10,50,000"
        }
      },
      "faqs": [
        {
          "question": "Is the university UGC approved?",
          "answer": "Yes, it is UGC approved."
        }
      ]
    },
    "redirects": {
      "success": "https://example.com/thank-you"
    }
  }
}
```

## Form Interface

The form is divided into 11 tabbed sections for easy data entry:

### 1. Basic Info
- **College Key**: Unique identifier (e.g., "DYP", "MIT")
- **University Name**: Full university name
- **Logo URL**: University logo image URL
- **Banner Image URL**: Main banner/hero image URL

### 2. Database
- **Host**: Database host (e.g., localhost)
- **User**: Database username
- **Password**: Database password
- **Database Name**: Database name

### 3. About
- **Description**: Detailed university description
- **Highlights**: Key points about the university (array)
- **Images**: Gallery images (array of URLs)

### 4. Accreditations
Dynamic list of accreditations, each with:
- **Name**: Accreditation name (NAAC, AICTE, etc.)
- **Image**: Accreditation logo/certificate image URL

### 5. Courses
Dynamic list of courses, each with:
- **Name**: Course name
- **Image**: Course image URL
- **Duration**: Course duration (e.g., "2 years")
- **Type**: UG/PG/Diploma/Certificate
- **Fees**: Original and discounted fees
- **Description**: Course description
- **Specializations**: Array of specialization options

### 6. Benefits
- Dynamic list of university benefits/advantages

### 7. Degree Info
- **Description**: Degree information
- **Certificate Image**: Sample degree certificate image
- **Highlights**: Degree highlights (array)
- **Degree Sample**: Additional sample information

### 8. Admission Process
Dynamic list of admission steps, each with:
- **Step Number**: Sequential step number
- **Description**: Step description
- **Image**: Optional step illustration

### 9. Placement
- **Statistics**: Average and highest package information
- **Partners**: Array of placement partner logo URLs
- **Benefits**: Array of placement benefits

### 10. FAQs
Dynamic list of frequently asked questions, each with:
- **Question**: The question
- **Answer**: The answer

### 11. Redirects
- **Success URL**: Redirect URL after successful form submission

## How to Use

### Adding a New College

1. **Navigate to Colleges Section**: Go to `/dashboard/colleges`
2. **Click "Add College"**: Opens the comprehensive form modal
3. **Fill Basic Info**: Start with College Key and University Name (required)
4. **Complete Each Tab**: Use the tab navigation to fill all sections
5. **Dynamic Arrays**: Use "+" buttons to add items to arrays
6. **Save**: Click "Save College Data" to store in Firebase

### Editing Existing College

1. **Click Edit Icon**: Next to any college in the list
2. **Modify Data**: All existing data will be pre-filled
3. **Update**: Make changes and save

### Data Storage

- Data is stored in Firebase Firestore collection: `colleges`
- Each document contains the exact JSON structure you specified
- The College Key becomes the top-level property in the document
- Additional metadata: `createdAt`, `updatedAt`

## Key Features

### ✅ **Exact JSON Structure Match**
- Maintains your exact JSON structure in the database
- No data transformation or modification

### ✅ **Comprehensive Form Interface**
- 11 organized tabs for easy data entry
- Dynamic array management for lists
- Form validation and error handling

### ✅ **User-Friendly Interface**
- Color-coded tabs for easy navigation
- Add/remove buttons for dynamic content
- Responsive design for all screen sizes

### ✅ **Data Integrity**
- Required field validation
- URL format validation for image fields
- Consistent data structure enforcement

## Example Usage

### Sample College Key: "DYP"
When you enter "DYP" as the College Key, the final stored structure will be:

```json
{
  "DYP": {
    // All the university_info, database, redirects data
  },
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

### Multiple Colleges
You can have multiple colleges with different keys:
- "DYP" → D.Y. Patil University
- "MIT" → Maharashtra Institute of Technology  
- "PUNE_UNI" → University of Pune

## Technical Details

### Firebase Collection
- **Collection Name**: `colleges`
- **Document Structure**: Follows your exact JSON format
- **Indexing**: Automatic indexing on College Key for fast retrieval

### Form Validation
- Required fields: College Key, University Name
- URL validation for image fields
- Array item validation
- Duplicate key prevention

### Error Handling
- Network error handling
- Form validation errors
- User-friendly error messages
- Data consistency checks

## Access Control

- **Content Managers** (user_identity = 2): Full access to add/edit/delete
- **Blog Managers** (user_identity = 1): Read-only access (redirected)

The system is now ready to handle your complete college data structure exactly as you specified!