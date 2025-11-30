const { db } = require('../firebase');

class UniversityController {
  // Get all universities
  static async getAllUniversities(req, res) {
    try {
      const universitiesRef = db.collection('universities');
      const snapshot = await universitiesRef.get();
      const universities = [];

      snapshot.forEach(doc => {
        universities.push({
          id: doc.id,
          ...doc.data()
        });
      });

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
      const universityRef = db.collection('universities').doc(id);
      const doc = await universityRef.get();

      if (!doc.exists) {
        return res.status(404).json({ error: 'University not found' });
      }

      res.json({
        id: doc.id,
        ...doc.data()
      });
    } catch (error) {
      console.error('Error fetching university:', error);
      res.status(500).json({ error: 'Failed to fetch university' });
    }
  }

  // Add a new university
  static async addUniversity(req, res) {
    try {
      const universityData = req.body;
      const universitiesRef = db.collection('universities');
      const docRef = await universitiesRef.add(universityData);

      res.status(201).json({
        id: docRef.id,
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
      const universityRef = db.collection('universities').doc(id);

      await universityRef.update(updateData);

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
      const universityRef = db.collection('universities').doc(id);

      await universityRef.delete();

      res.json({ message: 'University deleted successfully' });
    } catch (error) {
      console.error('Error deleting university:', error);
      res.status(500).json({ error: 'Failed to delete university' });
    }
  }
}

module.exports = UniversityController;
