// const { db } = require('../firebase');

class UniversityController {
  // Get all universities
  static async getAllUniversities(req, res) {
    try {
      // Hardcoded university data
      const universities = [
        {
          "id": "chandigarh-university",
          "name": "Chandigarh University",
          "location": {
            "city": "Mohali",
            "state": "Punjab"
          },
          "description": "Chandigarh University is a leading Indian institution offering its students a unique amalgamation of professional and academic excellence. The University has been accredited with the prestigious A+ grade by the National Assessment and Accreditation Council (NAAC). It is renowned for its state-of-the-art infrastructure, experienced faculty, and strong industry-academia interface. CU offers a vibrant campus life with a plethora of opportunities for holistic development.",
          "images": {
            "logo": "https://picsum.photos/seed/cu-logo/100/100",
            "banner": "https://picsum.photos/seed/cu-banner/800/400",
            "campus": ["https://picsum.photos/seed/cu-campus1/800/600", "https://picsum.photos/seed/cu-campus2/800/600"]
          },
          "website": "https://www.cuchd.in",
          "establishedYear": 2012,
          "type": "Private",
          "setting": "Urban",
          "studentPopulation": 15000,
          "quickFacts": {
            "acceptanceRate": 85,
            "gpa": "3.0",
            "satRange": "1200-1400",
            "actRange": "28-32",
            "studentFacultyRatio": "15:1",
            "graduationRate": 92
          },
          "courses": [
            {
              "id": "btech-cse",
              "category": "Engineering",
              "name": "B.Tech Computer Science Engineering",
              "stream": "Computer Science",
              "rating": 4.5,
              "reviews": 1250,
              "views": 5000,
              "fees": 150000,
              "applicationDate": "Jan 1, 2024 - Jul 31, 2024",
              "cutoffRank": "25000",
              "cutoffExam": "JEE Main"
            },
            {
              "id": "btech-mech",
              "category": "Engineering",
              "name": "B.Tech Mechanical Engineering",
              "stream": "Mechanical",
              "rating": 4.2,
              "reviews": 980,
              "views": 3200,
              "fees": 140000,
              "applicationDate": "Jan 1, 2024 - Jul 31, 2024",
              "cutoffRank": "35000",
              "cutoffExam": "JEE Main"
            }
          ],
          "fees": {
            "tuitionFee": 150000
          },
          "approval": "UGC Approved",
          "financialAid": {
            "scholarshipsAvailable": true,
            "details": "Chandigarh University offers various scholarships based on merit in the CUCET entrance exam, with up to 100% tuition fee waiver for top performers. Additional scholarships are available for students with exceptional achievements in sports, wards of defense personnel, and for students from specific states."
          },
          "admissions": {
            "deadline": "July 31, 2024",
            "requiredDocuments": ["10th and 12th Mark Sheets", "JEE Main Score Card", "Aadhaar Card", "Passport Size Photos"],
            "applicationFee": 1000,
            "internationalRequirements": "TOEFL/IELTS scores for international students, equivalent qualification certificates"
          },
          "map": {
            "address": "NH-95, Ludhiana - Chandigarh State Hwy, Punjab 140413",
            "lat": 30.7055,
            "lng": 76.8013
          },
          "notableAlumni": ["Raj Kundra", "Sunny Deol", "Poonam Pandey"],
          "popularPrograms": ["Computer Science Engineering", "Mechanical Engineering", "Business Administration", "Law"]
        }
      ];

      res.json(universities);
    } catch (error) {
      console.error('Error fetching universities:', error);
      res.status(500).json({ error: 'Failed to fetch universities' });
    }
  }

  // Get university by ID
  static async getUniversityById(req, res) {
    try {
      const { id } = req.params;
      // For now, return the hardcoded university if ID matches
      const universities = [
        {
          "id": "chandigarh-university",
          "name": "Chandigarh University",
          "location": {
            "city": "Mohali",
            "state": "Punjab"
          },
          "description": "Chandigarh University is a leading Indian institution offering its students a unique amalgamation of professional and academic excellence. The University has been accredited with the prestigious A+ grade by the National Assessment and Accreditation Council (NAAC). It is renowned for its state-of-the-art infrastructure, experienced faculty, and strong industry-academia interface. CU offers a vibrant campus life with a plethora of opportunities for holistic development.",
          "images": {
            "logo": "https://picsum.photos/seed/cu-logo/100/100",
            "banner": "https://picsum.photos/seed/cu-banner/800/400",
            "campus": ["https://picsum.photos/seed/cu-campus1/800/600", "https://picsum.photos/seed/cu-campus2/800/600"]
          },
          "website": "https://www.cuchd.in",
          "establishedYear": 2012,
          "type": "Private",
          "setting": "Urban",
          "studentPopulation": 15000,
          "quickFacts": {
            "acceptanceRate": 85,
            "gpa": "3.0",
            "satRange": "1200-1400",
            "actRange": "28-32",
            "studentFacultyRatio": "15:1",
            "graduationRate": 92
          },
          "courses": [
            {
              "id": "btech-cse",
              "category": "Engineering",
              "name": "B.Tech Computer Science Engineering",
              "stream": "Computer Science",
              "rating": 4.5,
              "reviews": 1250,
              "views": 5000,
              "fees": 150000,
              "applicationDate": "Jan 1, 2024 - Jul 31, 2024",
              "cutoffRank": "25000",
              "cutoffExam": "JEE Main"
            },
            {
              "id": "btech-mech",
              "category": "Engineering",
              "name": "B.Tech Mechanical Engineering",
              "stream": "Mechanical",
              "rating": 4.2,
              "reviews": 980,
              "views": 3200,
              "fees": 140000,
              "applicationDate": "Jan 1, 2024 - Jul 31, 2024",
              "cutoffRank": "35000",
              "cutoffExam": "JEE Main"
            }
          ],
          "fees": {
            "tuitionFee": 150000
          },
          "approval": "UGC Approved",
          "financialAid": {
            "scholarshipsAvailable": true,
            "details": "Chandigarh University offers various scholarships based on merit in the CUCET entrance exam, with up to 100% tuition fee waiver for top performers. Additional scholarships are available for students with exceptional achievements in sports, wards of defense personnel, and for students from specific states."
          },
          "admissions": {
            "deadline": "July 31, 2024",
            "requiredDocuments": ["10th and 12th Mark Sheets", "JEE Main Score Card", "Aadhaar Card", "Passport Size Photos"],
            "applicationFee": 1000,
            "internationalRequirements": "TOEFL/IELTS scores for international students, equivalent qualification certificates"
          },
          "map": {
            "address": "NH-95, Ludhiana - Chandigarh State Hwy, Punjab 140413",
            "lat": 30.7055,
            "lng": 76.8013
          },
          "notableAlumni": ["Raj Kundra", "Sunny Deol", "Poonam Pandey"],
          "popularPrograms": ["Computer Science Engineering", "Mechanical Engineering", "Business Administration", "Law"]
        }
      ];

      const university = universities.find(u => u.id === id);
      if (!university) {
        return res.status(404).json({ error: 'University not found' });
      }

      res.json(university);
    } catch (error) {
      console.error('Error fetching university:', error);
      res.status(500).json({ error: 'Failed to fetch university' });
    }
  }

  // Add a new university
  static async addUniversity(req, res) {
    try {
      const universityData = req.body;
      // For now, just return the data (no persistence)
      res.status(201).json({
        id: 'new-university-id',
        ...universityData
      });
    } catch (error) {
      console.error('Error adding university:', error);
      res.status(500).json({ error: 'Failed to add university' });
    }
  }

  // Update university by ID
  static async updateUniversity(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      // For now, just return the updated data (no persistence)
      res.json({
        id,
        ...updateData
      });
    } catch (error) {
      console.error('Error updating university:', error);
      res.status(500).json({ error: 'Failed to update university' });
    }
  }

  // Delete university by ID
  static async deleteUniversity(req, res) {
    try {
      const { id } = req.params;
      // For now, just return success (no persistence)
      res.json({ message: 'University deleted successfully' });
    } catch (error) {
      console.error('Error deleting university:', error);
      res.status(500).json({ error: 'Failed to delete university' });
    }
  }
}

module.exports = UniversityController;
