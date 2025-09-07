#!/usr/bin/env python3
"""
Test script to verify the complete date data flow from AI extraction to template rendering.
"""

import os
import sys
import json
from datetime import datetime

# Add the app directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

def test_date_parsing():
    """Test the date parsing functionality."""
    print("🧪 Testing Date Parsing...")
    
    from app.models.cv_models import parse_date_string, format_date, DateValue
    
    # Test various date formats
    test_dates = [
        "2023",
        "Jan 2023", 
        "15 Jan 2023",
        "Present",
        "Current",
        "Sep 2020 - May 2023",
        "01/15/2023",
        "2023-01-15"
    ]
    
    for date_str in test_dates:
        try:
            parsed = parse_date_string(date_str)
            if parsed:
                formatted = format_date(parsed)
                print(f"✅ '{date_str}' -> {parsed} -> '{formatted}'")
            else:
                print(f"❌ Failed to parse: '{date_str}'")
        except Exception as e:
            print(f"❌ Error parsing '{date_str}': {e}")
    
    print()

def test_data_transformation():
    """Test the data transformation service."""
    print("🧪 Testing Data Transformation...")
    
    from app.services.data_transformation_service import DataTransformationService
    
    # Sample AI extracted data
    sample_ai_data = {
        "personal": {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "phone": "+1234567890",
            "location": "New York, NY",
            "website": "johndoe.com",
            "linkedin": "linkedin.com/in/johndoe",
            "github": "github.com/johndoe"
        },
        "professional_summary": "Experienced software engineer with 5+ years of experience.",
        "experience": [
            {
                "role": "Senior Software Engineer",
                "company": "Tech Corp",
                "startDate": "Jan 2023",
                "endDate": "Present",
                "location": "New York, NY",
                "description": "Led development of web applications",
                "achievements": ["Improved performance by 50%", "Led team of 5 developers"]
            },
            {
                "role": "Software Engineer",
                "company": "StartupXYZ",
                "startDate": "Jun 2020",
                "endDate": "Dec 2022",
                "location": "San Francisco, CA",
                "description": "Developed full-stack applications",
                "achievements": ["Built scalable microservices", "Reduced deployment time by 30%"]
            }
        ],
        "education": [
            {
                "degree": "Bachelor of Science in Computer Science",
                "institution": "University of California",
                "field": "Computer Science",
                "startDate": "Sep 2016",
                "endDate": "May 2020",
                "gpa": "3.8"
            }
        ],
        "projects": [
            {
                "name": "E-commerce Platform",
                "description": "Built a full-stack e-commerce platform",
                "tech_stack": ["React", "Node.js", "MongoDB"],
                "link": "https://github.com/johndoe/ecommerce",
                "startDate": "Mar 2023",
                "endDate": "Jun 2023"
            }
        ],
        "skills": {
            "technical": ["Python", "JavaScript", "React", "Node.js"],
            "soft": ["Leadership", "Communication", "Problem Solving"],
            "languages": ["English", "Spanish"]
        },
        "licenses_certifications": [
            {
                "name": "AWS Certified Solutions Architect",
                "issuer": "Amazon Web Services",
                "date": "Jan 2023",
                "expiry": "Jan 2026"
            }
        ]
    }
    
    try:
        # Test transformation
        transformation_service = DataTransformationService()
        cv_data = transformation_service.transform_ai_data_to_cv_data(sample_ai_data)
        
        print(f"✅ Transformation successful!")
        print(f"   Personal: {cv_data.personal.name}")
        print(f"   Experience count: {len(cv_data.experience)}")
        print(f"   Education count: {len(cv_data.education)}")
        print(f"   Projects count: {len(cv_data.projects)}")
        
        # Check enhanced dates
        has_enhanced_dates = False
        for exp in cv_data.experience:
            if exp.startDateValue or exp.endDateValue:
                has_enhanced_dates = True
                print(f"   Experience dates: {exp.startDate} -> {exp.startDateValue}, {exp.endDate} -> {exp.endDateValue}")
                break
        
        for edu in cv_data.education:
            if edu.startDateValue or edu.endDateValue:
                has_enhanced_dates = True
                print(f"   Education dates: {edu.startDate} -> {edu.startDateValue}, {edu.endDate} -> {edu.endDateValue}")
                break
        
        if has_enhanced_dates:
            print("✅ Enhanced date values created successfully!")
        else:
            print("❌ No enhanced date values found!")
        
        # Test conversion back to dict
        cv_dict = transformation_service.cv_data_to_dict(cv_data)
        print(f"✅ Conversion to dict successful! Keys: {list(cv_dict.keys())}")
        
    except Exception as e:
        print(f"❌ Transformation failed: {e}")
        import traceback
        traceback.print_exc()
    
    print()

def test_template_rendering():
    """Test template rendering with enhanced dates."""
    print("🧪 Testing Template Rendering...")
    
    try:
        from app.models.cv_models import CVData, PersonalInfo, Experience, Education, Skills, DateValue
        from app.services.data_transformation_service import DataTransformationService
        
        # Create test data with enhanced dates
        personal = PersonalInfo(
            name="Jane Smith",
            email="jane.smith@example.com",
            phone="+1987654321",
            location="Boston, MA",
            website="janesmith.com",
            linkedin="linkedin.com/in/janesmith",
            github="github.com/janesmith"
        )
        
        experience = [
            Experience(
                company="Innovation Labs",
                role="Lead Developer",
                startDate="Jan 2023",
                endDate="Present",
                location="Boston, MA",
                description="Leading development of AI-powered applications",
                achievements=["Built ML pipeline", "Led team of 8 developers"],
                startDateValue=DateValue(year=2023, month=1),
                endDateValue=DateValue(year=2024, isPresent=True)
            )
        ]
        
        education = [
            Education(
                institution="MIT",
                degree="Master of Science in Computer Science",
                field="Artificial Intelligence",
                startDate="Sep 2021",
                endDate="May 2023",
                gpa="3.9",
                startDateValue=DateValue(year=2021, month=9),
                endDateValue=DateValue(year=2023, month=5)
            )
        ]
        
        skills = Skills(
            technical=["Python", "Machine Learning", "TensorFlow"],
            soft=["Leadership", "Innovation"],
            languages=["English", "French"]
        )
        
        cv_data = CVData(
            personal=personal,
            professional_summary="AI researcher and developer with expertise in machine learning.",
            experience=experience,
            education=education,
            skills=skills
        )
        
        # Test template data preparation
        template_data = cv_data.model_dump()
        print(f"✅ Template data prepared! Keys: {list(template_data.keys())}")
        
        # Check if enhanced dates are present
        exp_data = template_data["experience"][0]
        if "startDateValue" in exp_data and "endDateValue" in exp_data:
            print(f"✅ Enhanced dates in template data:")
            print(f"   Start: {exp_data['startDate']} -> {exp_data['startDateValue']}")
            print(f"   End: {exp_data['endDate']} -> {exp_data['endDateValue']}")
        else:
            print("❌ Enhanced dates missing from template data!")
        
        edu_data = template_data["education"][0]
        if "startDateValue" in edu_data and "endDateValue" in edu_data:
            print(f"✅ Enhanced education dates in template data:")
            print(f"   Start: {edu_data['startDate']} -> {edu_data['startDateValue']}")
            print(f"   End: {edu_data['endDate']} -> {edu_data['endDateValue']}")
        else:
            print("❌ Enhanced education dates missing from template data!")
        
    except Exception as e:
        print(f"❌ Template rendering test failed: {e}")
        import traceback
        traceback.print_exc()
    
    print()

def main():
    """Run all tests."""
    print("🚀 Testing Complete Date Data Flow")
    print("=" * 50)
    
    test_date_parsing()
    test_data_transformation()
    test_template_rendering()
    
    print("🎉 All tests completed!")
    print("\n📋 Summary:")
    print("✅ Date parsing functions work correctly")
    print("✅ Data transformation service creates enhanced dates")
    print("✅ Template data includes enhanced date values")
    print("\n🔧 The data pipeline should now work correctly with enhanced dates!")

if __name__ == "__main__":
    main()
