import { getPetModel } from '../config/petDb.js'

function normalizeText(value) {
  return String(value || '').trim()
}

function serializePet(pet) {
  return {
    id: pet.id,
    ownerId: pet.ownerId,
    ownerName: pet.ownerName || '',
    name: pet.name,
    breed: pet.breed,
    age: pet.age,
    weight: pet.weight,
    vaccinationStatus: pet.vaccinationStatus,
    lastPrescriptionSummary: pet.lastPrescriptionSummary || '',
    lastPrescriptionAt: pet.lastPrescriptionAt || '',
    createdAt: pet.createdAt,
  }
}

export async function listPets(req, res) {
  const Pet = await getPetModel()
  const ownerId = normalizeText(req.query.userId)
  const query = ownerId ? { ownerId } : {}
  const pets = await Pet.find(query).sort({ createdAt: -1 }).limit(200)

  return res.status(200).json({
    pets: pets.map(serializePet),
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
    pet: serializePet(pet),
  })
}

export async function updatePet(req, res) {
  const { petId } = req.params
  const { ownerId, ownerName, name, breed, age, weight, vaccinationStatus } = req.body

  const updates = {}
  if (ownerId !== undefined) {
    updates.ownerId = normalizeText(ownerId)
  }
  if (ownerName !== undefined) {
    updates.ownerName = normalizeText(ownerName)
  }
  if (name !== undefined) {
    updates.name = normalizeText(name)
  }
  if (breed !== undefined) {
    updates.breed = normalizeText(breed)
  }
  if (age !== undefined) {
    updates.age = normalizeText(age)
  }
  if (weight !== undefined) {
    updates.weight = normalizeText(weight)
  }
  if (vaccinationStatus !== undefined) {
    updates.vaccinationStatus = normalizeText(vaccinationStatus)
  }

  const Pet = await getPetModel()
  const pet = await Pet.findByIdAndUpdate(petId, updates, {
    new: true,
    runValidators: true,
  })

  if (!pet) {
    return res.status(404).json({ message: 'Pet not found.' })
  }

  return res.status(200).json({ pet: serializePet(pet) })
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
