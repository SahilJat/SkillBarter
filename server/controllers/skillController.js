
const prisma = require('../prismaClient');


const createSkill = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const newSkill = await prisma.skill.create({
      data: {
        title,
        description,
        category,
        ownerId: req.user.id
      }
    });
    res.json(newSkill);
  } catch (err) {
    res.status(500).json({ error: "Failed to create skill" });
  }
};


const getAllSkills = async (req, res) => {
  try {
    const { category } = req.query;

    const skills = await prisma.skill.findMany({
      where: category ? { category: category } : {},
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { id: 'desc' }
    });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch skills" });
  }
};


const getMySkills = async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      where: { ownerId: req.user.id }
    });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch your skills" });
  }
};

module.exports = { createSkill, getAllSkills, getMySkills };
