import { getPetModel } from '../config/petDb.js'

function normalizeText(value) {
  return String(value || '').trim()
}

export async function listPets(req, res) {
  const Pet = await getPetModel()
  const ownerId = normalizeText(req.query.userId)
  const query = ownerId ? { ownerId } : {}
  const pets = await Pet.find(query).sort({ createdAt: -1 }).limit(200)

  return res.status(200).json({
    pets: pets.map((pet) => ({
      id: pet.id,
      ownerId: pet.ownerId,
      name: pet.name,
      breed: pet.breed,
      age: pet.age,
      weight: pet.weight,
      vaccinationStatus: pet.vaccinationStatus,
      createdAt: pet.createdAt,
    })),
  })
}

export async function createPet(req, res) {
  const { ownerId, ownerName, name, breed, age, weight, vaccinationStatus } = req.body

  if (!name || !breed || !age || !weight || !vaccinationStatus) {
    return res.status(400).json({ message: 'Name, breed, age, weight, and vaccination status are required.' })
  }
  if (!normalizeText(ownerId)) {
    return res.status(400).json({ message: 'Owner account is required to create a pet.' })
  }

  const Pet = await getPetModel()
  const pet = await Pet.create({
    ownerId: normalizeText(ownerId),
    ownerName: normalizeText(ownerName),
    name: String(name).trim(),
    breed: String(breed).trim(),
    age: String(age).trim(),
    weight: String(weight).trim(),
    vaccinationStatus: String(vaccinationStatus).trim(),
  })

  return res.status(201).json({
    pet: {
      id: pet.id,
      ownerId: pet.ownerId,
      name: pet.name,
      breed: pet.breed,
      age: pet.age,
      weight: pet.weight,
      vaccinationStatus: pet.vaccinationStatus,
      createdAt: pet.createdAt,
    },
  })
}

export async function deletePet(req, res) {
  const { petId } = req.params
  const Pet = await getPetModel()
  const ownerId = normalizeText(req.query.userId)
  const deleted = ownerId
    ? await Pet.findOneAndDelete({ _id: petId, ownerId })
    : await Pet.findByIdAndDelete(petId)

  if (!deleted) {
    return res.status(404).json({ message: 'Pet not found.' })
  }

  return res.status(200).json({ message: 'Pet deleted successfully.' })
}
